import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useRealTimeMessages = () => {
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        });
        return () => socket?.off("newMessage");
    }, [setMessages, messages]);
};

export default useRealTimeMessages;