import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { authAPI, baseURL } from "./routes";
import { setAuthUser, setOnlineUsers } from "./redux/userSlice";
import LoadingSpinner from "./components/common/LoadingSpinner";
import axios from "axios";
import io from "socket.io-client";
import HomePage from "./pages/HomePage";
import SearchUser from "./components/SearchUser";
import AllFriends from "./components/AllFriends";
import { setSocket } from "./redux/socketSlice";
import UserProfile from "./components/UserProfile";
import Setting from "./components/Setting";
import DeleteAccount from "./components/DeleteAccount";

axios.defaults.withCredentials = true;

const App = () => {
  const { authUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchAuthUserData = async () => {
      try {
        const res = await Promise.race([
          axios.get(`${authAPI}/me`),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 10000)
          ),
        ]);
        dispatch(setAuthUser(res.data));
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUserData();
  }, []);

  useEffect(() => {
    if (authUser) {
      const socketio = io(`${baseURL}`, {
        query: {
          userId: authUser._id,
        },
      });
      dispatch(setSocket(socketio));

      socketio?.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <Routes>
      <Route
        path="/register"
        element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={authUser ? <HomePage /> : <Navigate to="/login" />}
      >
        <Route index element={<AllFriends />} />
        <Route path="search" element={<SearchUser />} />
        <Route path="setting" element={<Setting />} />
        <Route path="delete" element={<DeleteAccount />} />
        <Route path="profile/:username" element={<UserProfile />} />
      </Route>
    </Routes>
  );
};

export default App;
