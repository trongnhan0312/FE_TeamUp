// src/config/apiConfig.js

// Lấy BASE_URL từ biến môi trường nếu có, nếu không dùng giá trị mặc định
const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7286/api";
const API_VERSION = "v1";

export const API_CONFIG = {
    BASE_URL,
    TIMEOUT: 30000, // 30 giây timeout cho API calls
};

// Tạo full URL với path đã cho
export const getApiUrl = (path) => {
    return `${BASE_URL}/api/${path}`;
};

// Full base API URL
export const API_URL = `${BASE_URL}/api`;

// Các endpoints cụ thể
export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/user-login",
        REGISTER: "/auth/register-user",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
        REFRESH_TOKEN: "/auth/refresh-token",
        VERIFY_OTP: "/auth/confirm-register",
    },
    USER: {
        PROFILE: "/user/profile",
        UPDATE_PROFILE: "/user/profile",
        CHANGE_PASSWORD: "/user/change-password",
    },
    COURT: {
        GET_BY_ID: "/court",
        LIST: "/court/all",
        GET_BY_FREE_HOURS: "/courtbooking/free-hours",
        HANDLE_BOOKING: "/courtbooking/create",
    },
    SPORT: {
        GET_BY_ID: "/sportscomplex",
        LIST: "/sportscomplex",
    },
    RATING: {
        GET_BY_ID: "/rating",
        LIST: "/rating/all",
    },
    EMPLOYEE: {
        GET_COACHES_PAGINATION: "/employee/get-coaches-pagination",
        GET_COACH_DETAIL: "/employee/coach", // giả định
    },
    // Các endpoints khác
};
