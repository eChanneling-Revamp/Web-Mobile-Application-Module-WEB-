"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { generateAppointmentReceipt } from "@/lib/utils/pdfGenerator";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StepConfirmationProps {
    onBackHome: () => void;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
    onBackHome,
}) => {
    // Get confirmation data from Redux (set by createBooking thunk)
    const {
        isCreatingBooking,
        isProcessingPayment,
        bookingError,
    } = useSelector((state: RootState) => state.booking);

    const { updateAppointment } = useSelector((state: RootState) => state.payment);
    const { confirmationData } = useSelector((state: RootState) => state.booking);

    const appointment = updateAppointment ?? confirmationData;

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Format time for display (only time portion)
    const formatTime = (timeStr: string) => {
        const time = new Date(timeStr);
        return time.toLocaleTimeString("en-LK", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Download receipt as PDF
    const downloadReceipt = () => {
        if (!appointment) return;

        generateAppointmentReceipt({
            appointmentNumber: appointment.appointmentNumber,
            appointmentId: appointment.id,
            hospitalName: appointment.session.hospitals.name,
            queuePosition: appointment.queuePosition,
            patientName: appointment.patientName,
            patientNIC: appointment.patientNIC,
            doctorName: appointment.session.doctors.name,
            sessionDate: appointment.session.scheduledAt,
            sessionTime: appointment.session.startTime,
            consultationFee: appointment.consultationFee,
            platformFee: 200,
            paymentStatus: appointment.paymentStatus,
        });
    };

    // Loading state
    if (isCreatingBooking || isProcessingPayment) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        {isCreatingBooking
                            ? "Creating your appointment..."
                            : "Processing payment..."}
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (bookingError) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{bookingError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No confirmation data
    if (!appointment) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <div className="text-center">
                    <p className="text-gray-600">
                        Unable to load appointment details
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center py-0">
            <div className="w-full max-w-2xl">
                {/* Success Message with Icon */}
                <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Appointment Confirmed!
                        </h2>
                    </div>
                    <p className="text-[14px] text-gray-600">
                        Your appointment has been successfully booked.
                    </p>
                </div>

                {/* Appointment Details Card */}
                <div className="bg-white rounded-3xl border-2 border-gray-200 p-4 mb-4">
                    <div className="space-y-1.5">
                        {/* Appointment Number */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Appointment Number:
                            </span>
                            <span className="text-gray-700 ml-2">
                                {appointment.appointmentNumber}
                            </span>
                        </div>

                        {/* Hospital */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Hospital:
                            </span>
                            <span className="text-gray-700 ml-2">
                                {appointment.session.hospitals.name}
                            </span>
                        </div>

                        {/* Queue Position */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Queue Position:
                            </span>
                            <span className="text-gray-700 ml-2">
                                #{appointment.queuePosition}
                            </span>
                        </div>

                        {/* Patient Name */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Patient Name:
                            </span>
                            <span className="text-gray-700 ml-2">
                                {appointment.patientName}
                            </span>
                        </div>

                        {/* Patient NIC */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Patient NIC:
                            </span>
                            <span className="text-gray-700 ml-2">
                                {appointment.patientNIC}
                            </span>
                        </div>

                        {/* Doctor Name */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Doctor Name:
                            </span>
                            <span className="text-gray-700 ml-2">
                                {appointment.session.doctors.name}
                            </span>
                        </div>

                        {/* Date */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Date:
                            </span>
                            <span className="text-gray-700 ml-2">
                                {formatDate(appointment.session.scheduledAt)}
                            </span>
                        </div>

                        {/* Time */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Time:
                            </span>
                            <span className="text-gray-700 ml-2">
                                {formatTime(appointment.session.startTime)}
                            </span>
                        </div>

                        {/* Payment Status */}
                        <div>
                            <span className="font-bold text-gray-900">
                                Payment Status:
                            </span>
                            <span className="text-gray-700 ml-2">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${appointment.paymentStatus ===
                                        "COMPLETED"
                                        ? "bg-green-100 text-green-800"
                                        : appointment.paymentStatus ===
                                            "PENDING"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {appointment.paymentStatus}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>



                <div className="flex gap-3 justify-between w-full">
                    {/* Secondary Button */}
                    <button
                        onClick={onBackHome}
                        className="px-7 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                        Back to Home
                    </button>


                    <button
                        onClick={downloadReceipt}
                        className="px-7 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    >
                        Download Receipt
                    </button>





                </div>

                <div className="flex justify-end mt-6 mb-5">
                    <Link
                        href="/profile/appointments"
                        className="text-blue-700 font-[450]  rounded-full hover:text-blue-900 transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                        Appointments History
                        <ArrowRight className="mt-1 w-5 h-5" />
                    </Link>


                </div>
            </div>
        </div>
    );
};
