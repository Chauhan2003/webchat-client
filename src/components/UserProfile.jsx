import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { userAPI } from '../routes';
import { RiPencilFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { MdDone } from "react-icons/md";
import toast from 'react-hot-toast';

const UserProfile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [fullName, setFullName] = useState("");
    const [nameInput, setNameInput] = useState(false);
    const [about, setAbout] = useState("");
    const [aboutInput, setAboutInput] = useState(false);
    const navigate = useNavigate();
    const profileImgRef = useRef(null);
    const [profilePhoto, setProfilePhoto] = useState("");
    const [newPhotoChosen, setNewPhotoChosen] = useState(false); // New state to track photo selection
    const { authUser } = useSelector(store => store.user);

    const canEdit = authUser?.username === username;

    const handleBack = () => {
        navigate(-1);
    }

    const handleFullName = () => {
        setNameInput(!nameInput);
        setFullName(profileData?.fullName);
    }

    const handleAbout = () => {
        setAboutInput(!aboutInput);
        setAbout(profileData?.about);
    }

    const handleUpdate = async () => {
        try {
            const updatedData = {
                fullName: nameInput ? fullName : null,
                about: aboutInput ? about : null,
                profilePhoto: newPhotoChosen ? profilePhoto : null // Include photo if new photo is chosen
            };
            const res = await axios.put(`${userAPI}/profile/update`, updatedData);
            setProfileData(res.data);
            setNameInput(false);
            setAboutInput(false);
            setNewPhotoChosen(false); // Reset photo chosen state
            toast.success("Updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred during profile update")
        }
    }

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePhoto(reader.result);
                setNewPhotoChosen(true); // Set photo chosen state
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${userAPI}/profile/${username}`);
                setProfileData(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchProfile();
    }, [username]);

    return (
        <div className='relative min-w-[400px] border-r-[1px] border-gray-700 flex flex-col'>
            <div className='w-full border-b-[1px] border-gray-700 flex items-center px-2 py-2'>
                <button className="btn btn-ghost btn-circle btn-sm w-10 h-10" onClick={handleBack}>
                    <IoIosArrowBack size={24} />
                </button>
                <p className='text-2xl font-semibold text-[#FC852E] ml-3'>Profile</p>
            </div>
            <div className='flex-1 flex items-center flex-col py-10 px-8'>
                {
                    canEdit ? (
                        <div className='relative'>
                            <div className='group cursor-pointer' onClick={() => profileImgRef.current.click()}>
                                <img
                                    src={profilePhoto || profileData?.profilePhoto || `/avatar-placeholder.jpg`}
                                    className='rounded-full w-40 h-40 object-cover'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <span className='text-white font-semibold'>Select Photo</span>
                                </div>
                            </div>
                            {newPhotoChosen && (
                                <button
                                    className='absolute bottom-0 -right-[90px] mt-2 mr-2 btn border-none bg-[#FC852E] hover:bg-[#FC852E] text-white btn-sm'
                                    onClick={handleUpdate}
                                >
                                    Update
                                </button>
                            )}
                        </div>
                    ) : (
                        <img src={profileData?.profilePhoto || `/avatar-placeholder.jpg`} className='rounded-full w-40 h-40 object-cover' />
                    )
                }
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={profileImgRef}
                    onChange={handleImgChange}
                />
                <div className='w-full mt-12'>
                    <p className='text-[#FC852E] text-sm'>Name</p>
                    <div className='flex items-center justify-between gap-4'>
                        {
                            !nameInput && (
                                <span className='text-lg font-semibold'>{profileData?.fullName}</span>
                            )
                        }
                        {
                            nameInput && (
                                <input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} className='outline-none bg-transparent border-b-2 border-[#FC852E] py-1 text-lg font-semibold w-full' />
                            )
                        }
                        {
                            canEdit && (
                                nameInput ? <button className='btn btn-circle btn-ghost btn-sm w-10 h-10' onClick={handleUpdate}>
                                    <MdDone size={22} />
                                </button> : <button className='btn btn-circle btn-ghost btn-sm w-10 h-10' onClick={handleFullName}>
                                    <RiPencilFill size={22} />
                                </button>
                            )
                        }
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <p className='text-[#FC852E] text-sm'>Username</p>
                    <span className='text-lg font-semibold'>@{profileData?.username}</span>
                </div>
                <div className='w-full mt-6'>
                    <p className='text-[#FC852E] text-sm'>About</p>
                    <div className='flex items-center justify-between gap-4'>
                        {
                            !aboutInput && (
                                <span className='text-lg font-semibold'>{profileData?.about}</span>
                            )
                        }
                        {
                            aboutInput && (
                                <input type='text' value={about} onChange={(e) => setAbout(e.target.value)} className='outline-none bg-transparent border-b-2 border-[#FC852E] py-1 text-lg font-semibold w-full' />
                            )
                        }
                        {
                            canEdit && (
                                aboutInput ? <button className='btn btn-circle btn-ghost btn-sm w-10 h-10' onClick={handleUpdate}>
                                    <MdDone size={22} />
                                </button> : <button className='btn btn-circle btn-ghost btn-sm w-10 h-10' onClick={handleAbout}>
                                    <RiPencilFill size={22} />
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;
