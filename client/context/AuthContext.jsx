import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
//Creates a global AuthContext → all components can use it to access authentication-related data (like token, axios, login info, etc.).
export const AuthContext = createContext();

//AuthProvider is a special wrapper component that provides authentication data to all child components.
//{ children } → means whatever you wrap inside <AuthProvider> ...
export const AuthProvider = ({ children }) => {
  //state variable use for entire application
  //initialise it with token available in local storage of web browser so if any token available in local storage it will get  stored in token 
  const [token, setToken] = useState(localStorage.getItem("token"));
  //When user logs in → backend gives a token → frontend saves it in localStorage + useState.
  //bydefault the authenticated user will be null and when we will login we will make it true and store user data in authUser
  const [authUser, setAuthUser] = useState(null);
  //by defalut the authenticated user will be null
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);
  //This value is what you’ll share globally via Context.
  //Currently, it contains only axios, but usually you also pass token, setToken, and other auth data.

  //now we will make function for different thing and pass in the value

  //1st functon will check wether user is  authenticated or not if so set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      {/**axios.get("/api/auth/check")
      Axios ek HTTP client hai jo backend ke REST APIs ko call karta hai.
      Ye code ek GET request bhej raha hai URL /api/auth/check par.
      Iska kaam hoga backend se check karna ki current user authenticated hai ya nahi (matlab login session / token abhi valid hai ya expire ho gaya). */}
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function so that user can login or register in this we need state and credentials also
  const login = async (state, credentials) => {
  try {
    const endpoint = state === "signup" ? "signup" : "login";
    const { data } = await axios.post(`/api/auth/${endpoint}`, credentials);

    if (data.success) {
      setAuthUser(data.userData);
      connectSocket(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  //logout function for user logout and socket disconnection
  const logout = async () => {
    //we remove the token and user will be logged out then set the things
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    socket.disconnect();
  };

  //for updating user profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/updateProfile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //after authentication we have to connect the user
  //we get the user data It sends the userId as a query parameter (so the backend knows which user is connecting).
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };

  //we have to use this function whenever we open the web page so we use useEffect
  //useEffect ek React Hook hai jo tumhe side effects (jaise API calls, socket connect/disconnect, DOM updates, timers, etc.) run karne ka option deta hai jab component render hota hai.
  useEffect(() => {
    if (token) {
      {/**it will add the token for all the api request make using axios */}
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
  };
  //AuthContext.Provider → makes value available to all child components.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};