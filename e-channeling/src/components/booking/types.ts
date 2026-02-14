export interface Doctor {
    id: string;
    name: string;
    email: string;
    specialization: string;
    qualification: string;
    experience: number;
    phonenumber: string;
    consultationFee: string;
    rating: number | null;
    profileImage: string;
    description: string | null;
    languages: string[];
    availableDays: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    hospitalIds: string[];
}

export interface Session {
    id: string;
    doctorId: string;
    nurseId: string;
    capacity: number;
    location: string;
    hospitalId: string;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    createdAt: string;
    scheduledAt: string;
    startTime: string;
    endTime: string;
    currentRunningNumber: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: "PATIENT"
    companyName: string | null;
    contactNumber: string;
    isActive: boolean;
    nicNumber: string;
    passportNumber: string | null;
    nationality: "Local" | "Foreign";
    userType: "individual" | "corporate";
    title: "Mr" | "Mrs" | "Ms" | "Dr";
    packageId: string;
    employeeId: string | null;
    age: number;
    gender: "male" | "female" | "other";
}

export interface PatientDetails {
    fullName: string;
    phone: string;
    email: string;
    nic: string;
    age: number;
    gender: Gender | "";
    disease: string; // Optional notes
}

export interface Hospital {
    id: string;
    name: string;
    location: string;
}

export interface AvailableDate {
    date: string;
    isAvailable: boolean;
}

export interface SessionSlot {
    id: string;
    name: string;
    startTime: string;
    icon?: string;
}

export type ForWhomType = "myself" | "someone_else";
export type AppointmentType = "in-person" | "video-consultation";

// Backend enums
export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export enum AppointmentStatus {
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    NO_SHOW = "NO_SHOW",
    RESCHEDULED = "RESCHEDULED",
    UNPAID = "UNPAID",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
    UNPAID = "UNPAID",
}

export interface BookingState {
    // Step 1 data
    selectedDoctorId: string | null;
    selectedHospitalId: string | null;
    selectedHospitalName: string | null;
    selectedDate: string | null; // ISO format
    selectedSessionId: string | null;
    selectedSessionName: string | null;
    selectedSessionStartTime: string | null;

    // fetchDoctorById
    fetchDoctorByIdLoading: boolean
    fetchDoctorByIdError: string | null
    doctorProfile: Doctor | null

    // sessionsByDoctorId
    sessionsByDoctorIdLoading: boolean
    sessionsByDoctorIdError: string | null
    doctorSessions: Session | null

    //fetchUserDetails
    fetchUserDetailsdLoading: boolean
    fetchUserDetailsIdError: string | null
    user: User | null

    // Step 2 data
    forWhom: ForWhomType | null;

    // Step 3 data - Updated to match backend schema
    patientDetails: {
        fullName: string;
        phone: string;
        email: string;
        nic: string;
        age: number;
        gender: Gender | "";
        disease: string; // Optional notes
    };

    isCreateBookingSuccess: boolean
    createBookingLoading: boolean
    createBookingError: string | null

    // Confirmation data from backend
    confirmationData: CreateBookingResponse | null;

    // Loading states
    isCreatingBooking: boolean;
    isProcessingPayment: boolean;

    // Error states
    bookingError: string | null;
}

// API Request/Response types matching backend
export interface CreateBookingRequest {
    userId: string | null;
    sessionId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientNIC: string;
    patientAge: number;
    patientGender: Gender;
    medicalReport?: string;
}

export interface CreateBookingResponse {
    appointmentId: string;
    appointmentNumber: string;
    sessionId: string;
    bookedByUserId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientNIC: string;
    patientAge: number;
    patientGender: Gender;
    status: AppointmentStatus;
    consultationFee: number;
    paymentStatus: PaymentStatus;
    queuePosition: number;
}

export interface PaymentState {
    paymentDetails: {
        cardNumber: string;
        cardHolderName: string;
        expiryDate: string;
        cvv: string;
    };
    isProcessingPayment: boolean;
    paymentError: string | null;
    isPaymentSuccess: boolean;
    updateAppointment: any;
}

export interface PaymentRequest {
    appointmentNumber: string;
    amount: number;
    cardNumber: string;
    cardHolderName: string;
    expiryDate: string; // MM/YY
    cvv: string;
}

export interface PaymentResponse {
    success: boolean;
    data: {
        payments: boolean;
        updateAppointment: any;
    };
    message: string;
}

export interface BookingConfirmation {
    appointmentId: string;
    patientNumber: string;
    hospitalName: string;
    roomNumber: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
}

export interface Step1FormData {
    selectedHospitalId: string;
    selectedDate: string;
    selectedSessionId: string;
}

export interface SessionCard {
    id: string;
    hospitalId: string;
    hospitalName: string;
    hospitalLocation: string;
    date: string;
    dateFormatted: string;
    startTime: string;
    appointmentType: AppointmentType;
}
