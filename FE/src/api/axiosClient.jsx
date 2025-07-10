// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8084/api/",
});

// Interceptor để thêm Authorization header vào mọi request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
