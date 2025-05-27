// src/config/apiConfig.js

// Lấy BASE_URL từ biến môi trường nếu có, nếu không dùng giá trị mặc định
const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7286/api";

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
    RESEND_OTP: "/auth/resend-otp",
    LOGOUT: "/auth/logout",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    GET_USER_BY_ID: "/user",
    GET_ALL_USER: "/user/all",
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
    GET_COACH_PROFILE: "/employee",
  },
  CHAT: {
    GET_MESSAGE: "/chat/get-message",
    SEND_MESSAGE: "/chat/send-message",
  },
  ROOM: {
    GET_ALL: "/room/all"
  },
  ROOM_JOIN_REQUEST:{
    CREATE_ROOM_JOIN_REQUEST: "/roomjoinrequest/create"
  },
  VOUCHER: {
    GET_ALL: "/voucher/all",
    GET_BY_ID: "/voucher"
  },
  COACH_BOOKING: {
    CREATE_COACH_BOOKING: "/coachbooking/create"
  },
  // Các endpoints khác
};
