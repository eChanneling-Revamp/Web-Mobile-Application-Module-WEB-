import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Doctor interface matching API response
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
    description: string;
    languages: string[];
    availableDays: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    status: string;
    hospitalIds: string[];
    hospitals?: Array<{
        hospital: {
            id: string;
            name: string;
            district?: string;
            hospitalType?: string;
        };
    }>;
    sessions?: Array<{
        id: string;
        scheduledAt: string;
        status: string;
        hospitals: {
            id: string;
            name: string;
        };
    }>;
}

// Search filters interface
export interface SearchFilters {
    keyword?: string;
    hospitalId?: string;
    specialtyId?: string;
    date?: string;
    district?: string;
    hospitalType?: string;
    page?: number;
    limit?: number;
}

// API response structure
interface SearchResponse {
    success: boolean;
    data: Doctor[];
    count: number;
    page: number;
    totalPages: number;
}

interface SearchState {
    doctors: Doctor[];
    loading: boolean;
    error: string | null;
    count: number;
    page: number;
    totalPages: number;
}

const initialState: SearchState = {
    doctors: [],
    loading: false,
    error: null,
    count: 0,
    page: 1,
    totalPages: 1,
};

// Fetch all doctors (no filters)
export const fetchDoctors = createAsyncThunk<
    SearchResponse,
    void,
    { rejectValue: string }
>("search/fetchDoctors", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<SearchResponse>("/api/search");
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(
            err.response?.data?.error || "Failed to fetch doctors!",
        );
    }
});

// Search doctors with filters
export const searchDoctors = createAsyncThunk<
    SearchResponse,
    SearchFilters,
    { rejectValue: string }
>("search/searchDoctors", async (filters, { rejectWithValue }) => {
    try {
        const startTime = performance.now();
        const params = new URLSearchParams();

        // Add filters to query params only if they have values
        if (filters.keyword) params.set("keyword", filters.keyword);
        if (filters.hospitalId) params.set("hospitalId", filters.hospitalId);
        if (filters.specialtyId) params.set("specialtyId", filters.specialtyId);
        if (filters.date) params.set("date", filters.date);
        if (filters.district) params.set("district", filters.district);
        if (filters.hospitalType)
            params.set("hospitalType", filters.hospitalType);
        if (filters.page) params.set("page", filters.page.toString());
        if (filters.limit) params.set("limit", filters.limit.toString());

        const queryString = params.toString();
        const url = queryString ? `/api/search?${queryString}` : "/api/search";

        const response = await axios.get<SearchResponse>(url);

        const endTime = performance.now();
        console.log(
            `Search API call took ${((endTime - startTime) / 1000).toFixed(2)} seconds.`,
        );
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(
            err.response?.data?.error || "Failed to search doctors!",
        );
    }
});

// Slice
const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        clearDoctors: (state) => {
            state.doctors = [];
            state.count = 0;
            state.page = 1;
            state.totalPages = 1;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all doctors
            .addCase(fetchDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload.data;
                state.count = action.payload.count;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            })
            // Search doctors with filters
            .addCase(searchDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload.data;
                state.count = action.payload.count;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(searchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export const { clearDoctors, clearError } = searchSlice.actions;
export default searchSlice.reducer;
