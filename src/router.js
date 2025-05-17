import HomePage from "./pages/users/homePage";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import MasterLayout from "./component/common/theme/masterLayout";
import ProfilePage from "./pages/users/profilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpComponent/SignupPage";
import { useEffect, useState } from "react";
import { isAuthenticated } from "./utils/auth";
import CourtDetailPage from "./pages/users/courts/court_detail/CourtDetailPage";
import OtpVerificationPage from "./pages/EmailComponentUtil/OtpVerificationPage";
import { ROUTER } from "./utils/router";

const RouterCustom = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

    // Kiểm tra lại trạng thái đăng nhập mỗi khi đường dẫn thay đổi
    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, [location.pathname]);

    // Các route cho người dùng đã đăng nhập
    const userRoutes = (
        <MasterLayout>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/courts/:courtId" element={<CourtDetailPage />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </MasterLayout>
    );

    return (
        <Routes>
            {/* Trang chủ redirect tùy theo trạng thái đăng nhập */}
            <Route
                path="/"
                element={
                    isLoggedIn ? (
                        <Navigate to="/home" replace />
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

            {/* Route cho trang đăng nhập và đăng ký - chỉ hiển thị khi chưa đăng nhập */}
            <Route
                path="/login"
                element={
                    isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage />
                }
            />
            <Route
                path="/register"
                element={
                    isLoggedIn ? (
                        <Navigate to="/home" replace />
                    ) : (
                        <SignupPage />
                    )
                }
            />

            {/* Các route bảo vệ - chỉ truy cập được khi đã đăng nhập */}
            <Route
                path="/*"
                element={
                    isLoggedIn ? (
                        userRoutes
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
