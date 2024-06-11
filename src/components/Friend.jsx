import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedChat } from '../redux/userSlice';
import { formatPostDate } from './common/FormatDate';

const Friend = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedChat, onlineUsers } = useSelector(store => store.user);

    const isOnline = onlineUsers?.includes(user?._id);

    const handleSelectChat = () => {
        dispatch(setSelectedChat(user));
    }
    return (
        <div className={`w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-base-300 border-b-[1px] border-gray-700 select-none ${selectedChat?._id === user?._id ? "bg-base-300" : ""}`} onClick={handleSelectChat}>
            <div className={`avatar ${isOnline && "online"}`}>
                <div className="w-12 h-12 rounded-full">
                    <img src={user?.profilePhoto || `/avatar-placeholder.jpg`} />
                </div>
            </div>
            <div className='flex justify-between w-full'>
                <div>
                    <div className='text-lg font-semibold'>{user?.fullName}</div>
                    <div className='text-sm'>{user?.latestMessage.slice(0, 38)}</div>
                </div>
                <div className='text-sm'>
                    {formatPostDate(user?.lastMessageTime)}
                </div>
            </div>
        </div>
    )
}

export default Friend
