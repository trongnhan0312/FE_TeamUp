import React, { useState, useEffect } from "react";
import "./style.scss";
import authService from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "forgot_password_email";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Optional: Load email nếu trước đó đã gửi thành công
  useEffect(() => {
    const savedEmail = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Gọi khi gửi OTP thành công
  const saveEmailToLocalStorage = (email) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, email);
  };
  const handleBack = () => navigate("/login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      console.log("🔁 Bắt đầu gửi yêu cầu quên mật khẩu với email:", email);

      const response = await authService.forgotPassword(email);
      console.log("📥 Phản hồi từ server:", response);

      if (response?.isSuccessed) {
        setMessage(
          "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư."
        );
        console.log("✅ Gửi thành công");
        saveEmailToLocalStorage(email); // ✅ Lưu vào localStorage khi thành công
        navigate("/reset-password"); // ✅ Chuyển trang
      } else {
        setError(
          `Không thể gửi email. ${response?.message || "Vui lòng thử lại sau."}`
        );
        console.warn("⚠️ Gửi thất bại - Server trả về không thành công");
      }
    } catch (err) {
      console.error("❌ Lỗi khi gửi yêu cầu quên mật khẩu:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forget-password-container">
      <form className="forget-password-form" onSubmit={handleSubmit}>
        <h2>Quên mật khẩu</h2>
        <p>Nhập email của bạn để đặt lại mật khẩu</p>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
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

export default ForgetPassword;
