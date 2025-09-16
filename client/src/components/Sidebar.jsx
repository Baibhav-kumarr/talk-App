
import assets  from '../assets/assets';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import React, { useEffect, useState , useContext } from "react";
//Yaha pe { selectedUser, setSelectedUser } directly props me destructure ho rahe hain.
//👉 Matlab jab Sidebar component ko call/ use karte ho, tab parent component usko ye do props pass karta hai.
//as we are selecting the user from the right sidebar
const Sidebar = () => {
  const {getUsers , users , setSelectedUser , selectedUser , unseenMessages , setUnseenMessages} = useContext(ChatContext)
  const { logout , onlineUser } = useContext(AuthContext);
 const navigate = useNavigate();
 const [input , setInput] = useState(false)
 // const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) :users;
const filteredUsers = input
  ? (users || []).filter((user) =>
      user.fullName.toLowerCase().includes(input.toLowerCase())
    )
  : (users || []);
  
useEffect(()=>{
  getUsers();
  
} , [onlineUser])
return (
    <div className ={`bg-gradient-to-b from-[#181829] to-[#23234a] h-full p-8 text-white overflow-y-auto rounded-l-3xl shadow-2xl border-r border-[#282142] transition-all duration-300 ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* logo and menu section */}
      <div className='pb-5'>
        {/* QuickChat logo text */}
        <div className="flex justify-between items-center ">
          <img src={assets.logo} alt="logo" className='max-w-40 ' />
           {/* Menu dropdown */}
        <div className='relative py-2 group'>
          <img
            src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer opacity-80 hover:opacity-100 transition'/>
          <div className='absolute top-full right-0 mt-3 w-48 rounded-xl bg-[#23234a] border border-violet-700 shadow-2xl text-gray-200 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all duration-200 z-20'>
            <p onClick={() => navigate('/profile')}
              className='px-5 py-3 cursor-pointer text-base hover:bg-violet-600/40 transition font-medium'>Edit Profile </p>
            <hr className='border-violet-700' />
            <p onClick={() => logout()}
              className='px-3 py-2 cursor-pointer text-base hover:bg-violet-600/40 transition font-medium'>  Logout</p>
          </div>
        </div>
        </div>
       
      </div>

      {/* search bar */}
      <div className='bg-[#282142] flex items-center gap-3 px-5 py-3 rounded-2xl mb-8 focus-within:ring-2 focus-within:ring-violet-500 shadow-lg border border-[#23234a] transition'>
        <img src={assets.search_icon} alt="search" className='w-5 opacity-70' />
        <input onChange={(e)=>setInput(e.target.value)}
          type="text"
          className='bg-transparent border-none outline-none text-white flex-1 placeholder-gray-400 text-base'
          placeholder='Search user...'
        />
      </div>

      {/* user list */}
      <div className="flex flex-col ">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => { setSelectedUser(user) }}
            key={index}
            className={`relative flex items-center gap-2 p-2 rounded-2xl cursor-pointer max-sm:text-sm transition-all duration-200 ${
              selectedUser?._id === user._id
                ? "bg-violet-600/60 shadow-lg"
                : "hover:bg-[#2d2b40] hover:shadow"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className='w-[35px] aspect-[1/1] rounded-full '
            />
            <div className='flex flex-col leading-5'>
              <p >{user.fullName}</p>
              {
                onlineUser.includes(user._id)
                  ? <span className='text-green-400 text-xs '>online</span>
                  : <span className='text-neutral-400 text-xs '>offline</span>
              }
            </div>
            {unseenMessages[user._id]>0 && (
              <p className='absolute top-3 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500 text-white shadow font-bold'>
               {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/**Dummy data (userDummyData) ke basis pe ek list of users banata hai.

      Har user row ke andar:
      Profile picture (ya default avatar).
      Full name.
      Online/offline status (pehle 3 users online, baaki offline).
      Jab kisi user pe click karte ho → setSelectedUser(user) call hota hai.
      Isse state update hota hai aur ChatContainer me wo user open ho jaata hai.
      Agar current user hi selected hai (selectedUser?._id === user._id) → uski row ko purple background milta hai (bg-[#282142]/50).
      Agar index > 2 (offline users) → ek chhota counter badge right side me show hota hai. */}
    </div>
  );
};

export default Sidebar;