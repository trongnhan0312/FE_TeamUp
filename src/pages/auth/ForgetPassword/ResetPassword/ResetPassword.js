import React, { useState, useEffect } from "react";
import "./style.scss";
import authService from "../../../../services/authService";
import { useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "forgot_password_email";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("❌ Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword({
        email,
        code,
        password,
        confirmPassword,
      });

      if (response?.isSuccessed) {
        setMessage(
          "✅ Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập..."
        );
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response?.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (err) {
      const errMsg = err?.errors
        ? Object.values(err.errors).flat().join(" ")
        : err?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY); // Xóa email khi quay lại
    navigate("/forgot-password");
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2>Đặt lại mật khẩu</h2>

        {email && (
          <p className="email-display">
            Đặt lại mật khẩu cho email: <strong>{email}</strong>
          </p>
        )}

        <input
          type="text"
          placeholder="Mã OTP"
          value={code}
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) {
              setCode(value);
            }
          }}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>

        <button type="button" className="back-button" onClick={handleBack}>
          ← Quay lại
        </button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
