import express from "express";
import { config } from "dotenv";
import http from "http";
import cors from "cors";

import { connectToDB } from "./lib/lib.js";
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import userRouter from './routes/user.route.js';
import { setupWebSocketServer } from "./socket.js";
import authMiddleware from "./middleware/auth.middleware.js";

config();

export const app = express();
export const server = http.createServer(app);
connectToDB();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', authMiddleware, userRouter);
app.use('/api/v1/message', authMiddleware, messageRouter);

setupWebSocketServer(server);

server.listen(8080, console.log("server is listening..."));