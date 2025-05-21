export const ROUTER = {
  USER: {
    HOME: "/home",
    PROFILE: "/profile",
    DETAIL_COURT: "/courts/:courtId",
    SCHEDULE_COURT: "/court-schedule/:courtId",
    COURT_BOOKING_CONFIRMATION: "/booking-confirmation",
    COURT_BOOKING_SUMMARY: "/booking-summary",
    COURT_HOMEPAGE: "/court/:type",
    COACH_GET_ALL: "/coaches/:type",
    COACH_GET_ALL_DEFAULT: "/coaches",
    COACH_GET_DETAIL: "/coaches/profile/:coachId",
    PRIVACY_POLICY: "/privacy-policy",
    ABOUT_US: "/about-us",
    SUPPORT_CENTER: "/support-center",
    BLOG: "/blog",
  },
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  OTP_VERIFICATION: "/verify-otp",
  OWNER: {
    HOME: "/owner",
    HUMANHABITS: "/owner/humanhabits",
    PITCHHISTORY: "/owner/pitchhistory",
    BOOKINGMANAGEMENT: "/owner/bookingmanagement",
    CREATEYARD: "/owner/createyard",
    REVIEWYARD: "/owner/reviewyard",
  },
  COACH: {
    HOME: "/coach",
  },
};
