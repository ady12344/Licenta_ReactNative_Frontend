import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://192.168.0.177:8082";
const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const { data } = await axios.post(`${BASE_URL}/api/users/refresh`, {
          refreshToken,
        });

        // save to SecureStore
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);

        // set as default header for ALL future requests immediately
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${data.accessToken}`;

        // also set on the retried request
        original.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(original);
      } catch (e) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
