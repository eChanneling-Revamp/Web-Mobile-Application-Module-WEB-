"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { rehydrateAuth, setHydrated } from "@/store/auth/authSlice";
import { fetchMe } from "@/store/user/userSlice";
import { RootState } from "@/store";

export default function InitAuth() {
    const dispatch = useAppDispatch();
    const { userId, userToken } = useSelector((state: RootState) => state.auth);
    const { user } = useSelector((state: RootState) => state.user);

    // Rehydrate auth state from localStorage on mount BEFORE first render
    useEffect(() => {
        dispatch(rehydrateAuth());
        // Mark hydration as complete after rehydration
        dispatch(setHydrated());
    }, [dispatch]);

    useEffect(() => {
        if (userId && userToken && !user) {
            dispatch(fetchMe(userId));
        }
    }, [userId, userToken, user, dispatch]);

    return null;
}
