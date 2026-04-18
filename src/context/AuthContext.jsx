import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('accessToken')
        .then(async token => {
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              setUser(payload.sub);
            } catch (e) {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
  }, []);

  // listen for auth failures from interceptor
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401 || error.response?.status === 403) {
            const token = await SecureStore.getItemAsync('accessToken');
            if (!token) {
              setUser(null); // force redirect to login
            }
          }
          return Promise.reject(error);
        }
    );

    return () => apiClient.interceptors.response.eject(interceptor);
  }, []);

  const login = async (username, password) => {
    const { data } = await apiClient.post('/api/users/login',
        { username, password },
        { skipAuth: true }  // skip token attachment
    );
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    setUser(username);
  };

  const register = async (username, email, password) => {
    await apiClient.post('/api/users/register',
        { username, email, password },
        { skipAuth: true }
    );
  };

  const logout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      await apiClient.post('/api/users/logout', { refreshToken });
    } catch (e) {}
    finally {
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