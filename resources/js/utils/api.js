    // src/utils/api.js
    import axios from "axios";

    const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true,
    });

    // tambahkan interceptor
    api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("adminToken");
    if (!config.url.includes("/sanctum/csrf-cookie")) {
        await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", { withCredentials: true });
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
    });

    export default api;
