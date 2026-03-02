
import { WebSocketServer } from "ws";

import { retrieveIdFromReq, sendViaSocket } from "./utils/util.js"
import { getOfflineMessages } from "./controllers/message.controller.js";

export const onlineUsers = new Map();
const setUpWebSocketServer = (server) => {

    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws, req) => {

        //retrieve id from req
        const id = await retrieveIdFromReq(req);
        if(!id) {
            ws.close();
        }
        ws.id = id;
        onlineUsers.set(id, ws);

        //fetch offline messages
        const offlineMsges = await getOfflineMessages(ws.id);
        if(offlineMsges.length > 0){
            sendViaSocket(onlineUsers, ws.id, 'offlineMsg', offlineMsges);
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
        }

        ws.onerror = (error) => {
            console.log('Server Websocket error ', error);
        }

        ws.onclose = () => {
            onlineUsers.delete(ws.id);
        }
    })
}

export default setUpWebSocketServer;