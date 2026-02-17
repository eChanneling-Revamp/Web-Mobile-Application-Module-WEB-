import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";
import type {
  RunningNumberState,
  RunningNumberAppointment,
} from "@/components/running-number/types";

const initialState: RunningNumberState = {
  phoneNumber: "",
  appointments: [],
  isLoadingAppointments: false,
  error: null,
};

export const fetchRunningNumbers = createAsyncThunk<
  RunningNumberAppointment[],
  { phone: string },
  { rejectValue: string }
>("running-number/fetchRunningNumbers", async ({ phone }, { rejectWithValue }) => {
  try {
  
    const res = await api.get(
      `/running-number?phone=${encodeURIComponent(phone)}`
    );

    return res.data?.data ?? [];
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
    builder
      .addCase(fetchRunningNumbers.pending, (state) => {
        state.isLoadingAppointments = true;
        state.error = null;
        state.appointments = [];
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

