import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import Friend from './Friend';
import axios from 'axios';
import { authAPI, userAPI } from '../routes';
import FriendSkeleton from './common/FriendSkeleton';
import toast from 'react-hot-toast';
import { setAuthUser, setFriends, setSelectedChat } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { setMessages } from '../redux/messageSlice';
import { setSocket } from '../redux/socketSlice';

const AllFriends = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { friends, authUser } = useSelector(store => store.user);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchFriends = async () => {
            try {
                const res = await axios.get(`${userAPI}/friends`);
                dispatch(setFriends(res.data));
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchFriends();
    }, []);

    const handleSearch = () => {
        navigate('/search');
    }

    const handleProfile = () => {
        navigate(`/profile/${authUser?.username}`)
    }

    const handleSetting = () => {
        navigate(`/setting`)
    }

    const handleLogout = async () => {
        try {
            await axios.get(`${authAPI}/logout`);
            toast.success("Logout successful");
            dispatch(setAuthUser(null));
            dispatch(setSelectedChat(null));
            dispatch(setFriends([]));
            dispatch(setMessages([]));
            dispatch(setSocket(null));
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='relative min-w-[400px] border-r-[1px] border-gray-700 flex flex-col'>
            <div className='w-full border-b-[1px] border-gray-700 flex justify-between items-center px-2'>
                <div className='text-2xl text-[#FC852E] font-semibold ml-2'>Chats</div>
                <div className='flex items-center py-1'>
                    <button className="btn btn-ghost btn-circle btn-sm w-10 h-10" onClick={() => handleSearch()}>
                        <IoSearch size={24} />
                    </button>
                    <details className="dropdown dropdown-end">
                        <summary className="m-1 btn btn-ghost btn-circle btn-sm w-10 h-10"><HiDotsVertical size={24} /></summary>
                        <ul className="p-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-md text-[17px] w-32">
                            <li onClick={() => handleProfile()}><a>Profile</a></li>
                            <li onClick={() => handleLogout()}><a>Logout</a></li>
                            <li onClick={() => handleSetting()}><a>Setting</a></li>
                        </ul>
                    </details>
                </div>
            </div>
            <div className='flex-1 overflow-y-auto'>
                {isLoading && (
                    <>
                        <FriendSkeleton />
                        <FriendSkeleton />
                        <FriendSkeleton />
                        <FriendSkeleton />
                        <FriendSkeleton />
                        <FriendSkeleton />
                        <FriendSkeleton />
                        <FriendSkeleton />
                    </>
                )}

                {
                    !isLoading && (friends?.length === 0 ? <div className='text-center mt-2 text-sm select-none'>No friend found</div> : friends?.map((user, index) => (
                        <Friend key={index} user={user} />
                    )))
                }
            </div>
        </div>
    )
}

export default AllFriends
