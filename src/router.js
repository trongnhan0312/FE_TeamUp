import HomePage from "./pages/users/homePage";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import MasterLayout from "./component/common/theme/masterLayout";
import OwnerLayout from "./component/common/theme/OwnerLayout";
import ProfilePage from "./pages/users/profilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpComponent/SignupPage";
import { useEffect, useState } from "react";
import { isAuthenticated, hasRole } from "./utils/auth";
import CourtDetailPage from "./pages/users/courts/court_detail/CourtDetailPage";
import Owner from "./pages/owner";
import { ROUTER } from "./utils/router";
import OtpVerificationPage from "./pages/EmailComponentUtil/OtpVerificationPage";
import CourtSchedule from "./pages/users/courts/court_schedule/CourtSchedule";
import BookingConfirmation from "./pages/users/courts/BookingConfirmation";

const RouterCustom = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
        setIsOwner(isAuthenticated() && hasRole("Owner")); // Kiểm tra role Owner
    }, [location.pathname]);

    // Routes cho Owner
    const ownerRoutes = (
        <OwnerLayout>
            <Routes>
                <Route path="/owner" element={<Owner />} />
                <Route path="*" element={<Navigate to="/owner" replace />} />
            </Routes>
        </OwnerLayout>
    );

    // Routes cho user bình thường
    const userRoutes =
        (console.log("isLoggedIn", hasRole("Owner")),
        (
            <MasterLayout>
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                        path={ROUTER.USER.DETAIL_COURT}
                        element={<CourtDetailPage />}
                    />
                    <Route
                        path={ROUTER.USER.SCHEDULE_COURT}
                        element={<CourtSchedule />}
                    />
                    <Route
                        path={ROUTER.USER.COURT_BOOKING_CONFIRMATION}
                        element={<BookingConfirmation />}
                    />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </MasterLayout>
        ));

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isLoggedIn ? (
                        isOwner ? (
                            <Navigate to="/owner" replace />
                        ) : (
                            <Navigate to="/home" replace />
                        )
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Route cho trang OTP Verification - có thể truy cập mà không cần đăng nhập */}
            <Route
                path={ROUTER.OTP_VERIFICATION}
                element={<OtpVerificationPage />}
            />

            <Route
                path="/login"
                element={
                    isLoggedIn ? (
                        <Navigate to={isOwner ? "/owner" : "/home"} replace />
                    ) : (
                        <LoginPage />
                    )
                }
            />
            <Route
                path="/register"
                element={
                    isLoggedIn ? (
                        <Navigate to={isOwner ? "/owner" : "/home"} replace />
                    ) : (
                        <SignupPage />
                    )
                }
            />

            <Route
                path="/*"
                element={
                    isLoggedIn ? (
                        isOwner ? (
                            ownerRoutes
                        ) : (
                            userRoutes
                        )
                    ) : (
                        <Navigate
                            to="/login"
                            replace
                            state={{ from: location }}
                        />
                    )
                }
            />
        </Routes>
    );
};

export default RouterCustom;
