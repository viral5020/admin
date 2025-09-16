// store.js
import { createSlice } from "@reduxjs/toolkit";

const userData = JSON.parse(sessionStorage.getItem("data"));
const notificationData = JSON.parse(sessionStorage.getItem("notification"));

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        userData: userData || {},
        notificationData: notificationData || {},
        emp_permission: []
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setNotificationData: (state, action) => {
            state.notificationData = action.payload;
        },
        setEmp_permission: (state, action) => {
            state.emp_permission = action.payload;
        },
    },
});

export const { setUserData, setNotificationData, setEmp_permission } = authSlice.actions;

export default authSlice.reducer;
