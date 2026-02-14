import api from "@/lib/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Appointment {
    id: string;
    appointmentNumber: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientGender: string;
    patientAge: number;
    session: {
        scheduledAt: string;
        startTime: string;
        endTime: string;
        doctors: {
            name: string;
            specialization: string;
            hospitals: {
                hospital: {
                    name: string;
                }
            }[]
        }
    };
    status: string;
    consultationFee: string;
    totalAmount: string;
    paymentStatus: string;
    queuePosition: number;
    notes: string | null;
    medicalReportUrl: string | null;
    allergies: string | null;
}

export interface HealthRecord {
    appointmentNumber: string;
    patientName: string;
    session: {
        doctors: {
            name: string;
            specialization: string;
        };
        scheduledAt: string;
        startTime: string;
    };
    prescriptions: {
        prescriptionNumber: string;
        htmlContent: string;
    }[];
}

interface AppointmentsResponse {
    success: boolean;
    message: string;
    data: Appointment[];
}

interface HealthRecordsResponse {
    success: boolean;
    message: string;
    data: HealthRecord[];
}

interface ProfileState {
    appointments: Appointment[];
    loading: boolean;
    error: string | null;

    healthRecords: HealthRecord[];
    healthRecordsLoading: boolean;
    healthRecordsError: string | null;

    status: string;
    cancelLoading: boolean;
    cancelError: string | null;
}

const initialState: ProfileState = {
    appointments: [],
    loading: false,
    error: null,

    healthRecords: [],
    healthRecordsLoading: false,
    healthRecordsError: null,

    status: "",
    cancelLoading: false,
    cancelError: null,
};

export const fetchAppointmentsByUserId = createAsyncThunk<
    AppointmentsResponse,
    string,
    { rejectValue: string }
>("profile/fetchAppointmentsByUserId",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/${userId}/appointments`);
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to fetch appointments!");
        }
    });

// Fetch health records by user id
export const fetchHealthRecordsByUserId = createAsyncThunk<
    HealthRecordsResponse,
    string,
    { rejectValue: string }
>("profile/fetchHealthRecordsByUserId",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/${userId}/health-records`);
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to fetch health records!");
        }
    });

// cancel the appointment by appointment number
export const cancelBooking = createAsyncThunk<
    { status: string },
    string,
    { rejectValue: string }
>("profile/cancelBooking",
    async (appointmentNumber: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/bookings/${appointmentNumber}`)
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to cancel appointment!");
        }
    });

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.appointments = [];
            state.loading = false;
            state.error = null;
            state.healthRecords = [];
            state.healthRecordsLoading = false;
            state.healthRecordsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointmentsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchAppointmentsByUserId.fulfilled,
                (state, action: PayloadAction<AppointmentsResponse>) => {
                    state.loading = false;
                    state.appointments = action.payload.data;
                }
            )
            .addCase(fetchAppointmentsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            })
            .addCase(cancelBooking.pending, (state) => {
                state.cancelLoading = true;
                state.cancelError = null;
            })
            .addCase(
                cancelBooking.fulfilled,
                (state, action: PayloadAction<{ status: string }>) => {
                    state.cancelLoading = false;
                    state.status = action.payload.status;
                }
            )
            .addCase(cancelBooking.rejected, (state, action) => {
                state.cancelLoading = false;
                state.cancelError = action.payload || "Something went wrong";
            })
            .addCase(fetchHealthRecordsByUserId.pending, (state) => {
                state.healthRecordsLoading = true;
                state.healthRecordsError = null;
            })
            .addCase(
                fetchHealthRecordsByUserId.fulfilled,
                (state, action: PayloadAction<HealthRecordsResponse>) => {
                    state.healthRecordsLoading = false;
                    state.healthRecords = action.payload.data;
                }
            )
            .addCase(fetchHealthRecordsByUserId.rejected, (state, action) => {
                state.healthRecordsLoading = false;
                state.healthRecordsError = action.payload || "Something went wrong";
            })
    },
});

export const { clearUser } = profileSlice.actions;
export default profileSlice.reducer;
