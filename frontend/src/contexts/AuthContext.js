import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Ensure HTTPS is used for API calls
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
if (!BACKEND_URL) {
    console.error('REACT_APP_BACKEND_URL is not set');
}
const API = (BACKEND_URL || '').replace('http://', 'https://') + '/api';

console.log('🔧 API Configuration:', { BACKEND_URL, API, env: process.env.REACT_APP_BACKEND_URL });

const api = axios.create({ baseURL: API, withCredentials: true });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('atron_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

function formatError(detail) {
    if (detail == null) return "Something went wrong.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map(e => e?.msg || JSON.stringify(e)).join(" ");
    if (detail?.msg) return detail.msg;
    return String(detail);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
        } catch {
            setUser(false);
            localStorage.removeItem('atron_token');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { checkAuth(); }, [checkAuth]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.token) localStorage.setItem('atron_token', data.token);
            setUser(data);
            return { success: true, data };
        } catch (e) {
            return { success: false, error: formatError(e.response?.data?.detail) };
        }
    };

    const register = async (email, password, name, role) => {
        try {
            const { data } = await api.post('/auth/register', { email, password, name, role });
            if (data.token) localStorage.setItem('atron_token', data.token);
            setUser(data);
            return { success: true, data };
        } catch (e) {
            return { success: false, error: formatError(e.response?.data?.detail) };
        }
    };

    const logout = async () => {
        try { await api.post('/auth/logout'); } catch {}
        localStorage.removeItem('atron_token');
        setUser(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export { api };
