import { ROUTER } from "./utils/router";
import HomePage from "./pages/users/homePage";
import { Navigate, Route, Routes } from "react-router-dom";
import MasterLayout from "./component/common/theme/masterLayout";
import ProfilePage from "./pages/users/profilePage";
import LoginPage from "./pages/auth/LoginPage";

const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTER.USER.HOME,
      component: <HomePage />,
    },
    {
      path: ROUTER.USER.PROFILE,
      component: <ProfilePage />,
    },
  ];
  return (
    <MasterLayout>
      <Routes>
        {userRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
  );
};

const renderAuthRouter = () => {
  const authRouters = [
    {
      path: ROUTER.AUTH.LOGIN,
      component: <LoginPage />,
    }
  ];
  
  return (
    <Routes>
      {authRouters.map((item, key) => (
        <Route key={key} path={item.path} element={item.component} />
      ))}
    </Routes>
  );
};

const RouterCustom = () => {
  // Đây là nơi bạn có thể kiểm tra xem người dùng đã đăng nhập hay chưa
  // Ví dụ: const isLoggedIn = localStorage.getItem('token');
  const isLoggedIn = false; // Giả sử ban đầu chưa đăng nhập
  
  return (
    <Routes>
      {/* Redirect từ trang chủ "/" sang trang đăng nhập */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Route cho trang đăng nhập */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Routes cho người dùng đã đăng nhập */}
      <Route path="/*" element={
        isLoggedIn ? (
          <MasterLayout>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Các route khác */}
            </Routes>
          </MasterLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

export default RouterCustom;
