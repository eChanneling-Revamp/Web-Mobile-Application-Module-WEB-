import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Hospital {
    id: string;
    name: string;
}

interface HospitalsResponse {
    success: boolean;
    data: Hospital[];
}

interface HospitalsState {
    hospitals: Hospital[];
    loading: boolean;
    error: string | null;
}

const initialState: HospitalsState = {
    hospitals: [],
    loading: false,
    error: null,
};

// Fetch all hospitals
export const fetchHospitals = createAsyncThunk<
    HospitalsResponse,
    void,
    { rejectValue: string }
>("hospitals/fetchHospitals", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<HospitalsResponse>("/api/hospitals");
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(
            err.response?.data?.error || "Failed to fetch hospitals!"
        );
    }
});

// Slice
const hospitalsSlice = createSlice({
    name: "hospitals",
    initialState,
    reducers: {
        clearHospitals: (state) => {
            state.hospitals = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHospitals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHospitals.fulfilled, (state, action) => {
                state.loading = false;
                state.hospitals = action.payload.data;
            })
            .addCase(fetchHospitals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export const { clearHospitals, clearError } = hospitalsSlice.actions;
export default hospitalsSlice.reducer;
