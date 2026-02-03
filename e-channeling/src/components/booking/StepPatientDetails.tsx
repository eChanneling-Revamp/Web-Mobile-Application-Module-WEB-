"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    clearBookingSuccess,
    clearPatientDetails,
    createBooking,
    fetchUserDetails,
    setPatientDetails,
} from "@/store/booking/bookingSlice";
import { Gender, PatientDetails } from "./types";

interface StepPatientDetailsProps {
    onPrev: () => void;
    onNext: () => void;
}

export const StepPatientDetails: React.FC<StepPatientDetailsProps> = ({
    onPrev,
    onNext,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get Redux state
    const {
        forWhom,
        patientDetails,
        isCreateBookingSuccess,
        createBookingLoading,
        createBookingError,
    } = useSelector((state: RootState) => state.booking);
    const { userId } = useSelector((state: RootState) => state.auth);

    // Track if form has been submitted (to show errors)
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Track which fields have been touched for label positioning
    const [touched, setTouched] = useState({
        fullName: false,
        phone: false,
        email: false,
        nic: false,
        dateOfBirth: false,
        gender: false,
    });

    const [showErrors, setShowErrors] = useState<{ [key: string]: string }>({});

    const isForYou = forWhom === "myself";

    useEffect(() => {
        if (isForYou) {
            dispatch(fetchUserDetails(userId));
        }
    }, [dispatch]);

    // Handle input change
    const handleChange = (
        field: keyof typeof patientDetails,
        value: string
    ) => {
        dispatch(setPatientDetails({ [field]: value }));
    };

    // Handle blur (mark as touched for label positioning only)
    const handleBlur = (field: keyof typeof touched) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const validateForm = (formData: PatientDetails) => {
        const errors: { [key: string]: string } = {};

        // Validate full name
        if (!formData.fullName || formData.fullName.trim().length === 0) {
            errors.fullName = "Full Name is required";
        } else if (
            formData.fullName.length > 50 ||
            !/^[a-zA-Z\s'-]+$/.test(formData.fullName.trim())
        ) {
            errors.fullName =
                "Name must be under 50 characters and contain only letters, spaces, hyphens or apostrophes";
        }

        // Validate phone
        if (!formData.phone || formData.phone.trim().length === 0) {
            errors.phone = "Phone number is required";
        } else if (!/^\+?\d{10,15}$/.test(formData.phone.trim())) {
            errors.phone = "Enter a valid phone number (10-15 digits)";
        }

        // Validate email (optional)
        if (formData.email && formData.email.trim().length > 0) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
                errors.email = "Invalid email format";
            }
        }

        // Validate NIC
        if (!formData.nic || formData.nic.trim().length === 0) {
            errors.nic = "NIC is required";
        } else if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(formData.nic.trim())) {
            errors.nic = "Enter a valid NIC";
        }

        // Validate date of birth
        if (!formData.dateOfBirth) {
            errors.dateOfBirth = "Date of birth is required";
        } else {
            const date = new Date(formData.dateOfBirth);
            const today = new Date();
            if (date > today || isNaN(date.getTime())) {
                errors.dateOfBirth = "Enter a valid date of birth";
            }
        }

        // Validate gender
        if (!formData.gender) {
            errors.gender = "Gender is required";
        }

        setShowErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        if (validateForm(patientDetails)) {
            dispatch(
                createBooking({
                    userId: userId,
                })
            );
        }
    };

    useEffect(() => {
        if (isCreateBookingSuccess === true) {
            dispatch(clearBookingSuccess());
            dispatch(clearPatientDetails());
            onNext();
        }
    }, [isCreateBookingSuccess, dispatch, onNext]);

    console.log("patientDetails ", patientDetails);

    const inputClass =
        "w-full rounded-lg border-2 border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
    const errorClass = "border-red-500 focus:ring-red-500 focus:border-red-500";

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-2 ">
            <h2 className="text-2xl font-bold text-gray-900">
                Patient Details
            </h2>
            {/* Auto-fill Info Banner (only show for "For You") */}
            {isForYou && (
                <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-4 flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg
                            className="w-6 h-6 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">
                            Auto-filled with your information
                        </h3>
                        <p className="text-sm text-blue-800">
                            Your personal details have been automatically
                            populated. You can edit any field if needed.
                        </p>
                    </div>
                </div>
            )}
            {/* Full Name and NIC Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="relative mt-4">
                    <input
                        type="text"
                        id="fullName"
                        value={patientDetails.fullName}
                        onChange={(e) =>
                            handleChange("fullName", e.target.value)
                        }
                        onBlur={() => handleBlur("fullName")}
                        onFocus={() =>
                            setTouched((t) => ({ ...t, fullName: true }))
                        }
                        className={`${inputClass} ${showErrors.fullName ? errorClass : ""} peer pt-5`}
                        autoComplete="off"
                        placeholder=" "
                    />
                    <label
                        htmlFor="fullName"
                        className={`
                            absolute left-3 px-1 bg-white 
                            text-gray-500 text-sm
                            transition-all duration-200
                            pointer-events-none
                            ${patientDetails.fullName
                                ? "text-xs text-blue-600 top-0 -translate-y-1/2 left-2"
                                : "top-1/2 -translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2"
                            }
                            ${showErrors.fullName ? "text-red-500" : ""}
                        `}
                    >
                        Full Name *
                    </label>
                    {showErrors.fullName && (
                        <p className="text-sm text-red-600 mt-1">
                            Full name is required (max 50 chars, letters only)
                        </p>
                    )}
                </div>

                {/* NIC */}
                <div className="relative mt-4">
                    <input
                        type="text"
                        id="nic"
                        value={patientDetails.nic}
                        onChange={(e) => handleChange("nic", e.target.value)}
                        onBlur={() => handleBlur("nic")}
                        onFocus={() => setTouched((t) => ({ ...t, nic: true }))}
                        className={`${inputClass} ${showErrors.nic ? errorClass : ""} peer pt-5`}
                        autoComplete="off"
                        placeholder=" "
                    />
                    <label
                        htmlFor="nic"
                        className={`
                            absolute left-3 px-1 bg-white
                            text-gray-500 text-sm
                            transition-all duration-200
                            pointer-events-none
                            ${patientDetails.nic
                                ? "text-xs text-blue-600 top-0 -translate-y-1/2 left-2"
                                : "top-1/2 -translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2"
                            }
                            ${showErrors.nic ? "text-red-500" : ""}
                        `}
                    >
                        NIC (e.g., 199512345678 or 951234567V) *
                    </label>
                    {showErrors.nic && (
                        <p className="text-sm text-red-600 mt-1">
                            Enter a valid Sri Lankan NIC (12 digits or 9 digits
                            + V/X)
                        </p>
                    )}
                </div>
            </div>
            {/* Phone and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="relative mt-4">
                    <input
                        type="tel"
                        id="phone"
                        value={patientDetails.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        onFocus={() =>
                            setTouched((t) => ({ ...t, phone: true }))
                        }
                        className={`${inputClass} ${showErrors.phone ? errorClass : ""} peer pt-5`}
                        autoComplete="off"
                        placeholder=" "
                    />
                    <label
                        htmlFor="phone"
                        className={`
                            absolute left-3 px-1 bg-white
                            text-gray-500 text-sm
                            transition-all duration-200
                            pointer-events-none
                            ${patientDetails.phone
                                ? "text-xs text-blue-600 top-0 -translate-y-1/2 left-2"
                                : "top-1/2 -translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2"
                            }
                            ${showErrors.phone ? "text-red-500" : ""}
                        `}
                    >
                        Phone Number *
                    </label>
                    {showErrors.phone && (
                        <p className="text-sm text-red-600 mt-1">
                            Enter a valid phone number (10-15 digits, can start
                            with +)
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="relative mt-4">
                    <input
                        type="email"
                        id="email"
                        value={patientDetails.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        onFocus={() =>
                            setTouched((t) => ({ ...t, email: true }))
                        }
                        className={`${inputClass} ${showErrors.email ? errorClass : ""} peer pt-5`}
                        autoComplete="off"
                        placeholder=" "
                    />
                    <label
                        htmlFor="email"
                        className={`
                            absolute left-3 px-1 bg-white
                            text-gray-500 text-sm
                            transition-all duration-200
                            pointer-events-none
                            ${patientDetails.email
                                ? "text-xs text-blue-600 top-0 -translate-y-1/2 left-2"
                                : "top-1/2 -translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2"
                            }
                            ${showErrors.email ? "text-red-500" : ""}
                        `}
                    >
                        Email
                    </label>
                    {showErrors.email && (
                        <p className="text-sm text-red-600 mt-1">
                            Enter a valid email address
                        </p>
                    )}
                </div>
            </div>
            {/* Date of Birth and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <div className="relative mt-4">
                    <input
                        type="date"
                        id="dateOfBirth"
                        value={patientDetails.dateOfBirth}
                        onChange={(e) =>
                            handleChange("dateOfBirth", e.target.value)
                        }
                        onBlur={() => handleBlur("dateOfBirth")}
                        onFocus={() =>
                            setTouched((t) => ({ ...t, dateOfBirth: true }))
                        }
                        max={new Date().toISOString().split("T")[0]}
                        className={`${inputClass} ${showErrors.dateOfBirth ? errorClass : ""} peer pt-5`}
                        autoComplete="off"
                        placeholder=" "
                    />
                    <label
                        htmlFor="dateOfBirth"
                        className={`
                            absolute left-2 px-1 bg-white
                            text-xs top-0 -translate-y-1/2
                            transition-all duration-200
                            pointer-events-none
                            text-gray-500 peer-focus:text-blue-600
                            ${showErrors.dateOfBirth ? "text-red-500 peer-focus:text-red-500" : ""}
                        `}
                    >
                        Date of Birth *
                    </label>
                    {showErrors.dateOfBirth && (
                        <p className="text-sm text-red-600 mt-1">
                            {showErrors.dateOfBirth}
                        </p>
                    )}
                </div>

                {/* Gender */}
                <div className="relative mt-4">
                    <select
                        id="gender"
                        value={patientDetails.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        onBlur={() => handleBlur("gender")}
                        onFocus={() =>
                            setTouched((t) => ({ ...t, gender: true }))
                        }
                        className={`${inputClass} ${showErrors.gender ? errorClass : ""} peer pt-5`}
                    >
                        <option value="" disabled hidden></option>
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                    </select>
                    <label
                        htmlFor="gender"
                        className={`
                            absolute left-3 px-1 bg-white
                            text-gray-500 text-sm
                            transition-all duration-200
                            pointer-events-none
                            ${patientDetails.gender || touched.gender
                                ? "text-xs text-blue-600 top-0 -translate-y-1/2 left-2"
                                : "top-1/2 -translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2"
                            }
                            ${showErrors.gender ? "text-red-500" : ""}
                        `}
                    >
                        Select Gender *
                    </label>
                    {showErrors.gender && (
                        <p className="text-sm text-red-600 mt-1">
                            Please select a gender
                        </p>
                    )}
                </div>
            </div>
            {/* Disease/Notes (Optional) */}
            <div className="relative mt-5">
                <textarea
                    id="disease"
                    value={patientDetails.disease}
                    onChange={(e) => handleChange("disease", e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none peer pt-5`}
                    autoComplete="off"
                    placeholder=" "
                />
                <label
                    htmlFor="disease"
                    className={`
                        absolute left-3 px-1 bg-white
                        text-gray-500 text-sm
                        transition-all duration-200
                        pointer-events-none
                        ${patientDetails.disease
                            ? "text-xs text-blue-600 top-0 -translate-y-1/2 left-2"
                            : "top-1/2 -translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2"
                        }
                    `}
                >
                    Medical Notes or Reason for Visit (Optional)
                </label>
            </div>

            {createBookingError && (
                <div className="mt-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 flex items-center gap-2">
                    <svg
                        className="h-5 w-5 flex-shrink-0 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4m0 4h.01"
                        />
                    </svg>
                    <span>
                        {typeof createBookingError === "string"
                            ? createBookingError
                            : "Failed to create booking. Please try again."}
                    </span>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
                <button
                    type="button"
                    onClick={onPrev}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    ← Previous
                </button>

                <button
                    type="submit"
                    disabled={
                        !patientDetails.fullName ||
                        !patientDetails.phone ||
                        !patientDetails.nic ||
                        !patientDetails.dateOfBirth ||
                        !patientDetails.gender ||
                        createBookingLoading
                    }
                    className="flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    {createBookingLoading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
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
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>Next &rarr;</>
                    )}
                </button>
            </div>
        </form>
    );
};
