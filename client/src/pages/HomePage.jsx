import React, { useContext } from 'react';
import { useState } from 'react';
//contain all 3 component
import Sidebar from '../components/Sidebar.jsx';
import RightSidebar from '../components/RightSidebar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import { ChatContext } from '../../context/ChatContext';

const Homepage = () => {
 const {selectedUser , setSelectedUser} = useContext(ChatContext)
  //const [selectedUser, setSelectedUser] = useState(false);
  return (
    <div className='w-full h-screen p-4 sm:p-6 md:p-8'>
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
          selectedUser
            ? 'md:grid-cols-[320px_1fr_320px]'
            : 'md:grid-cols-[320px_1fr]'
        }`}>
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Homepage;