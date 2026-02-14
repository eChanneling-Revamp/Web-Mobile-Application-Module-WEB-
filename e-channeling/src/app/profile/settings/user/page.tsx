"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { updateUser } from "@/store/user/userSlice";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Phone,
    CreditCard,
    Globe,
    Calendar,
    Users,
    ArrowLeft,
    Edit2,
    Save,
    X,
    IdCard,
    Briefcase,
    CheckCircle2,
    XCircle,
    Award,
    UserCircle,
} from "lucide-react";

export default function UserProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector(
        (state: RootState) => state.user,
    );

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        contactNumber: user?.contactNumber || "",
        nicNumber: user?.nicNumber || "",
        passportNumber: user?.passportNumber || "",
        nationality: user?.nationality || "",
        title: user?.title || "Mr",
        age: user?.age || 0,
        gender: user?.gender || "male",
    });

    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
        setSaveError(null);
        setSaveSuccess(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSaveError(null);
        setSaveSuccess(false);
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            contactNumber: user?.contactNumber || "",
            nicNumber: user?.nicNumber || "",
            passportNumber: user?.passportNumber || "",
            nationality: user?.nationality || "",
            title: user?.title || "Mr",
            age: user?.age || 0,
            gender: user?.gender || "male",
        });
    };

    const handleSave = async () => {
        if (!user?.id) return;

        setSaveError(null);
        setSaveSuccess(false);

        // Helper function to normalize values for comparison (treat empty string and null/undefined as the same)
        const normalize = (value: any) => {
            if (value === null || value === undefined || value === "")
                return null;
            return value;
        };

        // Only send changed fields
        const changedFields: Partial<typeof formData> = {};

        if (normalize(formData.name) !== normalize(user.name))
            changedFields.name = formData.name;
        if (normalize(formData.email) !== normalize(user.email))
            changedFields.email = formData.email;
        if (normalize(formData.contactNumber) !== normalize(user.contactNumber))
            changedFields.contactNumber = formData.contactNumber;
        if (normalize(formData.nicNumber) !== normalize(user.nicNumber))
            changedFields.nicNumber = formData.nicNumber;
        if (
            normalize(formData.passportNumber) !==
            normalize(user.passportNumber)
        )
            changedFields.passportNumber = formData.passportNumber;
        if (normalize(formData.nationality) !== normalize(user.nationality))
            changedFields.nationality = formData.nationality;
        if (formData.title !== user.title) changedFields.title = formData.title;
        if (formData.age !== user.age) changedFields.age = formData.age;
        if (formData.gender !== user.gender)
            changedFields.gender = formData.gender;

        // If no changes, just exit edit mode
        if (Object.keys(changedFields).length === 0) {
            setIsEditing(false);
            return;
        }

        try {
            await dispatch(
                updateUser({
                    userId: user.id,
                    data: changedFields,
                }),
            ).unwrap();

            setSaveSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setSaveError(err || "Failed to update profile");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "age" ? parseInt(value) || 0 : value,
        }));
    };

    if (!user) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No user information available</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Profile
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View and manage your personal information
                        </p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Edit2 className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Edit Profile
                            </span>
                            <span className="sm:hidden">Edit</span>
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="h-4 w-4" />
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {saveSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-green-800">
                        Profile updated successfully!
                    </p>
                </div>
            )}

            {saveError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-red-800">{saveError}</p>
                </div>
            )}

            {/* Profile Header Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4 ">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="flex-1 text-center md:text-left ">
                        <h2 className="text-[22px] font-bold text-gray-900 ml-1 mb-2">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                `${user.title || ""} ${user.name}`.trim()
                            )}
                        </h2>
                        <p className="text-[15px] text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="h-4 w-4 ml-1" />
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="flex-1 max-w-md px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your.email@example.com"
                                />
                            ) : (
                                user.email
                            )}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    user.packageId === "PREMIUM_MEMBER"
                                        ? "bg-linear-to-r from-amber-400 to-amber-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                <Award className="h-4 w-4" />
                                {user.packageId.replace("_", " ")}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    user.isActive
                                        ? "bg-green-200 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {user.isActive ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <XCircle className="h-4 w-4" />
                                )}
                                {user.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                <div className="bg-white rounded-lg shadow-sm px-6 py-2">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Personal Information
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Title
                            </label>
                            {isEditing ? (
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Prof">Prof</option>
                                    <option value="Rev">Rev</option>
                                </select>
                            ) : (
                                <p className="text-gray-900 font-medium">
                                    {user.title || (
                                        <span className="text-gray-400">
                                            Not provided
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Age
                            </label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="1"
                                    max="150"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">
                                    {user.age ? (
                                        `${user.age} years`
                                    ) : (
                                        <span className="text-gray-400">
                                            Not provided
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                <Users className="h-3.5 w-3.5" />
                                Gender
                            </label>
                            {isEditing ? (
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            ) : (
                                <p className="text-gray-900 font-medium capitalize">
                                    {user.gender || (
                                        <span className="text-gray-400">
                                            Not provided
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm px-6 py-2">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Contact Information
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                <Phone className="h-3.5 w-3.5" />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+94718956472"
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">
                                    {user.contactNumber || (
                                        <span className="text-gray-400">
                                            Not provided
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm px-6 py-1">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <IdCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Identification
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                <CreditCard className="h-3.5 w-3.5" />
                                NIC Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="nicNumber"
                                    value={formData.nicNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="200245673355"
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">
                                    {user.nicNumber || (
                                        <span className="text-gray-400">
                                            Not provided
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Passport Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="passportNumber"
                                    value={formData.passportNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="A1234567"
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">
                                    {user.passportNumber || (
                                        <span className="text-gray-400">
                                            Not provided
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                <Globe className="h-3.5 w-3.5" />
                                Nationality
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Local / Country name"
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">
                                    {user.nationality || (
                                        <span className="text-gray-400">
                                            Not provided
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm px-6 py-1">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Account Details
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                User Type
                            </label>
                            <p className="text-gray-900 font-medium capitalize">
                                {user.userType}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Role
                            </label>
                            <p className="text-gray-900 font-medium">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Settings</span>
                </button>
            </div>
        </div>
    );
}
