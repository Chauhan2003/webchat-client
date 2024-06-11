import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import CreateMessage from "./CreateMessage";
import useAllMessages from "../hooks/useAllMessages";
import { formatPostDate } from "./common/FormatDate";
import axios from "axios";
import { userAPI } from "../routes";
import toast from "react-hot-toast";
import { setMessages } from "../redux/messageSlice";
import { setFriends, setSelectedChat } from "../redux/userSlice";
import useRealTimeMessages from "../hooks/useRealTimeMessages";
import ChatSkeleton from "./common/ChatSkeleton";
import { useNavigate } from "react-router-dom";

const ChatContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  useAllMessages(setIsLoading);
  useRealTimeMessages();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const endRef = useRef(null);
  const { selectedChat, friends, onlineUsers } = useSelector(
    (store) => store.user
  );
  const { messages } = useSelector((store) => store.messages);

  const isOnline = onlineUsers?.includes(selectedChat?._id);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleProfile = () => {
    navigate(`/profile/${selectedChat?.username}`);
  };

  const handleRemoveFriend = async () => {
    try {
      await axios.get(`${userAPI}/remove/${selectedChat?._id}`);
      const updatedFriends = friends.filter(
        (user) => user?._id !== selectedChat?._id
      );
      dispatch(setFriends(updatedFriends));
      dispatch(setMessages([]));
      dispatch(setSelectedChat(null));
      toast.success("User removed");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full px-4 flex items-center justify-between border-b-[1px] border-gray-700 gap-4">
        <img
          src={selectedChat?.profilePhoto || `/avatar-placeholder.jpg`}
          alt=""
          className="w-11 h-11 rounded-full"
        />
        <div className="flex w-full justify-between items-center">
          <div>
            <div className="font-semibold">{selectedChat?.fullName}</div>
            <div className="text-sm text-[#FC852E]">
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>
          <details className="dropdown dropdown-end">
            <summary className="m-1 btn btn-ghost btn-circle btn-md">
              <HiDotsVertical size={24} />
            </summary>
            <ul className="absolute right-0 p-1 shadow menu dropdown-text z-[1] bg-base-100 rounded-md text-[17px] w-32">
              <li onClick={handleProfile}>
                <a>Profile</a>
              </li>
              <li onClick={handleRemoveFriend}>
                <a>Remove</a>
              </li>
            </ul>
          </details>
        </div>
      </div>
      <div className="flex-1 flex flex-col px-4 overflow-y-auto">
        {isLoading && <ChatSkeleton />}
        {!isLoading &&
          (messages?.length === 0 ? (
            <div className="text-sm mb-2 mt-auto text-center">
              Start the chat
            </div>
          ) : (
            messages?.map((message, index) => (
              <div
                key={index}
                className={
                  selectedChat?._id === message?.senderId
                    ? "chat chat-start"
                    : "chat chat-end"
                }
              >
                <div className="chat-header mx-2">
                  <time className="text-xs opacity-50">
                    {formatPostDate(message?.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble">
                  {message?.image && (
                    <img src={message?.image} alt="" className="w-[320px]" />
                  )}
                  {message?.text && (
                    <p className="break-words max-w-[320px]">{message?.text}</p>
                  )}
                </div>
              </div>
            ))
          ))}
        <div ref={endRef}></div>
      </div>
      <CreateMessage />
    </div>
  );
};

export default ChatContainer;
