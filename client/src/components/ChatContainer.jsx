import React, { useRef, useEffect, useContext, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {

  const {messages , selectedUser , setSelectedUser , sendMessage , getMessages} = useContext(ChatContext)
  const {authUser} = useContext(AuthContext)
  const scrollEnd = useRef();
  const [input , setInput] = useState('');

  const handleSendMessage = async(e) => {
    e.preventDefault();
    if(input.trim()==="") return null;
    await sendMessage({text: input.trim()});
    setInput("")
  }
  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>

      {/*-----------header----------- */}
      <div className='flex items-center gap-3 py-3 border-b mx-4 border-stone-500'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 flex-lg text-white flex items-center gap-2'>
         {selectedUser.fullName}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/*-----------chat area----------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col mb-4 ${msg.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-2 ${msg.senderId === authUser._id ? 'flex-row-reverse' : 'flex-row'}`}>
                <img
                    src={msg.senderId === authUser._id ? authUser.profilePic : selectedUser.profilePic}
                    alt=""
                    className="w-7 h-7 rounded-full"
                />
                {msg.image ? (
                    <img
                        src={msg.image}
                        alt=""
                        className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden'
                    />
                ) : (
                    <p
                        className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white
                        ${msg.senderId === authUser._id ? 'bg-violet-500/30 rounded-br-none' : 'bg-gray-700/30 rounded-bl-none'}`}>
                        {msg.text}
                    </p>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{formatMessageTime(msg.createdAt)}</p>
        </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/*-----------input area----------- */}
      <form onSubmit={handleSendMessage} className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input type="text" placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'/>
          <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden/>
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/>
          </label>
        </div>
        <button type='submit'>
          <img src={assets.send_button} alt="" className="w-7 cursor-pointer" />
        </button>
      </form>
    </div>
  ) : (
    <div className='flex flex-col justify-center items-center gap-2'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>chat any time any where</p>
    </div>
  );
};

export default ChatContainer;