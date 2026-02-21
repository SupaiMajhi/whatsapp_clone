import { WebSocket, WebSocketServer } from "ws";
import { retrieveIdFromReq, populateToAllUsers } from "./lib/lib.js";
import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import { getOfflineMessagesHandler } from "./lib/lib.js";
import { setUserStatus } from "./controllers/user.controller.js";

export const clients = new Map();
export const onlineUser = new Map();
export const setupWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    
}
