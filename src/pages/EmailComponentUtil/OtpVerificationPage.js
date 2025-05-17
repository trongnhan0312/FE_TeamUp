import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpVerificationPage.scss";
import logoImg from "../../assets/user/main_logo.jpg";
import authService from "../../services/authService";
import { ROUTER } from "../../utils/router";

const OtpVerificationPage = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const email =
        new URLSearchParams(window.location.search).get("email") || "";

    // Khởi tạo mảng references cho các ô input
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    // Đếm ngược thời gian cho phép gửi lại OTP
    useEffect(() => {
        if (timer > 0) {
            const timerId = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    // Xử lý thay đổi giá trị của từng ô OTP
    const handleChange = (index, value) => {
        // Chỉ chấp nhận số
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Di chuyển focus sang ô tiếp theo nếu đã nhập
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Xử lý sự kiện keydown
    const handleKeyDown = (index, e) => {
        // Xử lý phím Backspace: Xóa và quay lại ô trước đó
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    // Xử lý paste OTP
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        // Kiểm tra xem dữ liệu dán có phải chỉ là số
        if (!/^\d+$/.test(pastedData)) return;

        // Lấy tối đa 6 ký tự từ dữ liệu dán
        const digits = pastedData.slice(0, 6).split("");

        // Cập nhật OTP với các chữ số đã dán
        const newOtp = [...otp];
        digits.forEach((digit, idx) => {
            if (idx < 6) newOtp[idx] = digit;
        });

        setOtp(newOtp);

        // Di chuyển focus đến ô phù hợp
        if (digits.length < 6) {
            inputRefs.current[digits.length].focus();
        } else {
            inputRefs.current[5].focus();
        }
    };

    // Gửi mã OTP để xác thực
    const verifyOtp = async () => {
        // Kiểm tra xem đã nhập đủ OTP chưa
        if (otp.some((digit) => digit === "")) {
            setError("Vui lòng nhập đầy đủ mã OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const otpString = otp.join("");

            // Gọi API xác thực OTP
            const response = await authService.verifyOtp(email, otpString);

            if (response.isSuccessed) {
                setSuccessMessage("Xác thực thành công!");

                // Chuyển hướng đến trang đăng nhập sau 2 giây
                setTimeout(() => {
                    navigate(ROUTER.AUTH.LOGIN);
                }, 2000);
            } else {
                setError("Mã OTP không chính xác");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setError("Đã xảy ra lỗi. Vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-verification-page">
            <div className="otp-container">
                <div className="logo-container">
                    <img src={logoImg} alt="Logo" className="logo" />
                </div>

                <h1 className="title">Xác thực tài khoản</h1>

                <p className="info-text">
                    Vui lòng nhập mã OTP đã được gửi đến email {email}
                </p>

                {/* Hiển thị thông báo lỗi */}
                {error && <div className="error-message">{error}</div>}

                {/* Hiển thị thông báo thành công */}
                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}

                {/* Các ô nhập OTP */}
                <div className="otp-inputs">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : null}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            className="otp-input"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                {/* Nút xác thực */}
                <button
                    className="verify-button"
                    onClick={verifyOtp}
                    disabled={loading || otp.some((digit) => digit === "")}
                >
                    {loading ? "Đang xử lý..." : "Xác thực"}
                </button>

                {/* Thông tin gửi lại OTP */}
                <div className="resend-container">
                    <span>Chưa nhận được mã? </span>
                    {canResend ? (
                        <button
                            className="resend-button"
                            onClick={verifyOtp}
                            disabled={loading}
                        >
                            Gửi lại
                        </button>
                    ) : (
                        <span className="timer">Gửi lại sau {timer}s</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationPage;
