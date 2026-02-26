import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080"
});

/* -------- Attach Token to Requests -------- */
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

/* -------- Handle Token Expiry (401) -------- */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");

            // Redirect to login
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default API;