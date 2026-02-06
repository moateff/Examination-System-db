/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService, type User, type LoginResponse } from '../services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Check local storage for initial state
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

const initialState: AuthState = {
    user: userStr ? JSON.parse(userStr) : null,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string }, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials.username);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const loginDummyUser = createAsyncThunk(
    'auth/loginDummy',
    async (_, { rejectWithValue }) => {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            return {
                user: {
                    id: 'dummy-admin-123',
                    username: 'Test Administrator',
                    role: 'admin',
                    token: 'dummy-jwt-token-123456'
                },
                token: 'dummy-jwt-token-123456'
            } as LoginResponse;
        } catch (error: any) {
            return rejectWithValue('Dummy login failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Dummy Login Handlers
            .addCase(loginDummyUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginDummyUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(loginDummyUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
