import React, { useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userAPI } from '../routes';
import toast from 'react-hot-toast';
import SearchUserSkeleton from './common/SearchUserSkeleton';

const SearchUser = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchUser, setSearchUser] = useState([]);

    const handleBack = () => {
        navigate(-1);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);

        try {
            const res = await axios.post(`${userAPI}/search`, {
                username: searchInput
            })

            setSearchUser(res.data.searchUsers);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAdd = async (id) => {
        try {
            await axios.get(`${userAPI}/add/${id}`);
            navigate(-1);
            toast.success("User added");
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
                <p className='text-2xl font-semibold text-[#FC852E] ml-3'>Search</p>
            </div>
            <div className='py-2 px-2 flex border-b-[1px] border-gray-700'>
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={handleKeyPress} type='text' placeholder='Type a username...' className='outline-none w-full h-full px-4 py-2 rounded-lg' />
            </div>
            <div className='flex-1 overflow-y-auto'>
                {isLoading && (
                    <>
                        <SearchUserSkeleton />
                        <SearchUserSkeleton />
                        <SearchUserSkeleton />
                        <SearchUserSkeleton />
                        <SearchUserSkeleton />
                        <SearchUserSkeleton />
                        <SearchUserSkeleton />
                    </>
                )}
                {
                    !isLoading && (searchUser.length === 0 ? <div className='text-center mt-2 text-sm select-none'>No user found</div> : searchUser?.map((user, index) => (
                        <div key={index} className={`w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-base-300 border-b-[1px] border-gray-700 select-none`}>
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full">
                                    <img src={user?.profilePhoto || `/avatar-placeholder.jpg`} />
                                </div>
                            </div>
                            <div className='flex justify-between w-full'>
                                <div>
                                    <div className='text-lg font-semibold'>{user?.fullName}</div>
                                    <div className='text-sm'>@{user?.username}</div>
                                </div>
                            </div>
                            <button className='btn btn-sm w-14 h-8 bg-[#FC852E] hover:bg-[#FC852E] text-white' onClick={() => handleAdd(user?._id)}>
                                Add
                            </button>
                        </div>
                    )))
                }
            </div>
        </div>
    )
}

export default SearchUser
