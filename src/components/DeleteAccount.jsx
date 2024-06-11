import axios from 'axios';
import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiMail } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { authAPI } from '../routes';
import { setAuthUser, setFriends, setSelectedChat } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { setSocket } from '../redux/socketSlice';

const DeleteAccount = () => {
    const [authBy, setAuthBy] = useState("Username");
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();  // Use the dispatch function

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handleAuthByClick = (authMethod) => {
        setAuthBy(authMethod);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setIsError(false);
        setErrorMessage("");

        try {
            const requestData = {
                password: credentials.password
            };

            if (authBy === "Username") {
                requestData.username = credentials.username;
            } else {
                requestData.email = credentials.email;
            }

            await axios.delete(`${authAPI}/delete`, { data: requestData });

            dispatch(setAuthUser(null));
            dispatch(setSelectedChat(null));
            dispatch(setFriends([]));
            dispatch(setMessages([]));
            dispatch(setSocket(null));
            toast.success("Account Deleted");
        } catch (err) {
            setIsError(true);
            setErrorMessage(err.response?.data?.message || "An error occurred during deleting");
        } finally {
            setIsPending(false);
        }
    };

    const selectedButtonClass = "bg-[#FC852E] text-white";

    return (
        <div className='relative min-w-[400px] border-r-[1px] border-gray-700 flex flex-col'>
            <div className='w-full border-b-[1px] border-gray-700 flex items-center px-2 py-2'>
                <button className="btn btn-ghost btn-circle btn-sm w-10 h-10" onClick={handleBack}>
                    <IoIosArrowBack size={24} />
                </button>
                <p className='text-2xl font-semibold text-[#FC852E] ml-3'>Delete Account</p>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col w-[350px]' onSubmit={handleSubmit}>
                    <div className="join join-horizontal" style={{ display: 'flex', width: '100%' }}>
                        <button
                            type="button"
                            className={`btn join-item hover:bg-[#FC852E] text-white ${authBy === "Username" && selectedButtonClass}`}
                            style={{ flex: 1 }}
                            onClick={() => handleAuthByClick("Username")}
                        >
                            Username
                        </button>
                        <button
                            type="button"
                            className={`btn join-item hover:bg-[#FC852E] text-white ${authBy === "Email" && selectedButtonClass}`}
                            style={{ flex: 1 }}
                            onClick={() => handleAuthByClick("Email")}
                        >
                            Email
                        </button>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        {authBy === "Username" ? (
                            <>
                                <AiOutlineUser size={20} />
                                <input
                                    type='text'
                                    className='grow'
                                    placeholder='Username'
                                    name='username'
                                    value={credentials.username}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '16px' }}
                                />
                            </>
                        ) : (
                            <>
                                <FiMail size={20} />
                                <input
                                    type='text'
                                    className='grow'
                                    placeholder='Email'
                                    name='email'
                                    value={credentials.email}
                                    onChange={handleInputChange}
                                    style={{ fontSize: '16px' }}
                                />
                            </>
                        )}
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <RiLockPasswordLine size={22} />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            value={credentials.password}
                            onChange={handleInputChange}
                            style={{ fontSize: '16px' }}
                        />
                    </label>
                    <button
                        type="submit"
                        className='btn rounded-md text-xl text-white'
                        style={{ backgroundColor: '#FC852E', color: 'white' }}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                    {isError && <p className='text-red-500 text-center'>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default DeleteAccount;
