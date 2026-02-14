"use client";
import { ReactNode, useEffect, useState } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { safeDecodeJwt } from "@/lib/utils/decodeJWT";
import { logout } from "@/store/auth/authSlice";

export default function ProfileLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoginSuccess, userToken, isHydrated } = useSelector(
        (state: RootState) => state.auth,
    );
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for hydration to complete before checking auth
        if (!isHydrated) return;

        if (!isLoginSuccess || !userToken) {
            router.push("/login");
            return;
        }

        const payload = safeDecodeJwt(userToken);
        if (payload?.exp && payload.exp * 1000 < Date.now()) {
            console.warn("Token has expired. Logging out...");
            dispatch(logout());
            router.push("/login");
            return;
        }

        setIsChecking(false);
    }, [isLoginSuccess, userToken, isHydrated, router, dispatch]);

    if (!isHydrated || isChecking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#e7e9f0]">
            <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-1/4 md:sticky md:top-28 md:self-start">
                        <ProfileSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="md:w-3/4 bg-white rounded-lg shadow-md p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
