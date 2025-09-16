import { createContext, useContext, useState  , useEffect} from "react";
import { AuthContext } from "./AuthContext.jsx";
import { toast } from "react-hot-toast";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  // list of user for left sidebar
  const [users, setUsers] = useState([]);
  // we will store user id here for selected user
  const [selectedUser, setSelectedUser] = useState(null);
  // store userid and no of unseen message for this particular user
  const [unseenMessages, setUnseenMessages] = useState({});

  // import axios and socket
  const { socket, axios } = useContext(AuthContext);

  // function to get all user in side bar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to get the message for the selected user we have to get user id for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to send message to selected user message data parameter as we are sending message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // to get new message in real time
  const subscribeToMessages = async()=> {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  }

  // function to unsubscribe from messages
const unsubscribeFromMessages = () => {
  if (socket) socket.off("newMessage");
};

useEffect(() => {
  if (selectedUser) {
    getMessages(selectedUser._id);
  }
}, [selectedUser]);

useEffect(() => {
  subscribeToMessages();
  return () => unsubscribeFromMessages();
}, [socket, selectedUser]);
  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};