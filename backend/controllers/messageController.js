import User from '../models/User.js';
import Message from '../models/Message.js';
import cloudinary from '../lib/cloudinary.js';
import{io , userSocketMap} from '../server.js';

// Get all users except logged-in user + unread message count
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    // 1. Get all users except logged in user
    const filteredUser = await User.find({ _id: { $ne: userId } }).select('-password');
    // 2. For each user, count unread messages (where receiver = loggedInUser that mean userId and sender = that user)
    const unseenMessages = {};
    await Promise.all(filteredUser.map(async (user) => {
      const messageCount = await Message.countDocuments({ senderId: user._id, receiverId: userId, seen: false });
      if (messageCount > 0) {
        unseenMessages[user._id] = messageCount;
      }
    }));
    res.json({ success: true, users: filteredUser, unseenMessages });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// Get all messages between logged-in user and selected user
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id; // from protectRoute middleware
    const { id:selectedUserId } = req.params; // selected user id

    // 1. Fetch all messages where sender/receiver = either loggedInUser or selected user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId:myId }
      ],
    })
    // 2. Mark unread messages as seen (where selected user sent messages to logged in user)
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      {  seen: true  }
    );
    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// Mark a specific message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id,
      {seen: true});
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// Additional functionalities like sending messages can be added here

export const sendMessage = async (req, res) => {
  try {
    const {text , image} = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await  Message.create({
        senderId,
        receiverId, 
        text,
        image: imageUrl
})
//before response we update message in socket
const receiverSocketId = userSocketMap[receiverId];
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage" , newMessage);
}

    res.json({success:true , message: newMessage});

}
    catch(err){
        console.error(err);
        res.json({ success: false, message: err.message });
    }}