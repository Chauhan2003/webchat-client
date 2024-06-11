import React from 'react'
import ChatContainer from '../components/ChatContainer'
import DefaultChat from '../components/DefaultChat'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const HomePage = () => {
    const { selectedChat } = useSelector(store => store.user);
    return (
        <div className='flex w-full h-screen justify-between'>
            <Outlet />
            {
                selectedChat ? <ChatContainer /> : <DefaultChat />
            }
        </div>
    )
}

export default HomePage
