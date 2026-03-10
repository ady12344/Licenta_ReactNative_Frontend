import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        SecureStore.getItemAsync('accessToken')
            .then(token => {
                if (token) setUser(true);
                else setUser(null);
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        const { data } = await apiClient.post('/api/users/login', { username, password });
        await SecureStore.setItemAsync('accessToken', data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.refreshToken);
        setUser(true);
    };

    const register = async (username, email, password) => {
        await apiClient.post('/api/users/register', { username, email, password });
    };

    const logout = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            await apiClient.post('/api/users/logout', { refreshToken });
        } catch (e) {
            // ignore logout errors
        } finally {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);