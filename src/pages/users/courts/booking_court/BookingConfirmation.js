import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingConfirmation.scss";
import { FaChevronLeft, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import courtService from "../../../../services/courtService";
import { getUserInfo } from "../../../../utils/auth";

const BookingConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [courtData, setCourtData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [discount, setDiscount] = useState(0);
    const userData = getUserInfo();

    // Nhận dữ liệu từ courtSchedule
    const bookingData = location.state?.bookingData;

    useEffect(() => {
        // Kiểm tra nếu không có dữ liệu đặt sân
        if (!bookingData) {
            setError("Không tìm thấy thông tin đặt sân");
            setLoading(false);
            return;
        }

        // Lấy thông tin sân từ API
        const fetchCourtData = async () => {
            try {
                const data = await courtService.getById(bookingData.courtId);

                if (data.isSuccessed) {
                    setCourtData(data.resultObj);
                } else {
                    setError("Không thể lấy thông tin sân");
                }
            } catch (err) {
                console.error("Lỗi khi gọi API:", err);
                setError("Đã xảy ra lỗi khi tải thông tin sân");
            } finally {
                setLoading(false);
            }
        };

        fetchCourtData();
    }, [bookingData]);

    // Tính tổng tiền
    const calculateTotalPrice = () => {
        if (!courtData || !bookingData) return 0;

        const pricePerHour = courtData.pricePerHour || 0;
        const totalHours = bookingData.duration || 0;
        const subtotal = pricePerHour * totalHours;

        // Áp dụng giảm giá nếu có
        const discountAmount = discount;

        return subtotal - discountAmount;
    };

    const handleConfirmBooking = async () => {
        setLoading(true);

        const dateStr = bookingData.date;
        const startTimeISO = `${dateStr}T${bookingData.startTime}:00`;
        const endTimeISO = `${dateStr}T${bookingData.endTime}:00`;

        const bookingDetails = {
            courtId: bookingData.courtId,
            userId: userData.id,
            startTime: startTimeISO,
            endTime: endTimeISO,
            date: bookingData.date,
            totalHours: bookingData.duration,
            totalPrice: calculateTotalPrice(),
        };

        navigate("/booking-summary", {
            state: {
                bookingDetails: bookingDetails,
            },
        });
    };

    // Xử lý quay lại
    const handleGoBack = () => {
        navigate(-1);
    };

    // Format số tiền thành chuỗi có định dạng
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    // Format giờ HH:00 để hiển thị
    const formatTime = (time) => {
        if (!time) return "";
        return time;
    };

    // Format ngày từ chuỗi YYYY-MM-DD
    const formatDate = (dateString) => {
        if (!dateString) return "";

        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return <div className="loading-indicator">Đang tải thông tin...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button className="back-button" onClick={handleGoBack}>
                    Quay lại
                </button>
            </div>
        );
    }

    if (!courtData || !bookingData) {
        return (
            <div className="error-container">
                <div className="error-message">
                    Không tìm thấy thông tin sân hoặc đặt sân
                </div>
                <button className="back-button" onClick={handleGoBack}>
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="booking-confirmation">
            {/* Header section with title */}
            <div className="confirmation-header">
                <button className="back-button" onClick={handleGoBack}>
                    <FaChevronLeft />
                </button>
                <h1>Sân {courtData.sportsComplexModelView.type}</h1>
                <div className="price-header">
                    {formatCurrency(courtData.pricePerHour || 28000)}
                    <span className="price-unit">/giờ</span>
                </div>
            </div>

            {/* Main content container with flex layout */}
            <div className="confirm-info-container">
                {/* Left column - Contains court info and booking time stacked vertically */}
                <div className="left-column">
                    {/* Court Info Card */}
                    <div className="court-info">
                        <div className="court-image">
                            <img
                                src={
                                    courtData.imageUrls?.[0] ||
                                    "https://via.placeholder.com/150"
                                }
                                alt={courtData.name}
                            />
                        </div>
                        <div className="court-details">
                            <h2>{courtData.name || "Sân bình triều"}</h2>
                            <div className="court-location">
                                <FaMapMarkerAlt />
                                <span>
                                    {courtData.sportsComplexModelView
                                        ?.address ||
                                        "Lorem ipsum dolor sit amet consectetur. Ac."}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Time Info Section */}
                    <div className="booking-time-info">
                        <h3>Thông tin đặt sân</h3>
                        <div className="time-info">
                            <div className="info-item">
                                <div className="label">Ngày đặt sân:</div>
                                <div className="value">
                                    {formatDate(bookingData.date)}
                                </div>
                            </div>
                            <div className="time-container">
                                <div className="info-item start-time">
                                    <div className="time-label">
                                        <FaClock />
                                        <span>Giờ bắt đầu</span>
                                    </div>
                                    <div className="time-value">
                                        {formatTime(bookingData.startTime)}
                                    </div>
                                </div>
                                <div className="time-divider">
                                    <div className="divider-line"></div>
                                    <div className="divider-icon">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7.5 12L10.5 9M7.5 12L10.5 15M7.5 12H16.5"
                                                stroke="#333"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="info-item end-time">
                                    <div className="time-label">
                                        <FaClock />
                                        <span>Giờ kết thúc</span>
                                    </div>
                                    <div className="time-value">
                                        {formatTime(bookingData.endTime)}
                                    </div>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="label">Tổng thời gian:</div>
                                <div className="value">
                                    {bookingData.duration} giờ
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Continue button for small screens (hidden on larger screens) */}
                    <div className="booking-actions desktop-only">
                        <button
                            className="confirm-button"
                            onClick={handleConfirmBooking}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Tiếp tục"}
                        </button>
                    </div>
                </div>

                {/* Right column - Combined court details and price info */}
                <div className="right-column">
                    <div className="court-price-card">
                        {/* Court info section */}
                        <div className="court-info-section">
                            <div className="court-image">
                                <img
                                    src={
                                        courtData.imageUrls?.[0] ||
                                        "https://via.placeholder.com/150"
                                    }
                                    alt={courtData.name}
                                />
                            </div>
                            <div className="court-details">
                                <h2>{courtData.name || "Sân bình triều"}</h2>
                                <h4>{courtData.sportsComplexModelView.type}</h4>
                                <div className="court-rating">
                                    <div className="rating-score">
                                        {courtData.rating ||
                                            courtData.ratingSummaryModelView
                                                ?.averageRating ||
                                            "4.2"}
                                    </div>
                                    <span className="rating-text">
                                        Đặt tốt{" "}
                                        {courtData.ratingSummaryModelView
                                            ?.totalReviewerCount || 54}{" "}
                                        reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price info section (in the same card) */}
                        <div className="price-info-section">
                            <h3>Chi tiết giá</h3>
                            <div className="price-breakdown">
                                <div className="price-item">
                                    <div className="label">Tiền sân</div>
                                    <div className="value">
                                        {formatCurrency(
                                            courtData.pricePerHour || 28000
                                        )}
                                        ₫
                                    </div>
                                </div>
                                <div className="price-item">
                                    <div className="label">Số giờ</div>
                                    <div className="value">
                                        {bookingData.duration}
                                    </div>
                                </div>
                                {discount > 0 && (
                                    <div className="price-item discount">
                                        <div className="label">Khuyến mãi</div>
                                        <div className="value">
                                            -{formatCurrency(discount)}₫
                                        </div>
                                    </div>
                                )}
                                <div className="price-total">
                                    <div className="label">Tổng tiền</div>
                                    <div className="value">
                                        {formatCurrency(calculateTotalPrice())}₫
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
