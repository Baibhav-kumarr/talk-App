import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

// Get all users except logged-in user + unread message count
messageRouter.get("/users", protectRoute, getUsersForSidebar);
// Get all messages between logged-in user and selected user
messageRouter.get("/:id", protectRoute, getMessages);
// Mark a specific message as seen using message id
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage)
export default messageRouter;