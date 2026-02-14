"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import {
    CalendarIcon,
    DocumentTextIcon,
    CreditCardIcon,
    UserCircleIcon,
    CogIcon,
    BellIcon,
    HomeIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user } = useSelector((state: RootState) => state.user);

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
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
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-blue-50">
                                    <span className="text-2xl font-bold text-blue-700">
                                        {getInitials(user?.name || "")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Patient Name */}
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                            {user?.name}
                        </h2>

                        {/* Membership Status */}
                        <div className="inline-block">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${user?.packageId === "PREMIUM MEMBER"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {user?.packageId === "PREMIUM MEMBER"
                                    ? "Premium Member"
                                    : "Free Member"}
                            </span>
                        </div>
                    </div>
                </div>

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
                  ${isActive
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
