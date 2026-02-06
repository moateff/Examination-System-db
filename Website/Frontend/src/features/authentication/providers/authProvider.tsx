import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { logout } from '../slices/authSlice';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    loading: false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

    // You might want to validate token expiry here or on initial load
    // For now, we rely on the store's initial state from localStorage

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
