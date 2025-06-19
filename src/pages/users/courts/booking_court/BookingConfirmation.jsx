import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import courtService from "../../../../services/courtService";
import coachBookingService from "../../../../services/coachBookingService"; // Import service for coach
import { getUserInfo } from "../../../../utils/auth";
import "./BookingConfirmation.scss";
import VoucherSelector from "../../voucher/VoucherSelector";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [note, setNote] = useState(""); // phần ghi chú người dùng nhập

  const [courtData, setCourtData] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const userData = getUserInfo();
  const { bookingData, isMultiBooking } = location.state;

  useEffect(() => {
    if (!bookingData) {
      setError("Không tìm thấy thông tin đặt sân");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const promises = [courtService.getById(bookingData.courtId)];

        if (isMultiBooking && bookingData.coachId) {
          promises.push(coachBookingService.getCoachById(bookingData.coachId));
        }

        const results = await Promise.all(promises);

        const courtRes = results[0];
        if (courtRes.isSuccessed) {
          setCourtData(courtRes.resultObj);
        } else {
          throw new Error("Không thể lấy thông tin sân");
        }

        if (isMultiBooking && bookingData.coachId && results[1]) {
          const coachRes = results[1];
          if (coachRes) {
            setCoachData(coachRes);
          } else {
            throw new Error("Không thể lấy thông tin huấn luyện viên");
          }
        }
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingData, isMultiBooking]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount);
  const formatTime = (time) => time || "";
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const totalDuration = isMultiBooking
    ? bookingData.totalDuration
    : bookingData.duration;

  const calculateBaseAmount = () => {
    const pricePerHour = courtData?.pricePerHour || 0;
    let base = pricePerHour * totalDuration;

    if (isMultiBooking && coachData && bookingData.bookings) {
      const coachPricePerSession = coachData.pricePerSession || 0;
      base += coachPricePerSession * bookingData.bookings.length;
    }
    return base;
  };

  const discount = selectedVoucher
    ? Math.floor(
        (calculateBaseAmount() * selectedVoucher.discountPercent) / 100
      )
    : 0;

  const calculateTotalPrice = () => {
    const baseAmount = calculateBaseAmount();
    return Math.max(0, baseAmount - discount);
  };

  const handleConfirmBooking = () => {
    setLoading(true);

    const formatLocalDateTime = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      // SỬA ĐỔI ĐỂ TRẢ VỀ ĐỊNH DẠNG ISO 8601 VỚI 'T'
      return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };

    const finalTotalPrice = calculateTotalPrice(); // Lấy giá trị tổng tiền đã tính toán

    if (isMultiBooking) {
      const slots = bookingData.bookings.map((item) => {
        const start = new Date(`${item.date}T${item.startTime}:00`);
        const end = new Date(`${item.date}T${item.endTime}:00`);

        return {
          startTime: formatLocalDateTime(start),
          endTime: formatLocalDateTime(end),
        };
      });

      const bookingDetailsToSend = {
        courtId: bookingData.courtId,
        playerId: userData.id,
        coachId: bookingData.coachId,
        slots,
        totalHours: totalDuration,
        voucherId: selectedVoucher?.id || null,
        isMultiBooking,
        note,
      };

      navigate("/booking-summary", {
        state: {
          bookingDetails: bookingDetailsToSend,
          totalPriceFromConfirmation: finalTotalPrice, // TRUYỀN TỔNG TIỀN
          selectedVoucherFromConfirmation: selectedVoucher, // TRUYỀN VOUCHER ĐÃ CHỌN
          noteFromConfirmation: note,
        },
      });
    } else {
      const dateStr = bookingData.date;
      const startTimeISO = `${dateStr}T${bookingData.startTime}:00`;
      const endTimeISO = `${dateStr}T${bookingData.endTime}:00`;

      const bookingDetailsToSend = {
        courtId: bookingData.courtId,
        userId: userData.id,
        startTime: startTimeISO,
        endTime: endTimeISO,
        date: bookingData.date,
        totalHours: totalDuration,
        voucherId: selectedVoucher?.id || null,
        isMultiBooking,
        note,
      };
      console.log("Dữ liệu gửi đi (multi):", {
        bookingDetails: bookingDetailsToSend,
        totalPrice: finalTotalPrice,
        voucher: selectedVoucher,
        note,
      });

      navigate("/booking-summary", {
        state: {
          bookingDetails: bookingDetailsToSend,
          totalPriceFromConfirmation: finalTotalPrice, // TRUYỀN TỔNG TIỀN
          selectedVoucherFromConfirmation: selectedVoucher, // TRUYỀN VOUCHER ĐÃ CHỌN
          noteFromConfirmation: note, // TRUYỀN GHI CHÚ
        },
      });
    }
  };

  const handleGoBack = () => navigate(-1);

  if (loading)
    return <div className="loading-indicator">Đang tải thông tin...</div>;

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

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <button className="back-button" onClick={handleGoBack}>
          <FaChevronLeft />
        </button>
        <h1>Sân {courtData.sportsComplexModelView.type}</h1>
        <div className="price-header">
          {formatCurrency(courtData.pricePerHour)}
          <span className="price-unit">/giờ</span>
        </div>
      </div>

      <div className="confirm-info-container">
        <div className="left-column">
          <div className="court-info">
            <div className="court-image">
              <img
                src={
                  courtData.imageUrls?.[0] || "https://via.placeholder.com/150"
                }
                alt={courtData.name}
              />
            </div>
            <div className="court-details">
              <h2>{courtData.name}</h2>
              <div className="court-location">
                <FaMapMarkerAlt />
                <span>{courtData.sportsComplexModelView.address}</span>
              </div>
            </div>
          </div>

          {isMultiBooking && coachData && (
            <div className="coach-booking-info">
              <h3>Thông tin huấn luyện viên</h3>
              <div className="info-item">
                <div className="label">Tên huấn luyện viên:</div>
                <div className="value">{coachData.fullName}</div>
              </div>
              <div className="info-item">
                <div className="label">Chuyên môn:</div>
                <div className="value">{coachData.specialty}</div>
              </div>
              <div className="info-item">
                <div className="label">Giá mỗi buổi:</div>
                <div className="value">
                  {formatCurrency(coachData.pricePerSession)}₫
                </div>
              </div>
              <hr />
            </div>
          )}

          <div className="booking-time-info">
            <h3>Thông tin đặt sân</h3>

            {isMultiBooking ? (
              bookingData.bookings.map((item, index) => (
                <div key={index} className="multi-booking-item">
                  <div className="info-item">
                    <div className="label">Ngày đặt sân:</div>
                    <div className="value">{formatDate(item.date)}</div>
                  </div>
                  <div className="time-container">
                    <div className="info-item start-time">
                      <div className="time-label">
                        <FaClock />
                        <span>Giờ bắt đầu</span>
                      </div>
                      <div className="time-value">
                        {formatTime(item.startTime)}
                      </div>
                    </div>
                    <div className="time-divider">
                      <div className="divider-line"></div>
                    </div>
                    <div className="info-item end-time">
                      <div className="time-label">
                        <FaClock />
                        <span>Giờ kết thúc</span>
                      </div>
                      <div className="time-value">
                        {formatTime(item.endTime)}
                      </div>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="label">Thời lượng:</div>
                    <div className="value">{item.duration} giờ</div>
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <>
                <div className="info-item">
                  <div className="label">Ngày đặt sân:</div>
                  <div className="value">{formatDate(bookingData.date)}</div>
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
                  <div className="value">{bookingData.duration} giờ</div>
                </div>
              </>
            )}

            <VoucherSelector
              totalAmount={calculateBaseAmount()}
              onSelectVoucher={setSelectedVoucher}
            />

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
        </div>

        <div className="right-column">
          <div className="court-price-card">
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
                <h2>{courtData.name}</h2>
                <h4>{courtData.sportsComplexModelView.type}</h4>
                <div className="court-rating">
                  <div className="rating-score">
                    {courtData.rating ||
                      courtData.ratingSummaryModelView?.averageRating ||
                      "4.2"}
                  </div>
                  <span className="rating-text">
                    Đặt tốt{" "}
                    {courtData.ratingSummaryModelView?.totalReviewerCount || 54}{" "}
                    reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="price-info-section">
              <h3>Chi tiết giá</h3>
              <div className="price-breakdown">
                <div className="price-item">
                  <div className="label">Tiền sân</div>
                  <div className="value">
                    {formatCurrency(courtData.pricePerHour * totalDuration)}₫
                  </div>
                </div>
                {isMultiBooking && coachData && bookingData.bookings && (
                  <div className="price-item">
                    <div className="label">Tiền huấn luyện viên</div>
                    <div className="value">
                      {formatCurrency(
                        coachData.pricePerSession * bookingData.bookings.length
                      )}
                      ₫
                    </div>
                  </div>
                )}
                <div className="price-item">
                  <div className="label">Tổng thời lượng</div>
                  <div className="value">{totalDuration} giờ</div>
                </div>
                {discount > 0 && (
                  <div className="price-item discount">
                    <div className="label">Khuyến mãi</div>
                    <div className="value">-{formatCurrency(discount)}₫</div>
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
          <div className="note-section">
            <h3>Ghi chú thêm</h3>
            <textarea
              className="note-input"
              rows="3"
              placeholder="Nhập ghi chú nếu có (VD: yêu cầu sân có mái che...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
