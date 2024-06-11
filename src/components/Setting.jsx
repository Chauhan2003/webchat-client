import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowRoundForward } from "react-icons/io";
import { setAuthUser, setFriends, setSelectedChat } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { setSocket } from '../redux/socketSlice';
import axios from 'axios';
import { authAPI } from '../routes';
import toast from 'react-hot-toast';

const Setting = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authUser } = useSelector(store => store.user);

    const handleBack = () => {
        navigate(-1);
    }

    const handleDelete = () => {
        navigate('/delete');
    }

    const handleLogout = async () => {
        try {
            await axios.get(`${authAPI}/logout`);
            dispatch(setAuthUser(null));
            dispatch(setSelectedChat(null));
            dispatch(setFriends([]));
            dispatch(setMessages([]));
            dispatch(setSocket(null));
            toast.success("Logout successful");
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='relative min-w-[400px] border-r-[1px] border-gray-700 flex flex-col'>
            <div className='w-full border-b-[1px] border-gray-700 flex items-center px-2 py-2'>
                <button className="btn btn-ghost btn-circle btn-sm w-10 h-10" onClick={handleBack}>
                    <IoIosArrowBack size={24} />
                </button>
                <p className='text-2xl font-semibold text-[#FC852E] ml-3'>Account Setting</p>
            </div>
            <div className='w-full px-6 py-6 flex items-center gap-4'>
                <img src={authUser?.profilePhoto || `/avatar-placeholder.jpg`} alt="" className='w-[70px] h-[70px] rounded-full' />
                <div>
                    <div className='text-2xl font-semibold'>{authUser?.fullName}</div>
                    <div className='text-md'>@{authUser?.username}</div>
                </div>
            </div>
            <button className='btn btn-ghost rounded-none'>
                <div className='flex justify-between w-full items-center'>
                    <span className='w-full text-left'>Change your email</span>
                    <IoIosArrowRoundForward size={24} />
                </div>
            </button>
            <button className='btn btn-ghost rounded-none'>
                <div className='flex justify-between w-full items-center'>
                    <span className='w-full text-left'>Change your password</span>
                    <IoIosArrowRoundForward size={24} />
                </div>
            </button>
            <button className='btn btn-ghost rounded-none' onClick={() => handleDelete()}>
                <div className='flex justify-between w-full items-center'>
                    <span className='w-full text-left'>Delete your account</span>
                    <IoIosArrowRoundForward size={24} />
                </div>
            </button>
            <button onClick={() => handleLogout()} className='btn btn-ghost w-full rounded-none bg-[#FC852E] hover:bg-[#FC852E] text-xl mt-auto'>
                Logout
            </button>
        </div>
    )
}

export default Setting
