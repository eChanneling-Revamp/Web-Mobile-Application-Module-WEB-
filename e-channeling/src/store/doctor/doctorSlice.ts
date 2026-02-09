import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HospitalInfo {
  name: string;
  city: string;
}

export type DoctorStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface DoctorDetails {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: number;
  phonenumber: string;
  consultationFee: string; 
  rating: string;          
  profileImage: string;    
  description: string;
  languages: string[];
  availableDays: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  status: DoctorStatus;
  hospitalId: string[];
  hospitals: HospitalInfo[];
}

interface DoctorApiResponse {
  success: boolean;
  data: DoctorDetails;
}

interface DoctorState {
  selectedDoctor: DoctorDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  selectedDoctor: null,
  loading: false,
  error: null,
};

export const fetchDoctorDetails = createAsyncThunk<
  DoctorDetails,
  string,
  { rejectValue: string }
>("doctor/fetchDoctorDetails", async (doctorId, { rejectWithValue }) => {
  try {
    const response = await axios.get<DoctorApiResponse>(`/api/doctor/${doctorId}`);
    return response.data.data; 
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch doctor details!"
    );
  }
});

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDoctorDetails.fulfilled,
        (state, action: PayloadAction<DoctorDetails>) => {
          state.loading = false;
          state.selectedDoctor = action.payload;
        }
      )
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
