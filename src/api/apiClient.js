import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://192.168.0.177:8082";
const apiClient = axios.create({ baseURL: BASE_URL });

// auth endpoints that should NOT trigger refresh
const AUTH_ENDPOINTS = [
  '/api/users/login',
  '/api/users/register',
  '/api/users/forgot-password',
  '/api/users/reset-password',
  '/api/users/refresh',
];

const isAuthEndpoint = (url) => AUTH_ENDPOINTS.some(ep => url?.includes(ep));

apiClient.interceptors.request.use(async (config) => {
  if (!isAuthEndpoint(config.url)) {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      // skip refresh for auth endpoints — reject immediately
      if (isAuthEndpoint(original.url)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !original._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return apiClient(original);
          });
        }

        original._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await SecureStore.getItemAsync("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const { data } = await axios.post(`${BASE_URL}/api/users/refresh`, {
            refreshToken,
          });

          await SecureStore.setItemAsync("accessToken", data.accessToken);
          await SecureStore.setItemAsync("refreshToken", data.refreshToken);

          apiClient.defaults.headers.common["Authorization"] =
              `Bearer ${data.accessToken}`;

          processQueue(null, data.accessToken);

          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(original);
        } catch (e) {
          processQueue(e, null);
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
);

export default apiClient;