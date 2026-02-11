import { safeDecodeJwt } from "@/lib/utils/decodeJWT";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// if need add user verified or not
export interface SignupData {
    phone_number: string;
    country_code: string;
    package: string;
    title: string;
    first_name: string;
    last_name: string;
    email: string;
    id_type: "nic" | "passport";
    password: string;
    confirm_password: string;
    user_type: "individual" | "corporate";
    nic_number: string;
    passport_number: string;
    nationality: string;
    company_name: string;
    employee_id: string;
    accepted_terms: boolean;
    age: number;
    gender: string;
    is_number_verified?: boolean;
    is_email_verified?: boolean;
}

// the user not store in the local storage yet
interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
    age: number;
    gender: string;
    created_at: string;
    updated_at: string;
}

interface LoginResponse {
    message: string;
    user: User;
    userId: string;
    accessToken: string;
}

interface SignupResponse {
    message: string;
    data: {
        userId: string;
        authUserId: string;
        name: string;
        email: string;
    };
    userId: string;
    accessToken?: string;
}

interface LoginData {
    email: string;
    password: string;
}

// data types of state
interface AuthState {
    userToken: string | null;
    role: string | null;
    userId: string | null;
    isLoginLoading: boolean;
    isLoginError: string | null;
    isLoginSuccess: boolean;
    isSignupLoading: boolean;
    isSignupError: string | null;
    isSignupSuccess: boolean;
    isRequestOtpLoading: boolean;
    isRequestOtpError: string | null;
    isRequestOtpSuccess: boolean;
    isVerifyOtpLoading: boolean;
    isVerifyOtpError: string | null;
    isOtpVerified: boolean;
    signupData: Partial<SignupData>;
    isHydrated: boolean;
}

interface RequestOtpPayload {
    email?: string;
    phone?: string;
}

interface OtpVerificationData {
    identifier: string;
    otp: string;
}

// intial state - Always start with null to avoid hydration mismatch
const initialState: AuthState = {
    userToken: null,
    role: null,
    userId: null,
    isLoginLoading: false,
    isLoginError: null,
    isLoginSuccess: false,

    isSignupLoading: false,
    isSignupError: null,
    isSignupSuccess: false,

    isRequestOtpLoading: false,
    isRequestOtpError: null,
    isRequestOtpSuccess: false,

    isVerifyOtpLoading: false,
    isVerifyOtpError: null,
    isOtpVerified: false,
    signupData: {},
    isHydrated: false,
};

// Request OTP
export const requestOtp = createAsyncThunk<
    { message: string },
    RequestOtpPayload,
    { rejectValue: string }
>("auth/requestOtp", async (payload, { rejectWithValue }) => {
    try {
        console.log("redy to send data ", payload);
        const response = await axios.post("/api/auth/send-otp", payload);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(
            err.response?.data?.error || "An error occurred while sending OTP.",
        );
    }
});

// Verify OTP
export const verifyOtp = createAsyncThunk<
    { message: string },
    OtpVerificationData,
    { rejectValue: string }
>("auth/verifyOtp", async (payload, { rejectWithValue }) => {
    try {
        console.log("redy to send data ", payload);
        const response = await axios.post("api/auth/verify-otp", payload);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Invalid OTP code.",
        );
    }
});

// Sign up
export const signup = createAsyncThunk<
    SignupResponse,
    SignupData,
    { rejectValue: string }
>("auth/signup", async (signupData, { rejectWithValue }) => {
    try {
        const response = await axios.post("api/auth/signup", signupData);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(
            err.response?.data?.error || "An error occurred during signup.",
        );
    }
});

// login
export const login = createAsyncThunk<
    LoginResponse,
    LoginData,
    { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/auth/login", loginData);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(
            err.response?.data?.error ||
            "An unexpected error occurred during login.",
        );
    }
});

// auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Rehydrate auth state from localStorage (client-side only)
        rehydrateAuth: (state) => {
            if (typeof window !== "undefined") {
                const accessToken = localStorage.getItem("accessToken");
                const userId = localStorage.getItem("userId");
                if (accessToken && userId) {
                    const payload = safeDecodeJwt(accessToken);
                    // Check if token is valid and not expired
                    if (
                        payload &&
                        (!payload.exp || payload.exp * 1000 > Date.now())
                    ) {
                        state.userToken = accessToken;
                        state.role = payload.role ?? null;
                        state.userId = userId;
                        state.isLoginSuccess = true;
                    } else {
                        // Token is invalid or expired, remove it
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("userId");
                    }
                }
            }
        },
        // Mark hydration as complete
        setHydrated: (state) => {
            state.isHydrated = true;
        },
        clearErrors: (state) => {
            state.isLoginError = null;
            state.isSignupError = null;
            state.isRequestOtpError = null;
            state.isVerifyOtpError = null;
        },
        logout: (state) => {
            state.userToken = null;
            state.userId = null;
            state.role = null;
            state.isLoginSuccess = false;
            state.isLoginError = null;
            state.isLoginLoading = false;
            state.signupData = {};
            if (typeof window !== "undefined")
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userId");
        },
        setSignupData: (state, action: PayloadAction<Partial<SignupData>>) => {
            state.signupData = { ...state.signupData, ...action.payload };
        },
        resetSignup: (state) => {
            state.signupData = {};
            state.isOtpVerified = false;
            state.isSignupSuccess = false;
            state.isRequestOtpSuccess = false;
        },
        setRequestOtpSuccessFalse: (state) => {
            state.isRequestOtpSuccess = false;
        },
    },
    extraReducers: (builder) =>
        builder
            // Login reducers
            .addCase(login.pending, (state) => {
                state.isLoginLoading = true;
                state.isLoginError = null;
                state.isLoginSuccess = false;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.isLoginLoading = false;
                    state.isLoginError = null;
                    // get the token only
                    const accessToken = action.payload?.accessToken;
                    if (!accessToken) {
                        state.isLoginError =
                            "Login succeeded but token missing.";
                        state.isLoginSuccess = false;
                        return;
                    }
                    state.isLoginSuccess = true;
                    state.userToken = accessToken;
                    const payload = safeDecodeJwt(accessToken);
                    // get role and user id from the token payload
                    state.role = payload?.role ?? null;

                    // get the user id from the response
                    const userId = action.payload.userId;
                    state.userId = userId;
                    if (typeof window !== "undefined") {
                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("userId", userId);
                    }
                },
            )
            .addCase(login.rejected, (state, action) => {
                state.isLoginLoading = false;
                state.isLoginSuccess = false;
                state.isLoginError =
                    action.payload ||
                    "An unexpected error occurred during login.";
            })
            // OTP request reducers
            .addCase(requestOtp.pending, (state) => {
                state.isRequestOtpLoading = true;
                state.isRequestOtpError = null;
            })
            .addCase(requestOtp.fulfilled, (state) => {
                state.isRequestOtpLoading = false;
                state.isRequestOtpError = null;
                state.isRequestOtpSuccess = true;
            })
            .addCase(requestOtp.rejected, (state, action) => {
                state.isRequestOtpLoading = false;
                state.isRequestOtpError =
                    action.payload || "Failed to send OTP";
                //state.isRequestOtpSuccess = true;
            })
            // OTP verification reducers
            .addCase(verifyOtp.pending, (state) => {
                state.isVerifyOtpLoading = true;
                state.isVerifyOtpError = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isVerifyOtpLoading = false;
                state.isVerifyOtpError = null;
                state.isOtpVerified = true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isVerifyOtpLoading = false;
                state.isVerifyOtpError =
                    action.payload || "OTP verification failed";
                //state.isOtpVerified = true;
            })
            // Signup reducers
            .addCase(signup.pending, (state) => {
                state.isSignupLoading = true;
                state.isSignupError = null;
            })
            .addCase(
                signup.fulfilled,
                (state, action: PayloadAction<SignupResponse>) => {
                    state.isSignupLoading = false;
                    state.isSignupError = null;
                    // get the token only
                    const accessToken = action.payload?.accessToken;
                    if (!accessToken) {
                        state.isSignupError =
                            "Signup succeeded but token missing.";
                        state.isSignupSuccess = false;
                        return;
                    }
                    state.isSignupSuccess = true;
                    state.userToken = accessToken;
                    const userId = action.payload.userId;

                    state.userId = userId;
                    if (typeof window !== "undefined") {
                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("userId", userId);
                    }
                },
            )
            .addCase(signup.rejected, (state, action) => {
                state.isSignupLoading = false;
                state.isSignupError = action.payload || "Signup failed";
                //state.isSignupSuccess = true; //remove latter
            }),
});

export const {
    rehydrateAuth,
    setHydrated,
    clearErrors,
    logout,
    setSignupData,
    resetSignup,
    setRequestOtpSuccessFalse,
} = authSlice.actions;
export default authSlice.reducer;
