import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/utils/api";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    companyName?: string;
    contactNumber?: string;
    isActive: boolean;
    nicNumber?: string;
    passportNumber?: string;
    nationality?: string;
    userType: string;
    title?: string;
    packageId: string;
    employeeId?: string;
    age?: number;
    gender?: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

export const fetchMe = createAsyncThunk<User, string, { rejectValue: string }>(
    "user/fetchMe",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/${userId}`);
            return response.data.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch user!",
            );
        }
    },
);

export const updateUser = createAsyncThunk<
    User,
    { userId: string; data: Partial<User> },
    { rejectValue: string }
>("user/updateUser", async ({ userId, data }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/user/${userId}`, data);
        return response.data.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to update user!",
        );
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchMe.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.loading = false;
                    state.user = action.payload;
                },
            )
            .addCase(fetchMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                updateUser.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.loading = false;
                    state.user = action.payload;
                },
            )
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update user";
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
