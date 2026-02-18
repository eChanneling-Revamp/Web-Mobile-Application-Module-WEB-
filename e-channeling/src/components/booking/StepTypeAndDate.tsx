"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    sessionsByDoctorId,
    setSelectedHospitalName,
    setSelectedSessionId,
    resetBooking,
} from "@/store/booking/bookingSlice";

interface StepTypeAndDateProps {
    doctorId: string;
    onNext: () => void;
}

export const StepTypeAndDate: React.FC<StepTypeAndDateProps> = ({
    doctorId,
    onNext,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Redux state
    const {
        sessionsByDoctorIdLoading,
        sessionsByDoctorIdError,
        doctorSessions,
        selectedSessionId,
    } = useSelector((state: RootState) => state.booking);

    // Local state for hospital filter
    const [appointmentType, setAppointmentType] = useState<
        "in-person" | "video-consultation"
    >("in-person");
    const [error, setError] = useState("")

    // fetch the doctor sessions
    useEffect(() => {
        dispatch(sessionsByDoctorId(doctorId));
    }, []);

    const handleSessionSelect = (session: any) => {
        dispatch(setSelectedSessionId(session.id));
    };

    const handleNext = () => {
        if (!selectedSessionId) {
            setError("Please select a session before proceeding to the next step.")
            return
        }
        onNext()
    }

    const handleBack = () => {
        dispatch(resetBooking());
        router.back();
    };

    // SessionSkeleton
    const SessionSkeleton = () => {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="rounded-xl border-2 border-gray-200 p-3 bg-white space-y-3"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-gray-300 animate-pulse rounded-full" />
                                    <div className="w-32 h-4 bg-gray-300 animate-pulse rounded" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-gray-300 animate-pulse rounded-full" />
                                    <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-gray-300 animate-pulse rounded-full" />
                                    <div className="w-20 h-4 bg-gray-300 animate-pulse rounded" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-0.5">
                                <div className="w-16 h-4 bg-gray-50 animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Appointment Type Selection */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Appointment Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* In-Person Visit */}
                    <button
                        type="button"
                        onClick={() => {
                            setAppointmentType("in-person");
                            dispatch(setSelectedSessionId(null));
                        }}
                        className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${appointmentType === "in-person"
                                ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                                : "border-gray-300 bg-white hover:border-green-300 hover:shadow-lg"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${appointmentType === "in-person"
                                        ? "bg-green-100"
                                        : "bg-gray-100"
                                    }`}
                            >
                                <svg
                                    className={`w-6 h-6 ${appointmentType === "in-person"
                                            ? "text-green-600"
                                            : "text-gray-600"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4
                                    className={`font-semibold text-base mb-0.5 ${appointmentType === "in-person"
                                            ? "text-green-800"
                                            : "text-gray-900"
                                        }`}
                                >
                                    In-Person Visit
                                </h4>
                                <p
                                    className={`text-sm ${appointmentType === "in-person"
                                            ? "text-green-700"
                                            : "text-gray-600"
                                        }`}
                                >
                                    Visit the doctor at the hospital
                                </p>
                            </div>
                            {appointmentType === "in-person" && (
                                <svg
                                    className="w-6 h-6 text-green-600 flex-shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Video Consultation */}
                    <button
                        type="button"
                        onClick={() => {
                            setAppointmentType("video-consultation");
                            dispatch(setSelectedSessionId(null));
                        }}
                        className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${appointmentType === "video-consultation"
                                ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                                : "border-gray-300 bg-white hover:border-green-300 hover:shadow-lg"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${appointmentType === "video-consultation"
                                        ? "bg-green-100"
                                        : "bg-gray-100"
                                    }`}
                            >
                                <svg
                                    className={`w-6 h-6 ${appointmentType === "video-consultation"
                                            ? "text-green-600"
                                            : "text-gray-600"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4
                                    className={`font-semibold text-base mb-1 ${appointmentType === "video-consultation"
                                            ? "text-green-800"
                                            : "text-gray-900"
                                        }`}
                                >
                                    Video Consultation
                                </h4>
                                <p
                                    className={`text-sm ${appointmentType === "video-consultation"
                                            ? "text-green-700"
                                            : "text-gray-600"
                                        }`}
                                >
                                    Consult with the doctor online
                                </p>
                            </div>
                            {appointmentType === "video-consultation" && (
                                <svg
                                    className="w-6 h-6 text-green-600 flex-shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Available Sessions */}
            <div>
                <h3 className="text-lg font-semibold mb-2 ">
                    Available Sessions
                </h3>
                {sessionsByDoctorIdLoading ? (
                    <SessionSkeleton />
                ) : sessionsByDoctorIdError ? (
                    <div className="text-center py-12 bg-red-50 rounded-xl border-2 border-red-300">
                        <p className="text-red-600 font-medium">
                            Error loading sessions. Please try again.
                        </p>
                    </div>
                ) : !doctorSessions ||
                    (Array.isArray(doctorSessions) &&
                        doctorSessions.length === 0) ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <svg
                            className="w-16 h-16 mx-auto text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-gray-600 font-medium">
                            No upcoming sessions available.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className=" grid grid-cols-1 md:grid-cols-2 gap-5 ">
                            {Array.isArray(doctorSessions) &&
                                doctorSessions.map((session) => {
                                    const isSelected =
                                        selectedSessionId === session.id;

                                    return (
                                        <button
                                            key={session.id}
                                            type="button"
                                            onClick={() => {
                                                handleSessionSelect(session)
                                                dispatch(setSelectedHospitalName(session.hospitals.name))
                                            }}
                                            className={`rounded-xl border-2 border-gray-300 p-3 text-left transition-all duration-200 hover:shadow-lg  ${isSelected
                                                    ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                                                    : "border-gray-300 bg-white hover:border-green-300"
                                                }`}
                                        >
                                            <div className="space-y-2">
                                                {/* Hospital - Only show for in-person appointments */}
                                                {appointmentType ===
                                                    "in-person" && (
                                                        <div className="flex items-center gap-3">
                                                            <svg
                                                                className={`w-5 h-5 flex-shrink-0 ${isSelected
                                                                    ? "text-green-600"
                                                                    : "text-gray-600"
                                                                    }`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                                />
                                                            </svg>
                                                            <span
                                                                className={`font-semibold ${isSelected
                                                                    ? "text-green-800"
                                                                    : "text-gray-900"
                                                                    }`}
                                                            >
                                                                {
                                                                    session
                                                                        .hospitals
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    )}

                                                {/* Date */}
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        className={`w-5 h-5 flex-shrink-0 ${isSelected
                                                                ? "text-green-600"
                                                                : "text-gray-600"
                                                            }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span
                                                        className={`text-sm ${isSelected
                                                                ? "text-green-700"
                                                                : "text-gray-700"
                                                            }`}
                                                    >
                                                        {new Date(
                                                            session.scheduledAt
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Time */}
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        className={`w-5 h-5 flex-shrink-0 ${isSelected
                                                                ? "text-green-600"
                                                                : "text-gray-600"
                                                            }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span
                                                        className={`text-sm font-medium ${isSelected
                                                                ? "text-green-700"
                                                                : "text-gray-700"
                                                            }`}
                                                    >
                                                        {new Date(
                                                            session.scheduledAt
                                                        ).toLocaleTimeString(
                                                            "en-US",
                                                            {
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            }
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Selected Indicator */}
                                                {isSelected && (
                                                    <div className="flex items-center justify-end pt-0.5">
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <svg
                                                                className="w-5 h-5"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                            >
                                                                <path d="M20 6 9 17l-5-5" />
                                                            </svg>
                                                            <span className="text-sm font-semibold">
                                                                Selected
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                        </div>

                        {/* Pagination */}
                        {/* {renderPagination()} */}
                    </>
                )}
            </div>

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-between pt-5">

                <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2.5 text-gray-600 hover:bg-gray-700 hover:text-white border border-bg-black font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    Back
                </button>


                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedSessionId}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
