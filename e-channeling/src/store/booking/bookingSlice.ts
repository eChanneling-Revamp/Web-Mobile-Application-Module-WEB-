import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";
import type {
    BookingState,
    Doctor,
    CreateBookingRequest,
    CreateBookingResponse,
    Gender,
    Session,
    User,
} from "@/components/booking/types";

// Initial state
const initialState: BookingState = {
    // Step 1

    selectedHospitalId: null,
    selectedHospitalName: null,
    selectedDate: null,
    selectedSessionName: null,
    selectedSessionStartTime: null,

    //-------------------------------

    selectedDoctorId: null,
    selectedSessionId: null,

    // fetchDoctorById
    fetchDoctorByIdLoading: false,
    fetchDoctorByIdError: null,
    doctorProfile: null,

    //sessionsByDoctorId
    sessionsByDoctorIdLoading: false,
    sessionsByDoctorIdError: null,
    doctorSessions: null,

    //fetchUserDetails
    fetchUserDetailsdLoading: false,
    fetchUserDetailsIdError: null,
    user: null,

    // Step 2
    forWhom: null,

    // Step 3
    patientDetails: {
        fullName: "",
        phone: "",
        email: "",
        nic: "",
        age: 0,
        gender: "",
        disease: "",
    },

    isCreateBookingSuccess: false,
    createBookingLoading: false,
    createBookingError: "",

    // Confirmation
    confirmationData: null,

    // Loading states
    isCreatingBooking: false,
    isProcessingPayment: false,

    // Errors
    bookingError: null,

    // send confirmation email
    sendConfirmationEmailLoading: false,
    sendConfirmationEmailError: null,
    sendConfirmationEmailSuccess: false,
};

// Fetch doctor details by ID
export const fetchDoctorById = createAsyncThunk<
    Doctor,
    string,
    { rejectValue: string }
>("booking/fetchDoctorById", async (doctorId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/doctor/${doctorId}`);
        return response.data.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch doctor details",
        );
    }
});

// get doctor's all sessions by doctor id
export const sessionsByDoctorId = createAsyncThunk<
    Session,
    string,
    { rejectValue: string }
>("booking/sessionsByDoctorId", async (doctorId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/sessions/${doctorId}`);
        return response.data.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch doctor sessions",
        );
    }
});

// // Search sessions - INTEGRATED WITH BACKEND
// // Uses backend GET /api/search with filters
// export const searchSessions = createAsyncThunk<
//     SessionCard[],
//     {
//         doctorId?: string;
//         date?: string;
//         specialization?: string;
//         location?: string;
//         limit?: number;
//         offset?: number;
//     },
//     { rejectValue: string }
// >("booking/searchSessions", async (filters, { rejectWithValue }) => {
//     try {
//         const params = new URLSearchParams();
//         if (filters.doctorId) params.append("doctorId", filters.doctorId);
//         if (filters.date) params.append("date", filters.date);
//         if (filters.specialization)
//             params.append("specialization", filters.specialization);
//         if (filters.location) params.append("location", filters.location);
//         if (filters.limit) params.append("limit", filters.limit.toString());
//         if (filters.offset) params.append("offset", filters.offset.toString());

//         const response = await api.get(`/search?${params.toString()}`);
//         return response.data;
//     } catch (error: unknown) {
//         const err = error as { response?: { data?: { message?: string } } };
//         return rejectWithValue(
//             err.response?.data?.message || "Failed to search sessions"
//         );
//     }
// });

// send confirmation email
export const sendConfirmationEmail = createAsyncThunk<
    { success: boolean; message: string },
    CreateBookingResponse,
    { rejectValue: string }
>(
    "booking/sendConfirmationEmail",
    async (confirmationData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/send-confirmation",
                confirmationData,
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(
                err.response?.data?.message ||
                    "Failed to send confirmation email",
            );
        }
    },
);

// Create booking - INTEGRATED WITH BACKEND
export const createBooking = createAsyncThunk<
    CreateBookingResponse,
    { userId: string | null },
    { rejectValue: string }
>(
    "booking/createBooking",
    async ({ userId }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { booking: BookingState };
            const { selectedSessionId, patientDetails } = state.booking;

            if (!selectedSessionId) {
                throw new Error("Session ID is required");
            }

            // Validate required fields
            if (
                !patientDetails.fullName ||
                !patientDetails.phone ||
                !patientDetails.nic ||
                !patientDetails.age ||
                !patientDetails.gender
            ) {
                throw new Error("All required patient details must be filled");
            }

            const requestData: CreateBookingRequest = {
                userId,
                sessionId: selectedSessionId,
                patientName: patientDetails.fullName,
                patientEmail: patientDetails.email || "",
                patientPhone: patientDetails.phone,
                patientNIC: patientDetails.nic,
                patientAge: patientDetails.age,
                patientGender: patientDetails.gender as Gender,
                medicalReport: patientDetails.disease,
            };

            console.log("requestData ", requestData);

            const response = await api.post("/bookings", requestData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create booking",
            );
        }
    },
);

// ==================== SLICE ====================

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        // Step 1 actions
        setSelectedDoctorId: (state, action: PayloadAction<string>) => {
            state.selectedDoctorId = action.payload;
        },
        setSelectedHospitalId: (state, action: PayloadAction<string>) => {
            state.selectedHospitalId = action.payload;
        },
        setSelectedHospitalName: (state, action: PayloadAction<string>) => {
            state.selectedHospitalName = action.payload;
        },
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setSelectedSessionId: (state, action: PayloadAction<string | null>) => {
            state.selectedSessionId = action.payload;
        },
        // Set all session details at once when card is selected
        setSelectedSessionCard: (
            state,
            action: PayloadAction<{
                sessionId: string;
                hospitalId: string;
                hospitalName: string;
                date: string;
                startTime: string;
            }>,
        ) => {
            state.selectedSessionId = action.payload.sessionId;
            state.selectedHospitalId = action.payload.hospitalId;
            state.selectedHospitalName = action.payload.hospitalName;
            state.selectedDate = action.payload.date;
            state.selectedSessionStartTime = action.payload.startTime;
        },

        // Step 2 actions
        setForWhom: (
            state,
            action: PayloadAction<"myself" | "someone_else">,
        ) => {
            state.forWhom = action.payload;
        },

        // Step 3 actions
        setPatientDetails: (
            state,
            action: PayloadAction<Partial<BookingState["patientDetails"]>>,
        ) => {
            state.patientDetails = {
                ...state.patientDetails,
                ...action.payload,
            };
        },

        // Clear errors
        clearBookingError: (state) => {
            state.bookingError = null;
            state.createBookingError = null;
        },
        // Clear booking success flag
        clearBookingSuccess: (state) => {
            state.isCreateBookingSuccess = false;
        },

        // Clear send confirmation email states
        clearSendConfirmationEmail: (state) => {
            state.sendConfirmationEmailLoading = false;
            state.sendConfirmationEmailError = null;
            state.sendConfirmationEmailSuccess = false;
        },

        // Clear patient details
        clearPatientDetails: (state) => {
            state.patientDetails = {
                fullName: "",
                phone: "",
                email: "",
                nic: "",
                age: 0,
                gender: "",
                disease: "",
            };
            //state.selectedSessionId = null;
            state.forWhom = null;
        },

        // Reset booking
        resetBooking: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            // Fetch doctor details
            .addCase(fetchDoctorById.pending, (state) => {
                state.fetchDoctorByIdLoading = true;
                state.fetchDoctorByIdError = null;
            })
            .addCase(fetchDoctorById.fulfilled, (state, action) => {
                state.fetchDoctorByIdLoading = false;
                state.fetchDoctorByIdError = null;
                state.doctorProfile = action.payload;
            })
            .addCase(fetchDoctorById.rejected, (state, action) => {
                state.fetchDoctorByIdLoading = false;
                state.fetchDoctorByIdError =
                    action.payload || "Failed to fetch doctor";
            })
            // fetch all doctor sessions
            .addCase(sessionsByDoctorId.pending, (state) => {
                state.sessionsByDoctorIdLoading = true;
                state.sessionsByDoctorIdError = null;
            })
            .addCase(sessionsByDoctorId.fulfilled, (state, action) => {
                state.sessionsByDoctorIdLoading = false;
                state.sessionsByDoctorIdError = null;
                state.doctorSessions = action.payload;
            })
            .addCase(sessionsByDoctorId.rejected, (state, action) => {
                state.sessionsByDoctorIdLoading = false;
                state.sessionsByDoctorIdError =
                    action.payload || "Failed to fetch doctor";
            })

            // Search sessions

            // .addCase(searchSessions.pending, (state) => {
            //     state.isLoadingSessions = true;
            //     state.bookingError = null;
            // })
            // .addCase(searchSessions.fulfilled, (state) => {
            //     state.isLoadingSessions = false;
            // })
            // .addCase(searchSessions.rejected, (state, action) => {
            //     state.isLoadingSessions = false;
            //     state.bookingError =
            //         action.payload || "Failed to search sessions";
            // })

            // Create booking
            .addCase(createBooking.pending, (state) => {
                state.createBookingLoading = true;
                state.createBookingError = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.createBookingLoading = false;
                state.createBookingError = null;
                state.isCreateBookingSuccess = true;
                state.confirmationData = action.payload;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.createBookingLoading = false;
                state.createBookingError =
                    action.payload || "Failed to create booking";
            })

            // send confirmation email
            .addCase(sendConfirmationEmail.pending, (state) => {
                state.sendConfirmationEmailLoading = true;
                state.sendConfirmationEmailError = null;
            })
            .addCase(sendConfirmationEmail.fulfilled, (state, action) => {
                state.sendConfirmationEmailLoading = false;
                state.sendConfirmationEmailSuccess = action.payload.success;
            })
            .addCase(sendConfirmationEmail.rejected, (state, action) => {
                state.sendConfirmationEmailLoading = false;
                state.sendConfirmationEmailError =
                    action.payload || "Failed to send confirmation email";
            });
    },
});

export const {
    setSelectedDoctorId,
    setSelectedHospitalId,
    setSelectedHospitalName,
    setSelectedDate,
    setSelectedSessionId,
    setSelectedSessionCard,
    setForWhom,
    setPatientDetails,
    clearBookingError,
    clearBookingSuccess,
    clearSendConfirmationEmail,
    resetBooking,
    clearPatientDetails,
} = bookingSlice.actions;

export default bookingSlice.reducer;
