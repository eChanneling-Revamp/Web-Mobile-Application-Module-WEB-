"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchHealthRecordsByUserId } from "@/store/profile/profileSlice";
import type { HealthRecord } from "@/store/profile/profileSlice";
import { downloadHTMLAsPDF } from "@/lib/utils/htmlToPdf";
import { HealthRecordCardSkeleton } from "@/components/profile/HealthRecordCardSkeleton";

interface TransformedHealthRecord {
    appointmentNumber: string;
    patientName: string;
    doctorName: string;
    specialization: string;
    date: string;
    time: string;
    prescriptions: {
        prescriptionNumber: string;
        htmlContent: string;
    }[];
}

// Helper function to transform API data to UI format
const transformHealthRecord = (
    record: HealthRecord,
): TransformedHealthRecord => {
    const doctorName = record.session.doctors.name;
    const specialization = record.session.doctors.specialization;

    // Format date from scheduledAt (e.g., "2/14/2026")
    const scheduledDate = new Date(record.session.scheduledAt);
    const formattedDate = `${scheduledDate.getMonth() + 1}/${scheduledDate.getDate()}/${scheduledDate.getFullYear()}`;

    const startTime = new Date(record.session.startTime);
    const formattedTime = startTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return {
        appointmentNumber: record.appointmentNumber,
        patientName: record.patientName,
        doctorName,
        specialization,
        date: formattedDate,
        time: formattedTime,
        prescriptions: record.prescriptions,
    };
};

const HealthRecordCard: React.FC<{ record: TransformedHealthRecord }> = ({
    record,
}) => {
    const [showPrescription, setShowPrescription] = useState(false);

    const handleViewPrescription = () => {
        setShowPrescription(!showPrescription);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Appointment Info */}
            <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                        <p className="text-gray-500 text-xs mb-0.5">
                            Appointment No.
                        </p>
                        <p className="font-semibold text-gray-900">
                            {record.appointmentNumber}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs mb-0.5">Date</p>
                        <p className="font-semibold text-gray-900">
                            {record.date}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs mb-0.5">Time</p>
                        <p className="font-semibold text-gray-900">
                            {record.time}
                        </p>
                    </div>
                </div>
            </div>

            {/* Doctor Info Section */}
            <div className="mb-3 pb-3 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-0.5">
                    {record.doctorName}
                </h3>
                <p className="text-sm text-green-600 font-medium">
                    {record.specialization}
                </p>
            </div>

            {/* Patient Info Section */}
            <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-0.5">Patient Name</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                    {record.patientName}
                </p>
            </div>

            {/* Prescription Count */}
            <div className="mb-3 flex items-center text-sm">
                <svg
                    className="w-4 h-4 text-green-500 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span className="font-medium text-gray-700 text-sm">
                    {record.prescriptions.length}{" "}
                    {record.prescriptions.length === 1
                        ? "Prescription"
                        : "Prescriptions"}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
                <button
                    onClick={handleViewPrescription}
                    className="w-44 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {showPrescription ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                        ) : (
                            <>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </>
                        )}
                    </svg>
                    {showPrescription ? "Hide" : "View"}
                </button>

                <button
                    onClick={() => {
                        const combinedHTML = record.prescriptions
                            .map(
                                (p) => `
                <div style="margin-bottom: 30px;">
                  <h3 style="margin-bottom: 15px;">Prescription #${p.prescriptionNumber}</h3>
                  ${p.htmlContent}
                </div>
              `,
                            )
                            .join("");

                        downloadHTMLAsPDF(
                            combinedHTML,
                            `Prescription_${record.appointmentNumber}`,
                        );
                    }}
                    className="w-44 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    Download PDF
                </button>
            </div>

            {/* Prescription Content */}
            {showPrescription && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="space-y-2">
                        {record.prescriptions.map((prescription, index) => (
                            <div
                                key={prescription.prescriptionNumber}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <div className="bg-green-500 px-3 py-1.5 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-white">
                                        Prescription #
                                        {prescription.prescriptionNumber}
                                    </span>
                                    <span className="text-xs text-white/90">
                                        {index + 1} of{" "}
                                        {record.prescriptions.length}
                                    </span>
                                </div>
                                <div
                                    className="bg-gray-50 overflow-auto max-h-[600px]"
                                    style={{
                                        margin: 0,
                                        padding: 0,
                                        width: "100%",
                                        contain: "layout style",
                                        isolation: "isolate",
                                        display: "block",
                                    }}
                                >
                                    <iframe
                                        srcDoc={prescription.htmlContent}
                                        className="w-full border-0"
                                        style={{
                                            minHeight: "500px",
                                            height: "100%",
                                            display: "block",
                                        }}
                                        sandbox="allow-same-origin"
                                        title={`Prescription ${prescription.prescriptionNumber}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Main HealthRecordsPage component
const HealthRecordsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Get data from Redux store
    const { healthRecords, healthRecordsLoading, healthRecordsError } =
        useSelector((state: RootState) => state.profile);
    const { userId } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userId) {
            dispatch(fetchHealthRecordsByUserId(userId));
        }
    }, [dispatch, userId]);

    // Transform health records from API format to UI format
    const transformedRecords = healthRecords.map(transformHealthRecord);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl  font-bold text-gray-900">
                    Health Records
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                    View your medical prescriptions and health history
                </p>
            </div>

            {healthRecordsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 font-semibold">Error</p>
                    <p className="text-sm text-red-700">{healthRecordsError}</p>
                </div>
            )}

            <div className="space-y-4">
                {healthRecordsLoading ? (
                    <div className="space-y-4">
                        <HealthRecordCardSkeleton />
                        <HealthRecordCardSkeleton />
                        <HealthRecordCardSkeleton />
                    </div>
                ) : transformedRecords.length > 0 ? (
                    transformedRecords.map((record) => (
                        <HealthRecordCard
                            key={record.appointmentNumber}
                            record={record}
                        />
                    ))
                ) : (
                    <div className="text-center py-10">
                        <svg
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">
                            No health records found
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Your prescriptions will appear here after your
                            appointments
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthRecordsPage;
