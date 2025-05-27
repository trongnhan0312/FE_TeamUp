import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./BookingSummary.scss";
import courtService from "../../../../services/courtService";
import voucherService from "../../../../services/voucherService";
import { getRatingText } from "../../../../utils/formatUtils";

const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courtData, setCourtData] = useState(null);
  const [voucherData, setVoucherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bookingData = location.state?.bookingDetails || {
    courtId: 1,
    date: "2025-05-18",
    startTime: "8:00",
    endTime: "10:00",
    totalHours: 2,
    userId: null,
    voucherId: null,
  };

  useEffect(() => {
    if (!bookingData) {
      setError("Không tìm thấy thông tin đặt sân");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [courtRes, voucherRes] = await Promise.all([
          courtService.getById(bookingData.courtId),
          bookingData.voucherId ? voucherService.getVoucherById(bookingData.voucherId) : null,
        ]);

        if (courtRes.isSuccessed) {
          setCourtData(courtRes.resultObj);
        } else {
          throw new Error("Không thể lấy thông tin sân");
        }

        if (voucherRes?.isSuccessed) {
          setVoucherData(voucherRes.resultObj);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingData]);

  const calculateDiscount = () => {
    if (!courtData || !voucherData) return 0;
    const subtotal = courtData.pricePerHour * bookingData.totalHours;
    return Math.floor((subtotal * voucherData.discountPercent) / 100);
  };

  const calculateTotalPrice = () => {
    if (!courtData) return 0;
    const subtotal = courtData.pricePerHour * bookingData.totalHours;
    return subtotal - calculateDiscount();
  };

  const handleConfirmBooking = async () => {
    try {
      if (!bookingData?.courtId || !bookingData?.userId) {
        setError("Thiếu thông tin cần thiết để đặt sân.");
        return;
      }

      setLoading(true);

      const bookingRequest = {
        courtId: Number(bookingData.courtId),
        userId: Number(bookingData.userId),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        paymentMethod: "Pending",
        voucherId: bookingData.voucherId || null,
      };

      console.log(bookingRequest);
      

      const data = await courtService.handleBooking(bookingRequest);

      if (data.isSuccessed) {
        Swal.fire({
          title: "Thành công!",
          text: "Đặt sân thành công",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate("/home"));
      } else {
        setError(data.message || "Không thể tạo booking");
      }
    } catch (err) {
      console.error("Lỗi đặt sân:", err);
      setError(err.message || "Đã xảy ra lỗi trong quá trình đặt sân");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount);

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
      <div className="court-header">
        <img
          src={courtData?.imageUrls?.[0] || "https://via.placeholder.com/150"}
          alt={courtData?.name || "Sân cầu lông"}
          className="court-image"
        />
        <div className="court-info">
          <div className="court-name-container">
            <div className="court-venue">{courtData?.name}</div>
            <h1 className="court-type">Sân {courtData.sportsComplexModelView?.type}</h1>
          </div>
          <div className="court-rating">
            <div className="rating-score">
              {courtData?.ratingSummaryModelView?.averageRating?.toFixed(1) || 4.2}
            </div>
            <div className="rating-text">
              {getRatingText(courtData?.ratingSummaryModelView?.averageRating)} |{" "}
              {courtData?.ratingSummaryModelView?.totalReviewerCount || 54} reviews
            </div>
          </div>
        </div>
      </div>

      <div className="separator" />

      <div className="price-details">
        <h2 className="section-title">Chi tiết giá</h2>

        <div className="price-row">
          <div className="price-label">Tiền sân</div>
          <div className="price-value">
            {formatCurrency(courtData?.pricePerHour)} VNĐ
          </div>
        </div>

        <div className="price-row">
          <div className="price-label">Số giờ</div>
          <div className="price-value">{bookingData.totalHours}</div>
        </div>

        {voucherData && (
          <div className="price-row discount">
            <div className="price-label">Khuyến mãi</div>
            <div className="price-value">-{formatCurrency(calculateDiscount())} VNĐ</div>
          </div>
        )}

        <div className="separator" />

        <div className="price-row total">
          <div className="price-label">Tổng tiền</div>
          <div className="price-value">{formatCurrency(calculateTotalPrice())} VNĐ</div>
        </div>
      </div>

      <button className="confirm-button" onClick={handleConfirmBooking} disabled={loading}>
        {loading ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </div>
  );
};

export default BookingSummary;
