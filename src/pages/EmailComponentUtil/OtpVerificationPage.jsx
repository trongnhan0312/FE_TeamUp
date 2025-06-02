import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpVerificationPage.scss";
import logoImg from "../../assets/user/main_logo.jpg";
import authService from "../../services/authService";
import { ROUTER } from "../../utils/router";
import { saveAuthData, decodeToken } from "../../utils/auth";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email") || "";
  const fallbackRole = urlParams.get("role") || "";

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;
    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    setOtp(newOtp);
    const nextIndex = digits.length >= 6 ? 5 : digits.length;
    inputRefs.current[nextIndex]?.focus();
  };

  const redirectBasedOnRole = (userRole) => {
    const normalizedRole = userRole?.toLowerCase();
    console.log("➡️ Vai trò sau xác thực:", normalizedRole);
    switch (normalizedRole) {
      case "user":
        window.location.href = "/survey";
        break;
      case "owner":
        window.location.assign("/owner");

        break;
      case "coach":
        window.location.href = ROUTER.COACH.HOME || "/coach";
        break;
      default:
        window.location.href = "/home";
    }
  };

  const verifyOtp = async () => {
    if (otp.some((digit) => digit === "")) {
      setError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const otpString = otp.join("");
      const response = await authService.verifyOtp(email, otpString);

      if (response.isSuccessed) {
        const token = response?.resultObj?.accessToken;
        const decoded = decodeToken(token);
        const actualRole = decoded?.Role || decoded?.role || fallbackRole;

        console.log("✅ TOKEN:", decoded);
        console.log("✅ ROLE dùng để xử lý:", actualRole);

        if (actualRole.toLowerCase() === "user") {
          saveAuthData(response);
          redirectBasedOnRole(actualRole);
        } else {
          // Không lưu và không chuyển trang nếu là owner hoặc coach
          navigate(ROUTER.AUTH.LOGIN);
        }
      } else {
        setError(response.message || "Mã OTP không chính xác");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await authService.resendOtp(email);
      if (response.isSuccessed) {
        setSuccessMessage("Đã gửi lại mã OTP thành công!");
        setTimer(60);
        setCanResend(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Gửi lại OTP không thành công");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Đã xảy ra lỗi khi gửi lại OTP. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification-page">
      <div className="otp-container">
        <div className="logo-container">
          <img
            src={logoImg || "/placeholder.svg"}
            alt="Logo"
            className="logo"
          />
        </div>

        <h1 className="title">Xác thực tài khoản</h1>
        <p className="info-text">
          Vui lòng nhập mã OTP đã được gửi đến email <strong>{email}</strong>
          {fallbackRole && (
            <span className="role-info">
              <br />
              Đăng ký với vai trò: <strong>{fallbackRole}</strong>
            </span>
          )}
        </p>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          className="verify-button"
          onClick={verifyOtp}
          disabled={loading || otp.some((digit) => digit === "")}
        >
          {loading ? "Đang xử lý..." : "Xác thực và đăng nhập"}
        </button>

        <div className="resend-container">
          <span>Chưa nhận được mã? </span>
          {canResend ? (
            <button
              className="resend-button"
              onClick={resendOtp}
              disabled={loading}
            >
              Gửi lại
            </button>
          ) : (
            <span className="timer">Gửi lại sau {timer}s</span>
          )}
        </div>

        <div className="back-to-signup">
          <button
            className="back-button"
            onClick={() => navigate(ROUTER.AUTH.REGISTER || "/register")}
            disabled={loading}
          >
            ← Quay lại đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
