import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { authAPI } from '../lib/api';
import { signInWithGoogle } from '../lib/firebase';
import type { ConfirmationResult } from 'firebase/auth';

interface User {
    id: string; name: string; email?: string | null; phone?: string | null; role: string; avatar?: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    sendPhoneOTP: (phone: string) => Promise<ConfirmationResult>;
    verifyPhoneOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) connectSocket(user.id);
        return () => disconnectSocket();
    }, [user]);

    const saveAuth = (userData: User, accessToken: string) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken);
        setUser(userData);
        setToken(accessToken);
    };

    // ── Email/Password Login ──
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await authAPI.login({ email, password });
            saveAuth(res.data.user, res.data.accessToken);
        } finally { setLoading(false); }
    };

    // ── Email/Password Register ──
    const register = async (name: string, email: string, password: string, role: string) => {
        setLoading(true);
        try {
            const res = await authAPI.register({ name, email, password, role });
            saveAuth(res.data.user, res.data.accessToken);
        } finally { setLoading(false); }
    };

    // ── Google OAuth ──
    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const { idToken } = await signInWithGoogle();
            const res = await authAPI.googleLogin(idToken);
            saveAuth(res.data.user, res.data.accessToken);
        } finally { setLoading(false); }
    };

    // ── Phone OTP: Send ──
    const sendOTP = async (phone: string): Promise<ConfirmationResult> => {
        const { setupRecaptcha, sendPhoneOTP: fbSendOTP } = await import('../lib/firebase');
        const verifier = setupRecaptcha('recaptcha-container');
        const confirmation = await fbSendOTP(phone, verifier);
        return confirmation;
    };

    // ── Phone OTP: Verify ──
    const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
        setLoading(true);
        try {
            const { verifyPhoneOTP: fbVerify } = await import('../lib/firebase');
            const { idToken } = await fbVerify(confirmationResult, otp);
            const res = await authAPI.phoneLogin(idToken);
            saveAuth(res.data.user, res.data.accessToken);
        } finally { setLoading(false); }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        disconnectSocket();
    };

    return (
        <AuthContext.Provider value={{
            user, token, login, register, loginWithGoogle,
            sendPhoneOTP: sendOTP, verifyPhoneOTP: verifyOTP,
            logout, isAuthenticated: !!user, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
