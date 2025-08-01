// src/config/apiConfig.js

// Lấy BASE_URL từ biến môi trường nếu có, nếu không dùng giá trị mặc định
const BASE_URL = "https://miraculous-clarity-production.up.railway.app";

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
    REGISTER_OWNER: "/auth/register-owner",
    REGISTER_COACH: "/auth/register-coach",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH_TOKEN: "/auth/refresh-token",
    VERIFY_OTP: "/auth/confirm-register",
    RESEND_OTP: "/auth/resend-otp",
    LOGOUT: "/auth/logout",
    LOGIN_GOOGLE: "/auth/google-login-user",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    GET_USER_BY_ID: "/user",
    GET_ALL_USER: "/user/all",
    UPDATE_USER_OWNER_PROFILE: "user/update-user-owner-profile",
    UPDATE_PROFILE: "/user/update-user-owner-profile",
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
    AVERAGE: "/rating/average-count/",
    CREATE: "/rating/create",
  },
  EMPLOYEE: {
    GET_COACHES_PAGINATION: "/employee/get-coaches-pagination",
    GET_COACH_PROFILE: "employee",
    UPDATE_COACH_PROFILE: "/employee/update-coach-profile",
    GET_ALL_COACHES: "/employee/get-all-coaches",
    GET_ALL_OWNERS: "employee/get-all-owners",
    GET_EMPLOYEE_BY_ID: "/employee",
  },
  CHAT: {
    GET_MESSAGE: "/chat/get-message",
    SEND_MESSAGE: "/chat/send-message",
    GET_PARNERS: "/chat/chat-partners",
  },
  ROOM: {
    GET_ALL: "/room/all",
    UPDATE_STATUS: "/room/status",
    CREATE: "/room/create",
    GET_BY_ID: "/room",
    DELETE: "/room/delete",
  },
  ROOM_JOIN_REQUEST: {
    CREATE_ROOM_JOIN_REQUEST: "/roomjoinrequest/create",
    GET_ALL: "/roomjoinrequest/all",
    UPDATE_STATUS: "roomjoinrequest/status",
  },
  ROOM_PLAYER: {
    GET_ALL: "/roomplayer/all",
  },
  OWNER: {
    OWNER_STATS: "courtbooking/user-court-totalprice-stats/owner",
    COURTS: "court/all",
    WEEKBOOKED_SLOTS: "courtbooking/weekly-booked-slots",
    MOST_BOOKED_COURTS: "courtbooking/stats/most-booked-by-owner",
    BOOKING_HISTORY: "courtbooking/all",
    BOOKING_UPDATE: "courtbooking/status",
    SPORTS_COMPLEXES: "sportscomplex/all",
    SPORTS_COMPLEXES_DETAIL: "court/all",
    TOTAL_PRICE: "courtbooking/total-price/owner",
    CREATE_SPORTS_COMPLEX: "sportscomplex/create",
    CREATE_COURT: "court/create",
    TOP_USER: "courtbooking/top-user",
    BOOKING_CRM: "courtbooking/owner-user-booking-crm",
  },
  PAYMENT: {
    CREATE_PAYMENT_VNPay: "payment/create-vnpay-url",
    CREATE_PAYMENT_PayOS: "payment/create-payos-url",
    GET_ALL: "/payment/all",
  },
  VOUCHER: {
    GET_ALL: "/voucher/all",
    GET_BY_ID: "/voucher",
  },
  COACH_BOOKING: {
    CREATE_COACH_BOOKING: "/coachbooking/create",
    GET_COACH_STATS: "/coachbooking/user-coach-totalprice-stats",
    GET_PLAYER_LIST: "/coachbooking/players",
    GET_MONTHLY_TOTAL: "/coachbooking/monthly-total",
    GET_WEEKLY_BOOKED_SLOTS: "/coachbooking/weekly-booked-slots",
    GET_ALL: "/coachbooking/all",
    GET_TOTAL_PRICE: "/coachbooking/total-price/coach",
    UPDATE_STATUS: "/coachbooking/status",
    GET_LATEST_BOOKING_ID: "/coachbooking/latest-booking-id",
    COUNT_VIEW: "/courtbooking/view",
    GET_TOP_USER: "/coachbooking/top-user",
    GET_BY_ID: "/coachbooking",
    COACH_BOOKING_CRM: "/coachbooking/coach-player-booking-crm",
  },

  AI_WEBSITE: {
    GET_RESPONSE: "/ai-web/get-website-response",
  },
  COURT_BOOKING: {
    GET_ALL: "/courtbooking/all",
    UPDATE_STATUS: "/courtbooking/status",
    LATEST_BOOKING_ID: "/courtbooking/latest-booking-id",
    COUNT_VIEW: "/courtbooking/view",
    GET_BY_ID: "/courtbooking",
  },

  // Các endpoints khác
};
