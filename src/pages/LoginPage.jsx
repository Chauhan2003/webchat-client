import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { FiMail } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { authAPI } from "../routes";
import { setAuthUser } from "../redux/userSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const [authBy, setAuthBy] = useState("Username");
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setIsError(false);
        setErrorMessage("");

        try {
            const res = await axios.post(`${authAPI}/login`, {
                username: authBy === "Username" ? credentials.username : null,
                email: authBy === "Email" ? credentials.email : null,
                password: credentials.password
            });

            dispatch(setAuthUser(res.data));
            toast.success("Login successful!");
        } catch (err) {
            setIsError(true);
            setErrorMessage(err.response?.data?.message || "An error occurred during login");
        } finally {
            setIsPending(false);
        }
    };

    const selectedButtonClass = "bg-[#FC852E] text-white";
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='flex gap-2 items-center justify-center absolute left-6 top-6'>
                <img src={'/chitchatLogo.svg'} alt="logo.svg" className="w-9" />
                <p className="text-xl text-white font-semibold">ChitChat</p>
            </div>

            <div className='flex flex-col justify-center items-center'>
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
                        {isPending ? "Loading..." : "Login"}
                    </button>
                    {isError && <p className='text-red-500 text-center'>{errorMessage}</p>}
                </form>
                <div className='mt-2'>
                    <p className='text-white text-lg'>Don't have an account? <Link to='/register' className="text-[#FC852E] hover:underline">
                        Register
                    </Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
