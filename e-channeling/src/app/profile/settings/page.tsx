"use client";

import { useRouter } from "next/navigation";
import { UserCircle, Key, LogOut, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store";
import { useState } from "react";
import { DeleteAccountModal } from "@/components/profile/DeleteAccountModal";

export default function SettingsPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            // TODO: Implement actual API call to delete account
            // await deleteAccountAPI();

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setDeleteSuccess(true);

            // After successful deletion, logout and redirect
            setTimeout(() => {
                dispatch(logout());
                router.push("/");
            }, 2000);
        } catch (error) {
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete account. Please try again.",
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseModal = () => {
        if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setDeleteError(null);
            setDeleteSuccess(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Manage your account settings
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                    {/* My Profile */}
                    <button
                        onClick={() => router.push("/profile/settings/user")}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <UserCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900">
                                    My Profile
                                </h3>
                                <p className="text-sm mt-1 text-gray-600">
                                    View and edit your profile information
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </button>

                    {/* Change Password */}
                    <button
                        onClick={() => router.push("/forgot-password")}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <Key className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900">
                                    Change password
                                </h3>
                                <p className="text-sm mt-1 text-gray-600">
                                    Update your password
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <LogOut className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900">
                                    Logout
                                </h3>
                                <p className="text-sm mt-1 text-gray-600">
                                    Sign out from your account
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </button>

                    {/* Delete Account */}
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-red-50">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-red-600">
                                    Delete Account
                                </h3>
                                <p className="text-sm mt-1 text-red-600">
                                    Permanently delete your account
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                error={deleteError}
                success={deleteSuccess}
            />
        </div>
    );
}
