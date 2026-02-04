import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "@/store/doctor/doctorSlice";
import authReducer from "@/store/auth/authSlice";
import bookingReducer from "@/store/booking/bookingSlice";
import searchReducer from "@/store/search/searchSlice";
import profileReducer from "./profile/profileSlice";
import notificationReducer from "@/store/notifications/notificationSlice";
import hospitalsReducer from "@/store/hospitals/hospitalsSlice";
import paymentReducer from "@/store/payment/paymentSlice";
import userReducer from "@/store/user/userSlice";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        doctor: doctorReducer,
        auth: authReducer,
        booking: bookingReducer,
        search: searchReducer,
        notifications: notificationReducer,
        hospitals: hospitalsReducer,
        payment: paymentReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
