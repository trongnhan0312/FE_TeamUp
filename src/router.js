// ======================= REACT / ROUTER / AUTH =======================
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { isAuthenticated, hasRole, getUserRoles } from "./utils/auth";
import { ROUTER } from "./utils/router";

// ======================= LAYOUT =======================
import MasterLayout from "./component/common/theme/masterLayout";
import OwnerLayout from "./component/common/theme/OwnerLayout";
import CoachLayout from "./component/common/theme/CoachLayout";
import AdminLayout from "./component/common/theme/AdminLayout";
// ======================= AUTH =======================
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpComponent/SignupPage";
import OtpVerificationPage from "./pages/EmailComponentUtil/OtpVerificationPage";
import ForgotPasswordPage from "./pages/auth/ForgetPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ForgetPassword/ResetPassword/ResetPassword";
// ======================= SURVEY =======================
import Survey from "./pages/auth/SignUpComponent/Survey/Survey";
import Question1 from "./pages/auth/SignUpComponent/Survey/Question1/question1";
import Question2 from "./pages/auth/SignUpComponent/Survey/Question2/question2";

// ======================= USER =======================
import HomePage from "./pages/users/homePage";
import ProfilePage from "./pages/users/profilePage";
import CourtListing from "./pages/users/courts/homepage_court/CourtListing";
import CourtDetailPage from "./pages/users/courts/court_detail/CourtDetailPage";
import CourtSchedule from "./pages/users/courts/court_schedule/CourtSchedule";
import CourtHistory from "./pages/users/courts/court_history/CourtHistory";
import CourtSelector from "./pages/users/courts/booking_court/CourtSelector";
import BookingConfirmation from "./pages/users/courts/booking_court/BookingConfirmation";
import BookingSummary from "./pages/users/courts/booking_court/BookingSummary";
import BookingDetail from "./pages/users/courts/court_history/booking_detail/BookingDetail";
import CoachListing from "./pages/users/coach/CoachListing";
import CoachProfile from "./pages/users/coach/CoachProfile";
import CoachBookingHistory from "./pages/users/coach/CoachBookingHistory";

import RoomList from "./pages/users/roomList";
import RoomCreateHistory from "./pages/users/roomList/RoomCreateHistory";
import CreateRoomForm from "./pages/users/roomList/CreateRoomForm";
import RoomDetail from "./pages/users/roomList/RoomDetail";

// ======================= USER - PAYMENT =======================
import PaymentSuccess from "./pages/users/Payment/PaymentSucces/PaymentSuccess";
import PaymentFail from "./pages/users/Payment/PaymentFail/PaymentFail";
// ======================= ADMIN =======================
import AdminDashboard from "./pages/admin/AdminDashboard";
// ======================= OWNER =======================
import Owner from "./pages/owner";
import ProfileOwner from "./pages/owner/profileOwner";
import HumanHabits from "./pages/owner/HumanHabits/HumanHabits";
import PitchHistory from "./pages/owner/PitchHistory/PitchHistory";
import BOOKINGMANAGEMENT from "./pages/owner/BookingManagement/BookingManagement";
import ReviewOwner from "./pages/owner/ReviewOwner/ReviewOwner";
import OwnerPackage from "./pages/owner/OwnerPackage/OwnerPackage";
import SportsComplexes from "./pages/owner/SportsComplexes/SportsComplexes";
import SportsComplexDetail from "./pages/owner/SportsComplexes/SportsComplexesDetail/SportsComplexesDetail";
import CreateSportsComplexes from "./pages/owner/SportsComplexes/CreateSportsComplexes/CreateSportsComplexes";
import CreateCourt from "./pages/owner/SportsComplexes/SportsComplexesDetail/CreateCourt/CreateCourt";
import CourtDetailOwner from "./pages/owner/SportsComplexes/SportsComplexesDetail/CourtDetailOwner/court_detail/CourtDetailPage";
import Crm from "./pages/owner/Crm/Crm";
// ======================= OWNER - PAYMENT =======================
import PaymentSuccessOwner from "./pages/owner/Payment/PaymentSucces/PaymentSuccess";
import PaymentFailOwner from "./pages/owner/Payment/PaymentFail/PaymentFail";

// ======================= COACH =======================
import Coach from "./pages/coach";
import ProfileByCoach from "./pages/coach/profileCoach";
import ReviewCoach from "./pages/coach/ReviewCoach/ReviewCoach";
import CoachHistory from "./pages/coach/CoachHistory/CoachHistory";
import CoachPackage from "./pages/coach/CoachPackage/CoachPackage";
import CoachBookingDetail from "./pages/coach/CoachHistory/CoachBookingDetail/CoachBookingDetail";
import CrmCoach from "./pages/coach/CrmCoach/CrmCoach";
// ======================= COACH - PAYMENT =======================
import PaymentSuccessCoach from "./pages/coach/Payment/PaymentSucces/PaymentSuccess";
import PaymentFailCoach from "./pages/coach/Payment/PaymentFail/PaymentFail";

// ======================= COMMON / STATIC PAGES =======================
import PrivacyPolicy from "./pages/users/privacyPolicy";
import AboutUs from "./pages/users/aboutUs";
import SupportCenter from "./pages/users/supportCenter";
import Blog from "./pages/users/blog";

// ======================= CHAT =======================
import ChatPage from "./pages/chat";

const RouterCustom = () => {
  const location = useLocation();
  const roles = getUserRoles();
  const isLoggedIn = isAuthenticated();
  const isOwner = roles.includes("Owner");
  const isCoach = roles.includes("Coach");
  const isAdmin = roles.includes("Admin");
  // Routes cho Owner
  const ownerRoutes = (
    <OwnerLayout>
      <Routes>
        <Route path="/owner" element={<Owner />} />
        <Route path="/ownerProfile" element={<ProfileOwner />} />
        <Route path={ROUTER.OWNER.HUMANHABITS} element={<HumanHabits />} />
        <Route path={ROUTER.OWNER.PITCHHISTORY} element={<PitchHistory />} />
        <Route
          path={ROUTER.OWNER.BOOKINGMANAGEMENT}
          element={<BOOKINGMANAGEMENT />}
        />
        <Route path={ROUTER.OWNER.CREATE_COURT} element={<CreateCourt />} />
        <Route path={ROUTER.OWNER.REVIEWOWNER} element={<ReviewOwner />} />
        <Route
          path={ROUTER.OWNER.SportsComplexes}
          element={<SportsComplexes />}
        />
        <Route
          path={ROUTER.OWNER.SportsComplexDetail}
          element={<SportsComplexDetail />}
        />
        <Route
          path={ROUTER.OWNER.CourtDetailOwner}
          element={<CourtDetailOwner />}
        />
        <Route
          path={ROUTER.OWNER.CreateSportsComplexes}
          element={<CreateSportsComplexes />}
        />
        <Route path={ROUTER.OWNER.OWNER_PACKAGE} element={<OwnerPackage />} />
        <Route
          path={ROUTER.OWNER.PAYMENT_SUCCESS}
          element={<PaymentSuccessOwner />}
        />
        <Route
          path={ROUTER.OWNER.PAYMENT_FAIL}
          element={<PaymentFailOwner />}
        />
        <Route path="*" element={<Navigate to="/owner" replace />} />
        <Route path={ROUTER.USER.ABOUT_US} element={<AboutUs />} />
        <Route path={ROUTER.USER.SUPPORT_CENTER} element={<SupportCenter />} />
        <Route path={ROUTER.USER.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route
          path={ROUTER.OWNER.COURT_BOOKING_DETAIL}
          element={<BookingDetail />}
        />
        <Route path={ROUTER.OWNER.BOOKING_CRM} element={<Crm />} />
      </Routes>
    </OwnerLayout>
  );

  // Routes cho Coach
  const coachRoutes = (
    <CoachLayout>
      <Routes>
        <Route path="/coach" element={<Coach />} />
        <Route path={ROUTER.COACH.CHAT} element={<ChatPage />} />
        <Route path={ROUTER.COACH.REVIEWCOACH} element={<ReviewCoach />} />
        <Route path={ROUTER.COACH.COACHHISTORY} element={<CoachHistory />} />
        <Route path={ROUTER.COACH.PROFILE} element={<CoachProfile />} />
        <Route
          path={ROUTER.COACH.PROFILEBYCOACH}
          element={<ProfileByCoach />}
        />
        <Route
          path={ROUTER.COACH.PAYMENT_SUCCESS}
          element={<PaymentSuccessCoach />}
        />
        <Route
          path={ROUTER.COACH.PAYMENT_FAIL}
          element={<PaymentFailCoach />}
        />
        <Route path={ROUTER.COACH.COACH_PACKAGE} element={<CoachPackage />} />
        <Route path={ROUTER.USER.ABOUT_US} element={<AboutUs />} />
        <Route path={ROUTER.USER.SUPPORT_CENTER} element={<SupportCenter />} />
        <Route path={ROUTER.USER.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route
          path={ROUTER.COACH.COACH_BOOKING_DETAIL}
          element={<CoachBookingDetail />}
        />
        <Route path={ROUTER.COACH.COACH_BOOKING_CRM} element={<CrmCoach />} />
        {/* <Route path="*" element={<Navigate to="/coach" replace />} /> */}
      </Routes>
    </CoachLayout>
  );

  // Routes cho user bình thường
  const userRoutes = (
    <MasterLayout>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/question1" element={<Question1 />} />
        <Route path="/question2" element={<Question2 />} />
        <Route path={ROUTER.USER.SURVEY} element={<Survey />} />
        <Route path={ROUTER.USER.DETAIL_COURT} element={<CourtDetailPage />} />
        <Route path={ROUTER.USER.SCHEDULE_COURT} element={<CourtSchedule />} />
        <Route
          path={ROUTER.USER.COURT_BOOKING_CONFIRMATION}
          element={<BookingConfirmation />}
        />
        <Route
          path={ROUTER.USER.COURT_BOOKING_SUMMARY}
          element={<BookingSummary />}
        />
        <Route path={ROUTER.USER.COURT_HOMEPAGE} element={<CourtListing />} />
        <Route
          path={ROUTER.USER.COACH_GET_ALL_DEFAULT}
          element={<CoachListing />}
        />
        <Route path={ROUTER.USER.COACH_GET_ALL} element={<CoachListing />} />
        <Route path={ROUTER.USER.COACH_GET_DETAIL} element={<CoachProfile />} />
        <Route path={ROUTER.USER.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTER.USER.ABOUT_US} element={<AboutUs />} />
        <Route path={ROUTER.USER.SUPPORT_CENTER} element={<SupportCenter />} />
        <Route path={ROUTER.USER.BLOG} element={<Blog />} />
        <Route path={ROUTER.USER.CHAT} element={<ChatPage />} />
        <Route path={ROUTER.USER.ROOM} element={<RoomList />} />

        <Route
          path={ROUTER.USER.COACH_BOOKING_SELECT_COURT}
          element={<CourtSelector />}
        />
        <Route
          path={ROUTER.USER.COURT_BOOKING_HISTORY}
          element={<CourtHistory />}
        />

        <Route
          path={ROUTER.USER.COACH_BOOKING_SELECT_COURT}
          element={<CourtSelector />}
        />
        <Route
          path={ROUTER.USER.COURT_BOOKING_HISTORY}
          element={<CourtHistory />}
        />
        <Route
          path={ROUTER.USER.COACH_BOOKING_HISTORY}
          element={<CoachBookingHistory />}
        />
        <Route
          path={ROUTER.USER.PAYMENT_SUCCESS}
          element={<PaymentSuccess />}
        />
        <Route path={ROUTER.USER.PAYMENT_FAIL} element={<PaymentFail />} />
        <Route
          path={ROUTER.USER.ROOM_CREATE_HISTORY}
          element={<RoomCreateHistory />}
        />
        <Route path={ROUTER.USER.ROOM_CREATE} element={<CreateRoomForm />} />
        <Route path={ROUTER.USER.ROOM_DETAIL} element={<RoomDetail />} />
        <Route
          path={ROUTER.USER.COURT_BOOKING_DETAIL}
          element={<BookingDetail />}
        />
        {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
      </Routes>
    </MasterLayout>
  );
  const adminRoutes = (
    <AdminLayout>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AdminLayout>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : isOwner ? (
              <Navigate to="/owner" replace />
            ) : isCoach ? (
              <Navigate to="/coach" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Route OTP Verification không cần đăng nhập */}
      <Route path={ROUTER.OTP_VERIFICATION} element={<OtpVerificationPage />} />

      <Route
        path="/login"
        element={
          isLoggedIn ? (
            isOwner ? (
              <Navigate to="/owner" replace />
            ) : isCoach ? (
              <Navigate to="/coach" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? (
            isOwner ? (
              <Navigate to="/owner" replace />
            ) : isCoach ? (
              <Navigate to="/coach" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <SignupPage />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isLoggedIn ? (
            isOwner ? (
              <Navigate to="/owner" replace />
            ) : isCoach ? (
              <Navigate to="/coach" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <ForgotPasswordPage /> // <-- sửa chỗ này
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          isLoggedIn ? (
            isOwner ? (
              <Navigate to="/owner" replace />
            ) : isCoach ? (
              <Navigate to="/coach" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <ResetPassword /> // <-- sửa chỗ này
          )
        }
      />
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            isAdmin ? (
              adminRoutes
            ) : isOwner ? (
              ownerRoutes
            ) : isCoach ? (
              coachRoutes
            ) : (
              userRoutes
            )
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
    </Routes>
  );
};

export default RouterCustom;
