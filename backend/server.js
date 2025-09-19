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
// server.js (or app.js) is usually the entry point of your backend app.
// This is where you configure global middlewares that apply to all routes, like:
// cors()
// express.json()
// global middleware

//initilise socket .io server
const server = http.createServer(app);
export const io = new Server( server ,{
  cors: {origin: "*", // Replace with your frontend URL
  }})
export const userSocketMap = {};//store user id and socket id store online suer data 

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
  })
})


// import express from "express";
// const app = express();
// app.listen(3000);
// Express internally creates an HTTP server using Node’s built-in http module. You don’t see it, but it’s there.
// 🔹 Explicit way
// Sometimes you may want to create the HTTP server yourself and pass the Express app into it:
//we are creating http sever because socket io supports http server 


app.use(cors());
app.use(express.json({limit: "4mb"}));//so that all the request to the server will be passed through the  json method  

// Why /api?
// Separation:
// Clearly shows that this URL is an API route (not a frontend page).
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
