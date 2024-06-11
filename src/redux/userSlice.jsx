import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        selectedChat: null,
        friends: [],
        onlineUsers: [],
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
});

export const {
    setAuthUser,
    setSelectedChat,
    setFriends,
    setOnlineUsers
} = userSlice.actions;
export default userSlice.reducer;