// src/components/profile/ProfileSidebar.tsx (updated)
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
    CalendarIcon,
    DocumentTextIcon,
    CreditCardIcon,
    UserCircleIcon,
    CogIcon,
    BellIcon,
    HomeIcon,
    PlusIcon,
    EyeIcon,
    TrashIcon,
    PhotoIcon,
} from "@heroicons/react/24/outline";

interface MenuItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
    { name: "Appointments", href: "/profile/appointments", icon: CalendarIcon },
    {
        name: "Health-Records",
        href: "/profile/health-records",
        icon: DocumentTextIcon,
    },
    {
        name: "Payments-History",
        href: "/profile/payments-history",
        icon: CreditCardIcon,
    },
    { name: "Membership", href: "/profile/membership", icon: UserCircleIcon },
    { name: "Notifications", href: "/profile/notifications", icon: BellIcon },
    { name: "Profile Settings", href: "/profile/settings", icon: CogIcon },
];

export default function ProfileSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // User data state (you might want to fetch this from context/API)
    const [userData] = useState({
        membershipStatus: "free",
        userType: "Patient",
        title: "Mr.",
        fullName: "Janaya Ransiluni",
        email: "janaya@example.com",
        mobileNumber: "+94 77 123 4567",
        nicPassport: "123456789V",
    });

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleChoosePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
        setShowPhotoOptions(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleViewPhoto = () => {
        if (profilePhoto) {
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`
          <html>
            <head><title>Profile Photo</title></head>
            <body style="margin:0;padding:20px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
              <img src="${profilePhoto}" style="max-width:90%;max-height:90vh;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
            </body>
          </html>
        `);
            }
        }
        setShowPhotoOptions(false);
    };

    const handleDeletePhoto = () => {
        setProfilePhoto(null);
        setShowPhotoOptions(false);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Profile Section */}
                <div className="mb-8 text-center">
                    {/* Profile Circle Container */}
                    <div className="relative inline-block">
                        {/* Profile Circle */}
                        <div className="relative cursor-pointer mx-auto ml-4 mb-3">
                            <div className="relative w-24 h-24 rounded-full">
                                {profilePhoto ? (
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-blue-100">
                                        <img
                                            src={profilePhoto}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-blue-50">
                                        <span className="text-2xl font-bold text-blue-700">
                                            {getInitials(userData.fullName)}
                                        </span>
                                    </div>
                                )}

                                {/* Small + icon at bottom right */}
                                <button
                                    className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors shadow-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPhotoOptions(!showPhotoOptions);
                                    }}
                                >
                                    <PlusIcon className="w-3.5 h-3.5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Patient Name */}
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                            {userData.fullName}
                        </h2>

                        {/* Membership Status */}
                        <div className="inline-block">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    userData.membershipStatus === "premium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {userData.membershipStatus === "premium"
                                    ? "Premium Member"
                                    : "Free Member"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {/* Photo Options Dropdown */}
                {showPhotoOptions && (
                    <>
                        <div className="absolute top-32 left-6 bg-white rounded-lg shadow-lg border border-gray-200 z-20 w-64">
                            <div className="py-2">
                                <button
                                    onClick={handleChoosePhoto}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <PhotoIcon className="w-5 h-5 mr-3 text-gray-400" />
                                    Choose a Photo from gallery
                                </button>

                                <button
                                    onClick={handleViewPhoto}
                                    disabled={!profilePhoto}
                                    className={`flex items-center w-full px-4 py-3 text-sm ${profilePhoto ? "text-gray-700 hover:bg-gray-50" : "text-gray-400 cursor-not-allowed"}`}
                                >
                                    <EyeIcon className="w-5 h-5 mr-3" />
                                    View photo
                                </button>

                                <button
                                    onClick={handleDeletePhoto}
                                    disabled={!profilePhoto}
                                    className={`flex items-center w-full px-4 py-3 text-sm ${profilePhoto ? "text-red-600 hover:bg-red-50" : "text-gray-400 cursor-not-allowed"}`}
                                >
                                    <TrashIcon className="w-5 h-5 mr-3" />
                                    Delete Photo
                                </button>
                            </div>
                        </div>

                        {/* Click outside to close dropdown */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowPhotoOptions(false)}
                        />
                    </>
                )}

                {/* Navigation Menu */}
                <nav className="space-y-1 mt-8">
                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/profile" &&
                                pathname?.startsWith(item.href));

                        const IconComponent = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg
                  ${
                      isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                  transition-colors duration-200
                `}
                            >
                                <IconComponent
                                    className={`mr-3 h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Home */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link
                        href="/"
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <HomeIcon className="mr-2 h-5 w-5" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}
