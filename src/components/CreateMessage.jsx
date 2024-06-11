import React, { useRef, useState } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from 'axios';
import { messageAPI } from '../routes';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import toast from 'react-hot-toast';

const CreateMessage = () => {
    const imgRef = useRef(null);
    const { selectedChat } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.messages);
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState("");

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
    }

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (state === "image") setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateMessage = async () => {
        if (!text && !image) {
            toast.error("Please enter a message or select an image to send.");
            return;
        }

        setIsPending(true);
        try {
            const payload = {};
            if (text) payload.text = text;
            if (image) payload.image = image;

            const res = await axios.post(`${messageAPI}/create/${selectedChat?._id}`, payload);

            dispatch(setMessages([...messages, res.data]));
            setText("");
            setImage("");
            imgRef.current.value = null;
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred during sending");
            console.log(err);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className='w-full mx-auto p-2'>
            <div className="pb-2">
                {openEmoji && (
                    <EmojiPicker
                        width='100%'
                        height={300}
                        theme='dark'
                        searchDisabled={true}
                        emojiStyle="google"
                        lazyLoadEmojis={false}
                        onEmojiClick={handleEmoji}
                    />
                )}
            </div>
            {image && (
                <div>
                    <img src={image} className='w-[100px] h-[100px] bg-white object-contain' />
                </div>
            )}
            <div className='flex items-center px-4 gap-2'>
                <img src='/smiley-icon.webp' alt="Emoji Picker" className='w-7 h-7 cursor-pointer' onClick={() => setOpenEmoji((prev) => !prev)} />
                {image ? (
                    <div className='cursor-pointer flex items-center' onClick={() => {
                        setImage(null);
                        imgRef.current.value = null;
                    }}>
                        <IoIosCloseCircleOutline size={35} />
                    </div>
                ) : (
                    <div className='cursor-pointer flex items-center' onClick={() => imgRef.current.click()}>
                        <IoAddCircleOutline size={35} />
                    </div>
                )}
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={imgRef}
                    onChange={(e) => handleImgChange(e, "image")}
                />
                <input
                    disabled={isPending}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    type='text'
                    onClick={() => setOpenEmoji(false)}
                    placeholder='Type a message...'
                    className='outline-none w-full h-full px-4 py-[9.5px] rounded-lg text-lg'
                />
                <button
                    onClick={handleCreateMessage}
                    className='btn btn-active btn-neutral text-lg bg-[#FC852E] hover:bg-[#FC852E] text-white'
                >
                    {isPending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
}

export default CreateMessage;
