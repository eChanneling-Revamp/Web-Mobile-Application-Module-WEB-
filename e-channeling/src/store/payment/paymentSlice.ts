import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";
import type {
    PaymentState,
    PaymentRequest,
    PaymentResponse,
} from "@/components/booking/types";

// Initial state
const initialState: PaymentState = {
    paymentDetails: {
        cardNumber: "",
        cardHolderName: "",
        expiryDate: "",
        cvv: "",
    },
    isProcessingPayment: false,
    paymentError: null,
    isPaymentSuccess: false,
    updateAppointment:null
};

// Process payment - INTEGRATED WITH BACKEND
export const processPayment = createAsyncThunk<
    PaymentResponse,
    PaymentRequest,
    { rejectValue: string }
>(
    "payment",
    async ( paymentDetails, {  rejectWithValue }) => {
        try {
            const response = await api.post<PaymentResponse>(
                "/payments",
                paymentDetails
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || error.message || "Payment failed"
            );
        }
    }
);

//slice
const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearPaymentDetails: (state) => {
            state.paymentDetails = {
                cardNumber: "",
                cardHolderName: "",
                expiryDate: "",
                cvv: "",
            };
        },
        clearPaymentError: (state) => {
            state.paymentError = null;
        },
        clearPaymentSuccess: (state) => {
            state.isPaymentSuccess = false;
        },
        setPaymentDetails: (
                    state,
                    action: PayloadAction<Partial<PaymentState["paymentDetails"]>>
                ) => {
                    state.paymentDetails = {
                        ...state.paymentDetails,
                        ...action.payload,
                    };
                },
    },
    extraReducers: (builder) => {
        builder
            .addCase(processPayment.pending, (state) => {
                state.isProcessingPayment = true;
                state.paymentError = null;
                state.isPaymentSuccess = false;
            })
            .addCase(processPayment.fulfilled, (state, action) => {
                state.isProcessingPayment = false;
                state.isPaymentSuccess = true;
                state.updateAppointment = action.payload.data.updateAppointment;
            })
            .addCase(processPayment.rejected, (state, action) => {
                state.isProcessingPayment = false;
                state.paymentError = action.payload || "Payment failed";
                state.isPaymentSuccess = false;
            });
    },
});

export const { setPaymentDetails, clearPaymentDetails, clearPaymentError, clearPaymentSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;
    
