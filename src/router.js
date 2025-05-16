import HomePage from "./pages/users/homePage";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import MasterLayout from "./component/common/theme/masterLayout";
import OwnerLayout from "./component/common/theme/OwnerLayout";
import ProfilePage from "./pages/users/profilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { useEffect, useState } from "react";
import { isAuthenticated, hasRole } from "./utils/auth";
import CourtDetailPage from "./pages/users/courts/court_detail/CourtDetailPage";
import Owner from "./pages/owner"; // giả sử bạn có trang này
// const renderUserRouter = () => {
//   const userRouters = [
//     {
//       path: ROUTER.USER.HOME,
//       component: <HomePage />,
//     },
//     {
//       path: ROUTER.USER.PROFILE,
//       component: <ProfilePage />,
//     },
//   ];
//   return (
//     <MasterLayout>
//       <Routes>
//         {userRouters.map((item, key) => (
//           <Route key={key} path={item.path} element={item.component} />
//         ))}
//       </Routes>
//     </MasterLayout>
//   );
// };

// const renderAuthRouter = () => {
//   const authRouters = [
//     {
//       path: ROUTER.AUTH.LOGIN,
//       component: <LoginPage />,
//     },
//     {
//       path: ROUTER.AUTH.REGISTER,
//       component: <SignupPage />,
//     }
//   ];

//   return (
//     <Routes>
//       {authRouters.map((item, key) => (
//         <Route key={key} path={item.path} element={item.component} />
//       ))}
//     </Routes>
//   );
// };

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
          <Route path="/courts/:id" element={<CourtDetailPage />} />
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
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
    </Routes>
  );
};

export default RouterCustom;
