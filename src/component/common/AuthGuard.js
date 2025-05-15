// components/common/AuthGuard.js
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth'

const AuthGuard = ({ children }) => {
  if (!isAuthenticated()) {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã đăng nhập, hiển thị children
  return children;
};

export default AuthGuard;