"use client";
import React from "react";
import { X, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    error?: string | null;
    success?: boolean;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    error = null,
    success = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/20 backdrop-blur-[4px]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-black" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">
                            Delete Account
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-4 py-4 sm:px-6 sm:py-5">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-green-900 mb-1">
                                    Account Deleted Successfully
                                </h4>
                                <p className="text-xs sm:text-sm text-green-700">
                                    Your account has been permanently deleted. You will be redirected to the home page.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && !success && (
                        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-red-900 mb-1">
                                    Deletion Failed
                                </h4>
                                <p className="text-xs sm:text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Warning Message - Only show when not success */}
                    {!success && (
                        <>
                            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm sm:text-base font-semibold mb-2">
                                    ⚠️ Warning: This action is permanent!
                                </p>
                                <p className="text-red-700 text-xs sm:text-sm">
                                    Deleting your account will permanently remove:
                                </p>
                                <ul className="mt-2 space-y-1 text-xs sm:text-sm text-red-700 list-disc list-inside">
                                    <li>All your personal information</li>
                                    <li>Your appointment history</li>
                                    <li>Your health records</li>
                                    <li>All saved preferences</li>
                                </ul>
                            </div>

                            <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                                Are you absolutely sure you want to delete your account? <b>This action cannot be undone.</b>
                            </p>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
                    {success ? (
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {error ? "Close" : "Cancel"}
                            </button>
                            {!error && (
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        "Yes, Delete My Account"
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
