import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";
import type { RunningNumberState, RunningNumberAppointment } from "@/components/running-number/types";

// Mock mode for frontend development (set to true to skip backend calls)
const MOCK_MODE = true;

const initialState: RunningNumberState = {
  phoneNumber: "",
  isOtpSent: false,
  isOtpVerified: false,
  appointments: [],
  isLoadingAppointments: false,
  error: null,
};

// Send OTP for running number check
export const sendRunningNumberOtp = createAsyncThunk<
  { success: boolean },
  { phone: string },
  { rejectValue: string }
>("running-number/sendOtp", async ({ phone }, { rejectWithValue }) => {
  try {
    // Mock mode for frontend development
    if (MOCK_MODE) {
      console.log("[MOCK MODE] Sending OTP to:", phone);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    }
    
    const response = await api.post("/running-number/send-otp", { phone });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP"
    );
  }
});

// Verify OTP for running number check
export const verifyRunningNumberOtp = createAsyncThunk<
  { success: boolean },
  { phone: string; otp: string },
  { rejectValue: string }
>("running-number/verifyOtp", async ({ phone, otp }, { rejectWithValue }) => {
  try {
    // Mock mode for frontend development
    if (MOCK_MODE) {
      console.log("[MOCK MODE] Verifying OTP:", { phone, otp });
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Accept any 6-digit OTP in mock mode
      if (otp.length === 6) {
        return { success: true };
      }
      return rejectWithValue("OTP must be 6 digits");
    }
    
    const response = await api.post("/running-number/verify-otp", { phone, otp });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Invalid OTP"
    );
  }
});

// Fetch running numbers for verified phone
export const fetchRunningNumbers = createAsyncThunk<
  RunningNumberAppointment[],
  { phone: string },
  { rejectValue: string }
>("running-number/fetchRunningNumbers", async ({ phone }, { rejectWithValue }) => {
  try {
    // Mock mode for frontend development
    if (MOCK_MODE) {
      console.log("[MOCK MODE] Fetching appointments for:", phone);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Return mock appointment data
      const mockAppointments: RunningNumberAppointment[] = [
        {
          appointmentId: "APT001",
          doctorName: "Dr. Samantha Perera",
          hospitalName: "Colombo General Hospital",
          sessionDate: "2025-12-30",
          sessionStartTime: "14:00",
          currentRunningNumber: 8,
          yourNumber: 12,
          patientName: "John Doe",
        },
        {
          appointmentId: "APT002",
          doctorName: "Dr. Rajesh Kumar",
          hospitalName: "Asiri Medical Hospital",
          sessionDate: "2025-12-31",
          sessionStartTime: "10:00",
          currentRunningNumber: 3,
          yourNumber: 5,
          patientName: "Jane Smith",
        },
      ];
      
      return mockAppointments;
    }
    
    const response = await api.get(`/running-number/appointments?phone=${phone}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch running numbers"
    );
  }
});

const runningNumberSlice = createSlice({
  name: "runningNumber",
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    resetRunningNumberState: () => initialState,
    clearRunningNumberErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendRunningNumberOtp.pending, (state) => {
        state.error = null;
      })
      .addCase(sendRunningNumberOtp.fulfilled, (state) => {
        state.isOtpSent = true;
      })
      .addCase(sendRunningNumberOtp.rejected, (state, action) => {
        state.error = action.payload || "Failed to send OTP";
      });

    // Verify OTP
    builder
      .addCase(verifyRunningNumberOtp.pending, (state) => {
        state.error = null;
      })
      .addCase(verifyRunningNumberOtp.fulfilled, (state) => {
        state.isOtpVerified = true;
      })
      .addCase(verifyRunningNumberOtp.rejected, (state, action) => {
        state.error = action.payload || "Invalid OTP";
      });

    // Fetch Running Numbers
    builder
      .addCase(fetchRunningNumbers.pending, (state) => {
        state.isLoadingAppointments = true;
        state.error = null;
      })
      .addCase(fetchRunningNumbers.fulfilled, (state, action) => {
        state.isLoadingAppointments = false;
        state.appointments = action.payload;
      })
      .addCase(fetchRunningNumbers.rejected, (state, action) => {
        state.isLoadingAppointments = false;
        state.error = action.payload || "Failed to fetch appointments";
      });
  },
});

export const {
  setPhoneNumber,
  resetRunningNumberState,
  clearRunningNumberErrors,
} = runningNumberSlice.actions;

export default runningNumberSlice.reducer;