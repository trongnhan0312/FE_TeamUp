import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./BookingSummary.scss";
import courtService from "../../../../services/courtService";
import { getRatingText } from "../../../../utils/formatUtils";
import Swal from "sweetalert2";

const BookingSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [courtData, setCourtData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Nhận dữ liệu từ courtSchedule
    const bookingData = location.state?.bookingDetails || {
        courtId: 1,
        date: "2025-05-18",
        startTime: "8:00",
        endTime: "10:00",
        duration: 2,
    };

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
                    // Fallback data for demonstration
                    setCourtData({
                        name: "Sân bình triều",
                        imageUrls: ["https://via.placeholder.com/150"],
                        pricePerHour: 28000,
                        ratingSummaryModelView: {
                            averageRating: 4.2,
                            totalReviewerCount: 54,
                        },
                    });
                }
            } catch (err) {
                console.error("Lỗi khi gọi API:", err);
                setError("Đã xảy ra lỗi khi tải thông tin sân");
                // Fallback data for demonstration
                setCourtData({
                    name: "Sân bình triều",
                    imageUrls: ["https://via.placeholder.com/150"],
                    pricePerHour: 28000,
                    ratingSummaryModelView: {
                        averageRating: 4.2,
                        totalReviewerCount: 54,
                    },
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCourtData();
    }, [bookingData]);

    // Tính tổng tiền
    const calculateTotalPrice = () => {
        if (!courtData) return 46000; // Fallback for demonstration

        const pricePerHour = courtData.pricePerHour || 28000;
        const totalHours = bookingData.totalHours || 2;
        const subtotal = pricePerHour * totalHours;

        return subtotal;
    };

    // Xử lý xác nhận đặt sân
    const handleConfirmBooking = async () => {
        try {
            if (!bookingData || !bookingData.courtId) {
                setError("Không tìm thấy thông tin sân. Vui lòng thử lại.");
                return;
            }

            if (!bookingData || !bookingData.userId) {
                setError(
                    "Không tìm thấy thông tin người dùng. Vui lòng thử lại."
                );
                return;
            }

            setLoading(true);

            const bookingRequest = {
                courtId: Number(bookingData.courtId),
                userId: Number(bookingData.userId),
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                paymentMethod: "Pending",
            };

            console.log("Booking request being sent:", bookingRequest);

            const data = await courtService.handleBooking(bookingRequest);

            if (data.isSuccessed) {
                Swal.fire({
                    title: "Thành công!",
                    text: "Đặt sân thành công",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/home");
                });
            } else {
                setError(data.message || "Không thể tạo booking");
                console.error("API error:", data.message);
            }
        } catch (err) {
            console.error("Booking error details:", err);

            if (err.errors) {
                const errorMessages = [];
                for (const key in err.errors) {
                    errorMessages.push(`${key}: ${err.errors[key].join(", ")}`);
                }
                setError(`Lỗi dữ liệu: ${errorMessages.join("; ")}`);
            } else {
                setError(
                    err.message || "Đã xảy ra lỗi trong quá trình đặt sân"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // Format số tiền thành chuỗi có định dạng
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    if (loading) {
        return <div className="loading-indicator">Đang tải thông tin...</div>;
    }

    if (error && !courtData) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button className="back-button" onClick={() => navigate(-1)}>
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="booking-summary">
            {/* Court Header with Image and Information */}
            <div className="court-header">
                <img
                    src={
                        courtData?.imageUrls?.[0] ||
                        "https://via.placeholder.com/150"
                    }
                    alt={courtData?.name || "Sân cầu lông"}
                    className="court-image"
                />
                <div className="court-info">
                    <div className="court-name-container">
                        <div className="court-venue">
                            {courtData?.name || "Sân bình triều"}
                        </div>
                        <h1 className="court-type">
                            Sân {courtData.sportsComplexModelView.type}
                        </h1>
                    </div>
                    <div className="court-rating">
                        <div className="rating-score">
                            {courtData?.ratingSummaryModelView?.averageRating.toFixed(
                                1
                            ) || 4.2}
                        </div>
                        <div className="rating-text">
                            {getRatingText(
                                courtData?.ratingSummaryModelView?.averageRating
                            )}{" "}
                            |{" "}
                            {courtData?.ratingSummaryModelView
                                ?.totalReviewerCount || 54}{" "}
                            reviews
                        </div>
                    </div>
                </div>
            </div>

            <div className="separator" />

            {/* Price Details */}
            <div className="price-details">
                <h2 className="section-title">Chi tiết giá</h2>

                <div className="price-row">
                    <div className="price-label">Tiền sân</div>
                    <div className="price-value">
                        {formatCurrency(courtData?.pricePerHour || 28000)}VNĐ
                    </div>
                </div>

                <div className="price-row">
                    <div className="price-label">Số giờ</div>
                    <div className="price-value">
                        {bookingData.totalHours || 2}
                    </div>
                </div>

                <div className="separator" />

                <div className="price-row total">
                    <div className="price-label">Tổng tiền</div>
                    <div className="price-value">
                        {formatCurrency(calculateTotalPrice())}VNĐ
                    </div>
                </div>
            </div>

            {/* Confirm Button */}
            <button className="confirm-button" onClick={handleConfirmBooking}>
                Thanh toán
            </button>
        </div>
    );
};

export default BookingSummary;
