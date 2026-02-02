"use client";
import React, { use, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { StepTypeAndDate } from "@/components/booking/StepTypeAndDate";
import {
    fetchDoctorById,
    setSelectedDoctorId,
    resetBooking,
    sessionsByDoctorId,
} from "@/store/booking/bookingSlice";
import type { Doctor } from "@/components/booking/types";
import { StepForWhom } from "@/components/booking/StepForWhom";
import { StepPatientDetails } from "@/components/booking/StepPatientDetails";
import { StepPayment } from "@/components/booking/StepPayment";
import { StepConfirmation } from "@/components/booking/StepConfirmation";
import { AppointmentSkeleton } from "@/components/booking/AppointmentSkeleton";

type UIStep = 1 | 2 | 3 | 4 | 5;

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

const BookingPage = ({ params }: PageProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const unwrappedParams = use(params);
    const doctorId = unwrappedParams.id;

    console.log(doctorId);

    // Local state for UI step management
    const [step, setStepState] = useState<UIStep>(1);

    // Redux state
    const {
        fetchDoctorByIdError,
        doctorProfile,
        fetchDoctorByIdLoading,
        bookingError,
    } = useSelector((state: RootState) => state.booking);

    // Get user ID from auth state
    const { userId } = useSelector((state: RootState) => state.auth);

    // Fetch doctor details and sessions from backend on mount
    useEffect(() => {
        if (doctorId) {
            dispatch(fetchDoctorById(doctorId));
        }
    }, [doctorId, dispatch]);

    // Scroll to top on step change
    const setStep = useCallback((newStep: UIStep) => {
        setStepState(newStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // // Reset booking on unmount
    // useEffect(() => {
    //     return () => {
    //         dispatch(resetBooking());
    //     };
    // }, [dispatch]);

    console.log("Doctor profile ", doctorProfile);

    // Render step content
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <StepTypeAndDate
                        doctorId={doctorId}
                        onNext={() => setStep(2)}
                    />
                );
            case 2:
                return (
                    <StepForWhom
                        onPrev={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                );
            case 3:
                return (
                    <StepPatientDetails
                        onPrev={() => setStep(2)}
                        onNext={() => setStep(4)}
                    />
                );
            case 4:
                return (
                    <StepPayment
                        doctorFee={doctorProfile?.consultationFee || ""}
                        userId={userId || ""}
                        onPrev={() => setStep(3)}
                        onNext={() => setStep(5)}
                    />
                );
            case 5:
                return (
                    <StepConfirmation
                        doctorName={doctorProfile?.name || ""}
                        doctorFee={doctorProfile?.consultationFee || ""}
                        onBackHome={() => {
                            dispatch(resetBooking());
                            window.location.href = "/";
                        }}
                        onViewAppointments={() => {
                            window.location.href = "/profile";
                        }}
                    />
                );
            default:
                return null;
        }
    };

    // Loading state
    if (fetchDoctorByIdLoading) {
        return <AppointmentSkeleton />;
    }

    // Error state
    if (bookingError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{bookingError}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-150 py-10 px-4">
            <div className="max-w-7xl mx-auto rounded-3xl shadow-2xl ">
                <div className="bg-white rounded-3xl  p-6 ">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Book Appointment
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                        {/* Left: Doctor Info Card */}
                        <aside className="rounded-2xl bg-gray-50 shadow-md p-5 h-fit">
                            {doctorProfile ? (
                                <div className="flex flex-row sm:flex-col gap-3 mb-0.5">
                                    <div className="flex justify-center items-center p-4">
                                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex justify-center items-center">
                                            {doctorProfile.profileImage ? (
                                                <img
                                                    src={
                                                        doctorProfile.profileImage 
                                                       
                                                    }
                                                    alt={doctorProfile.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={
                                                        "/sample-doctor-mini.png"
                                                       
                                                    }
                                                    alt={doctorProfile.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-lg">
                                            {doctorProfile.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {doctorProfile.specialization}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Years of experience :{" "}
                                            {doctorProfile.experience}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-pulse">
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </aside>

                        {/* Step Content */}
                        <div>
                            {/* Step Indicator - Compact, No Flare, Tight Width */}
                            <div className="mb-1">
                                <div className="flex items-center justify-center gap-0 w-full px-2 mb-8 relative z-10 select-none">
                                    {[1, 2, 3, 4, 5].map(
                                        (stepNumber, i, arr) => {
                                            const stepLabels = [
                                                "Session",
                                                "For Whom",
                                                "Info",
                                                "Payment",
                                                "Confirm",
                                            ];

                                            const isCompleted =
                                                stepNumber < step;
                                            const isActive =
                                                stepNumber === step;

                                            return (
                                                <React.Fragment
                                                    key={stepNumber}
                                                >
                                                    <div className="flex flex-col items-center relative min-w-[38px] px-1 mt-3">
                                                        {/* Step Circle */}
                                                        <div
                                                            className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200 border
                                                            text-[11px] font-bold shadow-sm
                                                            ${isCompleted
                                                                    ? "bg-green-500 border-green-500 text-white"
                                                                    : isActive
                                                                        ? "bg-white border-blue-600 text-blue-600 shadow"
                                                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                                                }
                                                        `}
                                                        >
                                                            {isCompleted ? (
                                                                <svg
                                                                    className="w-3.5 h-3.5"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                stepNumber
                                                            )}
                                                        </div>
                                                        {/* Step Label */}
                                                        <span
                                                            className={`mt-0.5 text-[11px] font-medium text-center w-14 transition-colors duration-150 truncate
                                                        ${isCompleted
                                                                    ? "text-green-700"
                                                                    : isActive
                                                                        ? "text-blue-700"
                                                                        : "text-gray-400"
                                                                }`}
                                                            title={
                                                                stepLabels[
                                                                stepNumber -
                                                                1
                                                                ]
                                                            }
                                                        >
                                                            {
                                                                stepLabels[
                                                                stepNumber -
                                                                1
                                                                ]
                                                            }
                                                        </span>
                                                    </div>
                                                    {/* Connector Line */}
                                                    {i !== arr.length - 1 && (
                                                        <div className="flex items-center">
                                                            <div
                                                                className={`h-0.5 w-5 rounded transition-colors duration-150 ${isCompleted
                                                                    ? "bg-green-400"
                                                                    : isActive
                                                                        ? "bg-blue-400"
                                                                        : "bg-gray-200"
                                                                    }`}
                                                            />
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            {/* Step Content */}
                            <div className="bg-white rounded-xl shadow-lg p-3">
                                {renderStep()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
