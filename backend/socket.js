
import { WebSocketServer } from "ws";

import { retrieveIdFromReq } from "./utils/util.js"

export const setUpWebSocketServer = (server) => {

    const onlineUsers = new Map();
    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws, req) => {

        //retrieve id from req
        const id = await retrieveIdFromReq(req);
        if(!id) {
            ws.close();
        }
        ws.id = id;
        onlineUsers.set(id, ws);

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