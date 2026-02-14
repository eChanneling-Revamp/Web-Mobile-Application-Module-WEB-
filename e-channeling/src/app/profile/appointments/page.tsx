"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAppointmentsByUserId, cancelBooking } from "@/store/profile/profileSlice";
import type { Appointment } from "@/store/profile/profileSlice";
import {
    FileText,
    Calendar,
    Clock,
    Hash,
    DollarSign,
    User,
    Mail,
    Phone,
    Users,
    Building2,
    ClipboardList,
    AlertTriangle,
    Download,
    CreditCard,
    X,
} from "lucide-react";
import { AppointmentCardSkeleton } from "@/components/profile/AppointmentCardSkeleton";
import { CancelConfirmationModal } from "@/components/profile/CancelConfirmationModal";

interface TransformedAppointment {
    id: string;
    appointmentNumber: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientGender: string;
    patientAge: number;
    doctorName: string;
    specialization: string;
    date: string;
    time: string;
    hospital: string;
    type: string;
    consultationFee: string;
    status: "upcoming" | "past" | "cancelled";
    paymentStatus: string;
    queuePosition: number;
    notes: string | null;
    medicalReportUrl: string | null;
    allergies: string | null;
}

// Helper function to transform API data to UI format
const transformAppointment = (
    appointment: Appointment,
): TransformedAppointment => {
    const doctorName = appointment.session.doctors.name;
    const patientName = appointment.patientName.charAt(0).toUpperCase() + appointment.patientName.slice(1);
    const specialization = appointment.session.doctors.specialization;
    const hospitalName =
        appointment.session.doctors.hospitals[0]?.hospital?.name || "N/A";
    const appointmentNumber = appointment.appointmentNumber;

    const scheduledDate = new Date(appointment.session.scheduledAt);
    const formattedDate = `${scheduledDate.getMonth() + 1}/${scheduledDate.getDate()}/${scheduledDate.getFullYear()}`;

    const startTime = new Date(appointment.session.startTime);
    const formattedTime = startTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    let uiStatus: "upcoming" | "past" | "cancelled";
    if (appointment.status === "CANCELLED") {
        uiStatus = "cancelled";
    } else if (appointment.status === "COMPLETED") {
        uiStatus = "past";
    } else {
        uiStatus = "upcoming";
    }

    return {
        id: appointment.id,
        appointmentNumber,
        patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        patientGender: appointment.patientGender,
        patientAge: appointment.patientAge,
        doctorName,
        specialization,
        date: formattedDate,
        time: formattedTime,
        hospital: hospitalName,
        type: "In-Person",
        consultationFee: appointment.consultationFee,
        status: uiStatus,
        paymentStatus: appointment.paymentStatus,
        queuePosition: appointment.queuePosition,
        notes: appointment.notes,
        medicalReportUrl: appointment.medicalReportUrl,
        allergies: appointment.allergies,
    };
};

const AppointmentCard: React.FC<{ appointment: TransformedAppointment }> = ({
    appointment,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { userId } = useSelector((state: RootState) => state.auth);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [cancelSuccess, setCancelSuccess] = useState(false);

    const statusColor = {
        upcoming: "bg-blue-100 text-blue-700 border-blue-300",
        past: "bg-green-100 text-green-700 border-green-300",
        cancelled: "bg-red-100 text-red-700 border-red-300",
    }[appointment.status];

    const paymentStatusColor =
        appointment.paymentStatus === "COMPLETED"
            ? "text-green-600 bg-green-50"
            : "text-orange-600 bg-orange-50";

    const handleCancelClick = () => {
        setCancelError(null);
        setCancelSuccess(false);
        setIsModalOpen(true);
    };

    const handleCancelConfirm = async () => {
        setIsCancelling(true);
        setCancelError(null);

        try {
            const result = await dispatch(
                cancelBooking(appointment.appointmentNumber)
            ).unwrap();

            setCancelSuccess(true);

            if (userId) {
                await dispatch(fetchAppointmentsByUserId(userId));
            }

            setTimeout(() => {
                setIsModalOpen(false);
                setCancelSuccess(false);
            }, 2000);
        } catch (error: any) {
            setCancelError(error || "Failed to cancel appointment. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };

    const handleModalClose = () => {
        if (!isCancelling && !cancelSuccess) {
            setIsModalOpen(false);
            setCancelError(null);
        }
    };

    return (
        <div className="relative bg-white border border-gray-300 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 md:gap-3">
                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-sm text-gray-600 font-medium">
                                Appointment Number
                            </p>
                            <p className="text-sm md:text-base font-bold text-gray-900 truncate">
                                {appointment.appointmentNumber}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`px-3 py-1 md:px-4 md:py-1.5 text-[11px] md:text-sm font-semibold rounded-full border ${statusColor} w-fit`}
                    >
                        {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                    </div>
                </div>
            </div>

            {/* Doctor & Hospital Section */}
            <div className="px-4 py-4 md:px-6 md:py-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-xl md:text-[18px] font-bold text-white tracking-wide">
                            {appointment.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-start md:justify-between">
                            <div className="flex-1 min-w-0 md:pr-4">
                                <h3 className="text-base sm:text-lg md:text-[18px] font-bold text-gray-900 mb-1 break-words">
                                    {appointment.doctorName}
                                </h3>
                                <p className="text-blue-600 text-sm md:text-[15px] font-medium">
                                    {appointment.specialization}
                                </p>
                            </div>

                            <div className="flex-1 min-w-0 md:px-4 md:border-l md:border-gray-300">
                                <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">
                                    Hospital
                                </p>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm md:text-base font-medium text-gray-900 break-words line-clamp-2">
                                        {appointment.hospital}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start md:pl-4">
                                <span className="inline-flex items-center px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                                    {appointment.type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointment Details Section */}
            <div className="px-4 py-4 md:px-6 md:py-5 border-t border-gray-200">
                <h4 className="text-[11px] md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Appointment Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-sm text-gray-500 font-medium">
                                Date
                            </p>
                            <p className="text-sm md:text-base font-semibold text-gray-900 break-words">
                                {appointment.date}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-sm text-gray-500 font-medium">
                                Time
                            </p>
                            <p className="text-sm md:text-base font-semibold text-gray-900">
                                {appointment.time}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Hash className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-sm text-gray-500 font-medium">
                                Queue No.
                            </p>
                            <p className="text-sm md:text-base font-semibold text-gray-900">
                                #{appointment.queuePosition}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-sm text-gray-500 font-medium">
                                Fee
                            </p>
                            <p className="text-sm md:text-base font-semibold text-gray-900">
                                Rs. {appointment.consultationFee}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Information Section */}
            <div className="px-4 py-4 md:px-6 md:py-5 border-t border-gray-200">
                <h4 className="text-[11px] md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Patient Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] md:text-sm text-gray-500">
                                Name
                            </p>
                            <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                                {appointment.patientName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] md:text-sm text-gray-500">
                                Email
                            </p>
                            <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                                {appointment.patientEmail}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] md:text-sm text-gray-500">
                                Phone
                            </p>
                            <p className="text-sm md:text-base font-medium text-gray-900">
                                {appointment.patientPhone}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-sm text-gray-500">
                                Gender
                            </p>
                            <p className="text-sm md:text-base font-medium text-gray-900">
                                {appointment.patientGender}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-sm text-gray-500">
                                Age
                            </p>
                            <p className="text-sm md:text-base font-medium text-gray-900">
                                {appointment.patientAge} years
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Information Section */}
            {(appointment.notes ||
                appointment.allergies ||
                appointment.medicalReportUrl) && (
                    <div className="px-4 py-4 md:px-6 md:py-5 border-t border-gray-200">
                        <h4 className="text-[11px] md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Medical Information
                        </h4>
                        <div className="space-y-3">
                            {appointment.notes && (
                                <div className="flex items-start gap-2 md:gap-3">
                                    <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] md:text-sm text-gray-600 font-medium mb-1">
                                            Medical Notes
                                        </p>
                                        <p className="text-sm md:text-base text-gray-800 break-words">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {appointment.allergies && (
                                <div className="flex items-start gap-2 md:gap-3">
                                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] md:text-sm text-gray-600 font-medium mb-1">
                                            Allergies
                                        </p>
                                        <p className="text-sm md:text-base text-gray-800 break-words">
                                            {appointment.allergies}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {appointment.medicalReportUrl && (
                                <div className="flex items-start gap-2 md:gap-3">
                                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] md:text-sm text-gray-600 font-medium mb-1">
                                            Medical Report
                                        </p>
                                        <a
                                            href={appointment.medicalReportUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-blue-600 hover:text-blue-700 font-medium hover:underline active:text-blue-800 touch-manipulation"
                                        >
                                            <Download className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                            <span>Download Report</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            {/* Payment Section */}
            <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
                        <span className="text-sm md:text-base font-medium text-gray-700">
                            Payment Status:
                        </span>
                    </div>
                    <span
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-sm font-semibold ${paymentStatusColor} w-fit`}
                    >
                        {appointment.paymentStatus}
                    </span>
                </div>
            </div>

            {appointment.status === "upcoming" && (
                <>
                    <div className="px-4 py-2.5 md:px-6 md:py-3 border-t border-gray-400">
                        <button
                            onClick={handleCancelClick}
                            disabled={isCancelling}
                            className={`w-full sm:w-auto px-3 py-1.5 md:px-4 md:py-2 ${isCancelling
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 hover:text-red-700"
                                } font-medium text-xs md:text-sm rounded-lg border ${isCancelling
                                    ? "border-gray-200"
                                    : "border-red-200 hover:border-red-300"
                                } transition-all duration-200 flex items-center justify-center gap-1.5 touch-manipulation`}
                        >
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>
                                {isCancelling
                                    ? "Cancelling..."
                                    : "Cancel Appointment"}
                            </span>
                        </button>
                    </div>

                    <CancelConfirmationModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        onConfirm={handleCancelConfirm}
                        appointmentNumber={appointment.appointmentNumber}
                        doctorName={appointment.doctorName}
                        date={appointment.date}
                        time={appointment.time}
                        isLoading={isCancelling}
                        error={cancelError}
                        success={cancelSuccess}
                    />
                </>
            )}
        </div>
    );
};

// Main AppointmentsPage component
const AppointmentsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<string>("upcoming");

    const { appointments, loading, error } = useSelector(
        (state: RootState) => state.profile,
    );
    const { userId } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userId) {
            dispatch(fetchAppointmentsByUserId(userId));
        }
    }, [dispatch, userId]);

    // Transform appointments from API format to UI format
    const transformedAppointments = appointments.map(transformAppointment);

    const filteredAppointments = transformedAppointments.filter(
        (app) => app.status === activeTab,
    );

    const appointmentCounts = {
        upcoming: transformedAppointments.filter(
            (app) => app.status === "upcoming",
        ).length,
        past: transformedAppointments.filter((app) => app.status === "past")
            .length,
        cancelled: transformedAppointments.filter(
            (app) => app.status === "cancelled",
        ).length,
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Appointments
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Manage your medical appointments
                </p>
            </div>

            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                        {
                            id: "upcoming",
                            label: "Upcoming",
                            count: appointmentCounts.upcoming,
                        },
                        {
                            id: "past",
                            label: "Past",
                            count: appointmentCounts.past,
                        },
                        {
                            id: "cancelled",
                            label: "Cancelled",
                            count: appointmentCounts.cancelled,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }
              `}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span
                                    className={`
                  ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                  ${activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-900"}
                `}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 font-semibold">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Appointments List */}
            {!error && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            <AppointmentCardSkeleton />
                            <AppointmentCardSkeleton />
                            <AppointmentCardSkeleton />
                        </div>
                    ) : filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">
                                No {activeTab} appointments found.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;
