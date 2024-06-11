import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { messageAPI } from "../routes";
import { setMessages } from "../redux/messageSlice";

const useAllMessages = (setIsLoading) => {
  const { selectedChat } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedChat) {
      dispatch(setMessages([])); // Clear messages if no chat is selected
      return;
    }

    setIsLoading(true);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${messageAPI}/${selectedChat._id}`);
        dispatch(setMessages(res.data));
      } catch (err) {
        console.error("Error fetching messages:", err);
        dispatch(setMessages([])); // Handle error case
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat, dispatch, setIsLoading]);
};

export default useAllMessages;
