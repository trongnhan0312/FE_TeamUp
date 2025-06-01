import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../component/common/theme/footer";
import "./LoginPage.scss";
import loginImg from "../../assets/user/login.png";
import { ROUTER } from "../../utils/router";
import authService from "../../services/authService";
import { saveAuthData } from "../../utils/auth";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gọi API đăng nhập
      const response = await authService.login(email, password);

      // Kiểm tra response thành công
      if (!response.isSuccessed) {
        throw new Error(response.message || "Đăng nhập thất bại");
      }

      // Kiểm tra có token trong response
      if (!response.resultObj || !response.resultObj.accessToken) {
        throw new Error("Token không tồn tại trong phản hồi");
      }

      // Lưu thông tin xác thực
      const userData = saveAuthData(response);
      const ownerId = userData.id || userData.userId;

      console.log("User data:", userData);
      if (userData.role === "User") {
        // Đăng nhập thành công - log thông tin và chuyển hướng
        console.log("Đăng nhập thành công!", userData);
        navigate(ROUTER.USER.HOME);
      } else if (userData.role === "Owner") {
        console.log("Đăng nhập thành công!", userData);
        localStorage.setItem("ownerId", ownerId);
        navigate(ROUTER.OWNER.HOME);
      } else if (userData.role === "Coach") {
        console.log("Đăng nhập thành công!", userData);
        navigate(ROUTER.COACH.HOME);
      } else {
        // Có lỗi khi xử lý dữ liệu xác thực
        setError("Không thể xử lý thông tin đăng nhập. Vui lòng thử lại.");
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Login error:", error);

      // Hiển thị thông báo lỗi phù hợp
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Đăng nhập thất bại");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await authService.loginGoogle({
        email: decoded.email,
        email_verified: decoded.email_verified,
        family_name: decoded.family_name,
        given_name: decoded.given_name,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub
      });

      if (!response.isSuccessed) {
        throw new Error(response.message || "Đăng nhập với Google thất bại");
      }

      const userData = saveAuthData(response);
      const ownerId = userData.id || userData.userId;

      if (userData.role === "User") navigate(ROUTER.USER.HOME);
      else if (userData.role === "Owner") {
        localStorage.setItem("ownerId", ownerId);
        navigate(ROUTER.OWNER.HOME);
      } else if (userData.role === "Coach") navigate(ROUTER.COACH.HOME);
      else setError("Không thể xử lý thông tin đăng nhập.");
    } catch (err) {
      console.error("Google Login error:", err);
      setError(err.message || "Đăng nhập với Google thất bại");
    }
  };

  return (
    <div className="login-page">
      {/* Main content */}
      <div className="login-container">
        {/* Login Form */}
        <div className="login-form-container">
          <h1 className="login-title">Đăng nhập</h1>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Error message */}
            {error && <div className="error-message">{error}</div>}

            {/* Email field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password field */}
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="rememberMe">Ghi nhớ</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Quên mật khẩu
              </Link>
            </div>

            {/* Login button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Sign up link */}
            <div className="signup-link">
              Người dùng mới ?{" "}
              <Link to={ROUTER.AUTH.REGISTER}>Đăng ký ngay</Link>
            </div>
          </form>

          {/* Divider with text */}
          <div className="login-divider">
            <span>Đăng nhập với</span>
          </div>

          {/* Social login */}
          <div className="social-login">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Google login failed");
                }}
              />
            </GoogleOAuthProvider>
            {/* <button className="social-button google" disabled={loading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button> */}
          </div>
        </div>

        {/* Image */}
        <div className="login-image">
          <div className="image-container">
            <img src={loginImg} alt="Badminton rackets and shuttlecocks" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
