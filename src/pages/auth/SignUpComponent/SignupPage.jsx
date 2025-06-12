"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.scss";
import signupImg from "../../../assets/user/register.png";
import authService from "../../../services/authService";
import { ROUTER } from "../../../utils/router";
import RoleSelectionModal from "./RoleSelectionModal/RoleSelectionModal";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  // Kiểm tra mật khẩu mỗi khi người dùng thay đổi
  useEffect(() => {
    // Chỉ kiểm tra khi người dùng đã bắt đầu nhập mật khẩu
    if (password.length > 0) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
      const isLongEnough = password.length >= 6;

      setIsPasswordValid(
        hasUpperCase && hasLowerCase && hasSpecialChar && isLongEnough
      );
    } else {
      // Nếu chưa nhập, không hiển thị lỗi
      setIsPasswordValid(true);
    }
  }, [password]);

  const validateForm = () => {
    // Kiểm tra mật khẩu hợp lệ
    if (!isPasswordValid) {
      setError("Mật khẩu không đáp ứng yêu cầu");
      return false;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xác thực form trước khi hiển thị modal chọn vai trò
    if (!validateForm()) {
      return;
    }

    // Hiển thị modal chọn vai trò
    setShowRoleModal(true);
  };

  const handleRoleSelection = async (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    setLoading(true);
    setError("");

    try {
      const userData = {
        fullName,
        email,
        phoneNumber: phone,
        password,
        confirmPassword,
      };

      let response;

      // Gọi API register tương ứng với role được chọn
      switch (role) {
        case "user":
          response = await authService.register(userData);
          break;
        case "owner":
          response = await authService.registerOwner(userData);
          break;
        case "coach":
          response = await authService.registerCoach(userData);
          break;
        default:
          throw new Error("Vai trò không hợp lệ");
      }

      if (response.isSuccessed) {
        // Chuyển đến trang OTP verification với thông tin role
        navigate(
          `${ROUTER.OTP_VERIFICATION}?email=${encodeURIComponent(
            email
          )}&role=${encodeURIComponent(role)}`
        );
      } else {
        setError(response.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Error during registration:", error);

      // Xử lý lỗi từ API
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Đăng ký thất bại");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
  };

  return (
    <div className="signup-page">
      {/* Main content */}
      <div className="signup-container">
        {/* Signup Form */}
        <div className="signup-form-container">
          <h1 className="signup-title">Đăng ký</h1>

          {/* Thông báo lỗi */}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Full Name field */}
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email and Phone fields - side by side on desktop */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john.doe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+84"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
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
                  className={
                    password.length > 0 && !isPasswordValid ? "invalid" : ""
                  }
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
              <div
                className={`password-requirement ${
                  password.length > 0 && !isPasswordValid ? "invalid" : ""
                }`}
              >
                Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và
                ký tự đặc biệt
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={
                    confirmPassword && password !== confirmPassword
                      ? "invalid"
                      : ""
                  }
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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

            {/* Terms and Conditions */}
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="agreeTerms">
                Đồng ý với{" "}
                <Link to="/terms" className="terms-link">
                  điều khoản trong Thỏa thuận người dùng
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="terms-link">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            {/* Signup button */}
            <button
              type="submit"
              className="signup-button"
              disabled={!agreeTerms || loading}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            {/* Login link */}
            <div className="login-link">
              Đã có tài khoản ? <Link to="/login">Đăng nhập</Link>
            </div>
          </form>
        </div>

        {/* Image */}
        <div className="signup-image">
          <div className="image-container">
            <img
              src={signupImg || "/placeholder.svg"}
              alt="Badminton rackets and shuttlecocks"
            />
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={handleCloseModal}
        onSelectRole={handleRoleSelection}
        loading={loading}
      />
    </div>
  );
};

export default SignupPage;
