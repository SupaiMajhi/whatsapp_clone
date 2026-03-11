
import { WebSocketServer, WebSocket } from "ws";

import { retrieveIdFromReq } from "./utils/util.js"
import { getOfflineMessages } from "./controllers/message.controller.js";
import { onDelivered, onSeen } from "./handlers/socket.handlers.js";

export const onlineUsers = new Map();
const setUpWebSocketServer = (server) => {

    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws, req) => {

        //retrieve id from req
        const id = await retrieveIdFromReq(req);
        if(!id) {
            ws.close();
            return;
        }
        ws.id = id;
        onlineUsers.set(id, ws);

        //fetch offline messages
        const offlineMsges = await getOfflineMessages(id);
        if(offlineMsges.length > 0){
            sendViaSocket(id, 'offline_msg', { data: offlineMsges});
        }

        ws.on('message', (data) => {
            try{
                const message = JSON.parse(data.toString());
                console.log(message)

                if(message.type === "message_delivered"){
                    onDelivered(message.content.data)  //data => [id, id, id, id]
                }

                if(message.type === "message_seen"){
                    onSeen(message.content.data); //data => [id, id, id, id]
                }
            } catch(err){
                console.log('Error in socket.js', err.message);
            }
        });

        ws.on('error', (error) => {
            console.log('Server Websocket error ', error);
            onlineUsers.delete(id);
        });

        ws.on('close', () => {
            onlineUsers.delete(id);
        });
    })
}

export const sendViaSocket = (id, msgType, content) => {
    const ws = onlineUsers.get(id);
    if(ws?.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
            type: msgType,
            content
        }));
    }
}

export const sendBothViaSocket = (sender, receiver, msgType, content) => {
    const senderWS = onlineUsers.get(sender);
    const receiverWS = onlineUsers.get(receiver);

    if(senderWS?.readyState === WebSocket.OPEN){
        senderWS?.send(JSON.stringify({
            type: msgType,
            content
        }));
    }

    if(receiverWS?.readyState === WebSocket.OPEN){
        receiverWS?.send(JSON.stringify({
            type: msgType,
            content
        }));
    }
}

export default setUpWebSocketServer;