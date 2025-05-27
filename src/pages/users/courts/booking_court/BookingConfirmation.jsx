// BookingConfirmation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import courtService from "../../../../services/courtService";
import { getUserInfo } from "../../../../utils/auth";
import "./BookingConfirmation.scss";
import VoucherSelector from "../../voucher/VoucherSelector";

const BookingConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [courtData, setCourtData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedVoucher, setSelectedVoucher] = useState(null);

    const userData = getUserInfo();
    const bookingData = location.state?.bookingData;

    useEffect(() => {
        if (!bookingData) {
            setError("Không tìm thấy thông tin đặt sân");
            setLoading(false);
            return;
        }

        const fetchCourt = async () => {
            try {
                const courtRes = await courtService.getById(bookingData.courtId);

                if (courtRes.isSuccessed) setCourtData(courtRes.resultObj);
                else setError("Không thể lấy thông tin sân");
            } catch (err) {
                setError("Lỗi khi tải dữ liệu");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourt();
    }, [bookingData]);

    const discount = selectedVoucher
        ? Math.floor(
              (courtData.pricePerHour * bookingData.duration * selectedVoucher.discountPercent) / 100
          )
        : 0;

    const calculateTotalPrice = () => {
        const pricePerHour = courtData.pricePerHour || 0;
        const totalHours = bookingData.duration || 0;
        const subtotal = pricePerHour * totalHours;
        return subtotal - discount;
    };

    const handleConfirmBooking = () => {
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
            voucherId: selectedVoucher?.id || null,
        };

        navigate("/booking-summary", { state: { bookingDetails } });
    };

    const handleGoBack = () => navigate(-1);

    const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount);
    const formatTime = (time) => time || "";
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    if (loading) return <div className="loading-indicator">Đang tải thông tin...</div>;

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button className="back-button" onClick={handleGoBack}>Quay lại</button>
            </div>
        );
    }

    return (
        <div className="booking-confirmation">
            <div className="confirmation-header">
                <button className="back-button" onClick={handleGoBack}><FaChevronLeft /></button>
                <h1>Sân {courtData.sportsComplexModelView.type}</h1>
                <div className="price-header">
                    {formatCurrency(courtData.pricePerHour)}<span className="price-unit">/giờ</span>
                </div>
            </div>

            <div className="confirm-info-container">
                <div className="left-column">
                    <div className="court-info">
                        <div className="court-image">
                            <img src={courtData.imageUrls?.[0] || "https://via.placeholder.com/150"} alt={courtData.name} />
                        </div>
                        <div className="court-details">
                            <h2>{courtData.name}</h2>
                            <div className="court-location">
                                <FaMapMarkerAlt />
                                <span>{courtData.sportsComplexModelView.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="booking-time-info">
                        <h3>Thông tin đặt sân</h3>
                        <div className="time-info">
                            <div className="info-item"><div className="label">Ngày đặt sân:</div><div className="value">{formatDate(bookingData.date)}</div></div>
                            <div className="time-container">
                                <div className="info-item start-time">
                                    <div className="time-label"><FaClock /><span>Giờ bắt đầu</span></div>
                                    <div className="time-value">{formatTime(bookingData.startTime)}</div>
                                </div>
                                <div className="time-divider"><div className="divider-line"></div></div>
                                <div className="info-item end-time">
                                    <div className="time-label"><FaClock /><span>Giờ kết thúc</span></div>
                                    <div className="time-value">{formatTime(bookingData.endTime)}</div>
                                </div>
                            </div>
                            <div className="info-item"><div className="label">Tổng thời gian:</div><div className="value">{bookingData.duration} giờ</div></div>
                        </div>

                        <VoucherSelector
                            totalAmount={courtData.pricePerHour * bookingData.duration}
                            onSelectVoucher={setSelectedVoucher}
                        />

                        <div className="booking-actions desktop-only">
                            <button className="confirm-button" onClick={handleConfirmBooking} disabled={loading}>
                                {loading ? "Đang xử lý..." : "Tiếp tục"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="court-price-card">
                        <div className="court-info-section">
                            <div className="court-image">
                                <img src={courtData.imageUrls?.[0] || "https://via.placeholder.com/150"} alt={courtData.name} />
                            </div>
                            <div className="court-details">
                                <h2>{courtData.name}</h2>
                                <h4>{courtData.sportsComplexModelView.type}</h4>
                                <div className="court-rating">
                                    <div className="rating-score">{courtData.rating || courtData.ratingSummaryModelView?.averageRating || "4.2"}</div>
                                    <span className="rating-text">Đặt tốt {courtData.ratingSummaryModelView?.totalReviewerCount || 54} reviews</span>
                                </div>
                            </div>
                        </div>

                        <div className="price-info-section">
                            <h3>Chi tiết giá</h3>
                            <div className="price-breakdown">
                                <div className="price-item"><div className="label">Tiền sân</div><div className="value">{formatCurrency(courtData.pricePerHour)}₫</div></div>
                                <div className="price-item"><div className="label">Số giờ</div><div className="value">{bookingData.duration}</div></div>
                                {discount > 0 && (
                                    <div className="price-item discount"><div className="label">Khuyến mãi</div><div className="value">-{formatCurrency(discount)}₫</div></div>
                                )}
                                <div className="price-total"><div className="label">Tổng tiền</div><div className="value">{formatCurrency(calculateTotalPrice())}₫</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;