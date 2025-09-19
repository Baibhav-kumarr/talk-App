//making basic server
import express from "express"
import dotenv from "dotenv";
import http from "http"
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

dotenv.config(); // load .env variables
const PORT = process.env.PORT || 5000;
const app = express();

//initilise socket .io server
const server = http.createServer(app);

// Corrected Socket.IO server with proper CORS
export const io = new Server(server, {
  cors: {
    origin: "https://talk-app-client.onrender.com"
  }
});

export const userSocketMap = {}; //store user id and socket id store online suer data

//socket io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if(userId){
    userSocketMap[userId] = socket.id;
  }
  //emmit online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Corrected Express CORS middleware
app.use(cors({ origin: "https://talk-app-client.onrender.com", credentials: true }));
app.use(express.json({limit: "4mb"}));

// API routes
app.use("/api/status", (req, res) => {
  res.send("✅ Server is live!");
});
app.use("/api/auth" , userRouter);
app.use("/api/messages", messageRouter);

// Connect to DB
await connectDB();

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

//export server for vercel deployment
export default server;