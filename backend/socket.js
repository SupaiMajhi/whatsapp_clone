import { WebSocket, WebSocketServer } from "ws";
import { retrieveIdFromReq, populateToAllUsers } from "./lib/lib.js";
import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import { getOfflineMessagesHandler } from "./controllers/message.controller.js";
import { setUserStatus } from "./controllers/user.controller.js";

export const clients = new Map();
export const onlineUser = new Map();
export const setupWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws, req) => {
        const id = await retrieveIdFromReq(req);
        ws.id = id;
        clients.set(id, ws);
        const response = await setUserStatus(ws.id);
        populateToAllUsers(wss.clients, 'STATUS', { isOnline:response }, ws.id);
        
        //everytime a user comes online, fetch all the undelivered messages
        const offlineMessages = await getOfflineMessagesHandler(id);
        if(offlineMessages.length > 0){
            ws.send(JSON.stringify({
                type: 'offline_msg',
                content: {
                    data: offlineMessages //can be an array
                }
            }));
        }

        ws.on('message', async(event) => {
            const message = JSON.parse(event);
            if(message.type === 'markAsDelivered'){
                const updatedMessages = [];
                //if content.data is an array
                if(Array.isArray(message.content.data)){
                    for(const msg of message.content.data){
                        //check for ack is coming from receiverId
                        if(ws.id === msg.receiverId){
                             //todo: optimize the db write, for now problem is that for example for a specific user if there are multiple msg that has to update, currently we are updating them one by one by which there are so many db writes going on, but optimization is if we can batch the messages for the same user then the db write will be become less
                            //one way to obtain this is first use updateMany and then use db.find with $in where id will be equal to the ids of data
                            let newMsg = await Message.findByIdAndUpdate(msg._id, {isDelivered: true, deliveredAt: message.content.time}, {new: true});
                            updatedMessages.push(newMsg);
                        }
                    }
                }
                //else if not an array
                else{
                    if(ws.id === message.content.data.receiverId){
                        console.log(message.content.data)
                        let newMsg = await Message.findByIdAndUpdate(message.content.data._id, {isDelivered: true, deliveredAt: message.content.time}, {new: true});
                        updatedMessages.push(newMsg);
                    }
                }
               
                
                //todo: in future there will be group chat also, in which there can be multiple sender, but for now we are assuming that sender id is same for all the messages                    
                //todo: same here if we can optimize this also, for the same sender if we can batch all the msg and then send them to the end user
                updatedMessages.forEach((msg) => {
                    const senderSocket = clients.get(msg.senderId.toString());

                    if(senderSocket && senderSocket.readyState === WebSocket.OPEN){
                        senderSocket.send(JSON.stringify({
                            type: 'msg_delivered',
                            content: {
                                data: msg
                            }
                        }));
                    }
                //todo: figure out a logic for when sendersocket is offline
                })
            }          

            if(message.type === 'markAsSeen'){
                console.log(message.content.data)
                //message.content.data should be an array
                if(Array.isArray(message.content.data)){
                    await Message.updateMany({ _id: { $in: message.content.data }}, { $set: { isSeen: true , readAt: new Date() }});
                    
                    //fetch the messages
                    const updatedMessages = await Message.find({ _id: { $in: message.content.data }}, { _id:1, senderId:1, isSeen:1, readAt:1 });
                    //send ack to sender
                    updatedMessages.forEach((m) => {
                        const senderSocket = clients.get(m.senderId.toString());
                        if(senderSocket && senderSocket.readyState === WebSocket.OPEN){
                            senderSocket.send(JSON.stringify({
                                type: "msg_seen",
                                content: {
                                    data: updatedMessages,
                                }
                            }))
                        }
                    })
                }
            }

            if(message.type === 'typing'){
                const senderId = ws.id;
                const receiverId = message.content.receiverId;
                const receiverSocket = onlineUser.get(receiverId);
                if(receiverId && receiverId.readyState === WebSocket.OPEN){
                    receiverSocket.send(JSON.stringify({
                        type: 'typing',
                        whoIsTyping: senderId
                    }))
                }
            }
        })


        ws.on('close', async () => {
            console.log('closed', ws.id);
            clients.delete(id);
            const response = await User.findByIdAndUpdate(ws.id, { isOnline: false, lastSeen: new Date() }, {new:true});
            populateToAllUsers(wss.clients, 'STATUS', {isOnline:response.isOnline, lastSeen:response.lastSeen}, ws.id);
        });
    });
}
