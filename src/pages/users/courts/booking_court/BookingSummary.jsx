import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./BookingSummary.scss";
import courtService from "../../../../services/courtService";
import coachBookingService from "../../../../services/coachBookingService";
import { getRatingText } from "../../../../utils/formatUtils";
import { FaChevronLeft } from "react-icons/fa";
import { getUserInfo } from "../../../../utils/auth";

const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận các giá trị đã truyền từ Confirmation Page
  const {
    bookingDetails,
    totalPriceFromConfirmation,
    selectedVoucherFromConfirmation,
  } = location.state || {};

  const [courtData, setCourtData] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Destructure bookingDetails để dễ sử dụng hơn
  const {
    courtId,
    userId,
    playerId,
    coachId,
    startTime,
    endTime,
    date,
    slots,
    totalHours,
    voucherId,
    isMultiBooking,
  } = bookingDetails || {};

  useEffect(() => {
    if (!bookingDetails) {
      setError("Không tìm thấy thông tin đặt sân");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const promises = [];

        if (courtId) {
          promises.push(courtService.getById(courtId));
        }

        if (isMultiBooking && coachId) {
          promises.push(coachBookingService.getCoachById(coachId));
        }

        const results = await Promise.all(promises);

        let courtRes = null;
        let coachRes = null;

        let resultIndex = 0;
        if (courtId) {
          courtRes = results[resultIndex++];
        }

        if (isMultiBooking && coachId) {
          coachRes = results[resultIndex++];
        }

        if (courtRes) {
          if (courtRes?.isSuccessed) {
            setCourtData(courtRes.resultObj);
          } else {
            throw new Error(courtRes?.message || "Không thể lấy thông tin sân");
          }
        }

        if (coachRes) {
          if (coachRes) {
            setCoachData(coachRes);
          } else {
            throw new Error("Không thể lấy thông tin huấn luyện viên");
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingDetails, courtId, isMultiBooking, coachId]);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return "0";
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatTimeDisplay = (isoTime) => {
    if (!isoTime) return "";
    try {
      const timePart = isoTime.split("T")[1];
      if (timePart) {
        return timePart.substring(0, 5);
      }
    } catch (e) {
      console.error("Error formatting time for display:", e, isoTime);
    }
    return isoTime;
  };

  // Tính toán lại tiền sân và tiền huấn luyện viên cho hiển thị
  const courtRentalPrice = courtData
    ? courtData.pricePerHour * (totalHours || 0)
    : 0;
  const coachFee =
    isMultiBooking && coachData && slots
      ? coachData.pricePerSession * slots.length
      : 0;

  // Tính toán khuyến mãi dựa trên voucher được truyền từ Confirmation
  const discountAmount = selectedVoucherFromConfirmation
    ? Math.floor(
        ((courtRentalPrice + coachFee) *
          selectedVoucherFromConfirmation.discountPercent) /
          100
      )
    : 0;

  // Tổng tiền cuối cùng để hiển thị và gửi đi, ƯU TIÊN lấy từ Confirmation
  const finalDisplayTotalPrice =
    totalPriceFromConfirmation !== undefined
      ? totalPriceFromConfirmation
      : Math.max(0, courtRentalPrice + coachFee - discountAmount); // Fallback calculation

  const formatDateForApi = (dateString) => {
    if (!dateString) {
      console.error("formatDateForApi: dateString is null or undefined");
      return null;
    }

    try {
      let date;
      if (typeof dateString === "string") {
        if (dateString.includes("T")) {
          date = new Date(dateString);
        } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateString)) {
          date = new Date(dateString.replace(" ", "T"));
        } else {
          date = new Date(dateString);
        }
      } else if (dateString instanceof Date) {
        date = dateString;
      } else {
        throw new Error("Invalid date format");
      }

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (err) {
      console.error("Lỗi định dạng ngày:", err, "Input:", dateString);
      throw new Error(`Không thể định dạng thời gian: ${dateString}`);
    }
  };

  const userInfo = getUserInfo();

  const handleConfirmBooking = async () => {
    if (!bookingDetails) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy thông tin đặt lịch",
        icon: "error",
        confirmButtonText: "Đóng",
      });
      return;
    }

    try {
      setLoading(true);

      // CASE 1: COACH BOOKING
      if (isMultiBooking) {
        console.log("Processing coach booking...");

        const currentUserId = playerId || userInfo?.id || userId;
        console.log("Current User ID Coach:", currentUserId);
        if (!currentUserId) {
          throw new Error("Không thể xác định User ID để đặt lịch.");
        }

        if (!coachId || !courtId || !currentUserId) {
          throw new Error("Thiếu thông tin bắt buộc để đặt huấn luyện viên");
        }

        if (!slots || slots.length === 0) {
          throw new Error("Thiếu thông tin khung giờ");
        }

        const formattedSlots = slots.map((slot, index) => {
          const formattedStartTime = formatDateForApi(slot.startTime);
          const formattedEndTime = formatDateForApi(slot.endTime);

          if (!formattedStartTime || !formattedEndTime) {
            throw new Error(`Khung giờ ${index + 1} có thời gian không hợp lệ`);
          }
          return { startTime: formattedStartTime, endTime: formattedEndTime };
        });

        // TẠO REQUEST BODY DỰA TRÊN ĐỊNH NGHĨA API BẠN ĐÃ CUNG CẤP
        const coachBookingRequest = {
          coachId: Number(coachId),
          playerId: Number(currentUserId),
          courtId: Number(courtId),
          slots: formattedSlots,
          paymentMethod: "Pending", // Sẽ được xử lý bởi VNPay sau
        };

        if (voucherId && voucherId > 0) {
          coachBookingRequest.voucherId = Number(voucherId);
        }

        console.log(
          "Submitting coach booking with parameters (no totalPrice in payload):",
          coachBookingRequest
        );

        // Gọi hàm service với các tham số riêng lẻ, không phải object
        const coachBookingResponse = await coachBookingService.create(
          coachBookingRequest.coachId,
          coachBookingRequest.playerId,
          coachBookingRequest.courtId,
          coachBookingRequest.slots,
          coachBookingRequest.paymentMethod,
          coachBookingRequest.voucherId // voucherId có thể là undefined/null nếu không có
        );

        if (coachBookingResponse?.isSuccessed) {
          console.log("Coach booking successful, getting latest booking ID...");

          const latestCoachBookingId =
            await coachBookingService.getLatestCoachBookingId(playerId);
          console.log("Latest Coach Booking ID:", latestCoachBookingId);
          if (!latestCoachBookingId) {
            throw new Error("Không thể lấy thông tin booking vừa tạo");
          }

          console.log("Creating VNPay URL for coach booking...");

          const vnpayUrl = await coachBookingService.createVnpayUrl({
            userId: Number(currentUserId),
            coachBookingId: Number(latestCoachBookingId),
            courtBookingId: null,
            packageId: null,
          });
          console.log("VNPay URL created:", vnpayUrl);
          if (vnpayUrl) {
            Swal.fire({
              title: "Thành công!",
              text: "Đặt huấn luyện viên thành công. Chuyển đến trang thanh toán.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = vnpayUrl;
            });
          } else {
            throw new Error("Không thể tạo link thanh toán");
          }
        } else {
          throw new Error(
            coachBookingResponse?.message || "Không thể đặt huấn luyện viên"
          );
        }
      }
      // CASE 2: COURT BOOKING
      else {
        console.log("Processing court booking...");

        const currentUserId = userId || userInfo?.id;
        console.log("Current User ID:", currentUserId);
        if (!currentUserId) {
          throw new Error("Không thể xác định User ID để đặt lịch.");
        }

        if (!courtId || !currentUserId) {
          throw new Error("Thiếu thông tin cần thiết để đặt sân");
        }

        if (!startTime || !endTime) {
          throw new Error("Thiếu thông tin thời gian đặt sân");
        }

        // TẠO REQUEST BODY CHO COURT BOOKING (cũng không bao gồm totalPrice nếu backend tự tính)
        const courtBookingRequest = {
          courtId: Number(courtId),
          userId: Number(currentUserId),
          startTime: formatDateForApi(startTime),
          endTime: formatDateForApi(endTime),
          paymentMethod: "Pending", // Sẽ được xử lý bởi VNPay sau
        };

        if (voucherId && voucherId > 0) {
          courtBookingRequest.voucherId = Number(voucherId);
        }

        console.log(
          "Submitting court booking with data (no totalPrice in payload):",
          courtBookingRequest
        );

        // Giả sử courtService.createCourtBooking cũng nhận object tương tự và không cần totalPrice trực tiếp
        // Nếu courtService.createCourtBooking cũng có signature như coachBookingService.create,
        // bạn cũng sẽ phải gọi nó với các tham số riêng lẻ.
        // TẠM THỜI GIỮ NGUYÊN GỌI VỚI OBJECT NẾU BẠN CHƯA CUNG CẤP HÀM `createCourtBooking` CỦA `courtService`
        const response = await courtService.handleBooking(courtBookingRequest);
        console.log("Court booking response:", response);
        if (response?.isSuccessed) {
          console.log("Court booking successful, creating payment URL...");

          if (userId && userId > 0) {
            console.log("User ID is valid:", userId);
          }

          const latestCourtBookingId = await courtService.getLatestBookingId(
            userId
          );
          console.log("Latest Court Booking ID:", latestCourtBookingId);
          const vnpayUrl = await courtService.createVnpayUrl({
            userId: Number(currentUserId),
            courtBookingId: Number(latestCourtBookingId),
            coachBookingId: null,
            packageId: null,
          });

          if (vnpayUrl) {
            Swal.fire({
              title: "Thành công!",
              text: "Đặt sân thành công. Chuyển đến trang thanh toán.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = vnpayUrl;
            });
          } else {
            throw new Error("Không thể tạo link thanh toán");
          }
        } else {
          throw new Error(response?.message || "Không thể đặt sân");
        }
      }
    } catch (err) {
      console.error("Lỗi đặt lịch:", err);

      Swal.fire({
        title: "Thất bại!",
        text: err.message || "Đã xảy ra lỗi trong quá trình đặt lịch",
        icon: "error",
        confirmButtonText: "Đóng",
      });

      setError(err.message || "Đã xảy ra lỗi trong quá trình đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="booking-summary">
        <div className="go-back-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaChevronLeft />
          </button>
          <h1>Xác nhận đặt lịch</h1>
        </div>
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <div>Đang tải thông tin...</div>
        </div>
      </div>
    );
  }

  if (error && !courtData && !coachData) {
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
      <div className="go-back-header">
        <button className="back-button" onClick={handleGoBack}>
          <FaChevronLeft />
        </button>
        <h1>Xác nhận đặt lịch</h1>
      </div>

      {courtData && (
        <>
          <div className="court-header">
            <img
              src={
                courtData?.imageUrls?.[0] || "https://via.placeholder.com/150"
              }
              alt={courtData?.name || "Sân cầu lông"}
              className="court-image"
            />
            <div className="court-info">
              <div className="court-name-container">
                <div className="court-venue">{courtData?.name}</div>
                <h1 className="court-type">
                  Sân {courtData?.sportsComplexModelView?.type || ""}
                </h1>
              </div>
              <div className="court-rating">
                <div className="rating-score">
                  {courtData?.ratingSummaryModelView?.averageRating?.toFixed(
                    1
                  ) || "4.2"}
                </div>
                <div className="rating-text">
                  {getRatingText(
                    courtData?.ratingSummaryModelView?.averageRating
                  )}{" "}
                  |{" "}
                  {courtData?.ratingSummaryModelView?.totalReviewerCount || 54}{" "}
                  reviews
                </div>
              </div>
            </div>
          </div>
          <div className="separator" />
        </>
      )}

      {isMultiBooking && coachData && (
        <div className="coach-details-section">
          <h2>Thông tin huấn luyện viên</h2>
          <div className="coach-info-row">
            <div className="coach-label">Tên huấn luyện viên:</div>
            <div className="coach-value">{coachData.fullName}</div>
          </div>
          <div className="coach-info-row">
            <div className="coach-label">Chuyên môn:</div>
            <div className="coach-value">{coachData.specialty}</div>
          </div>
          <div className="coach-info-row">
            <div className="coach-label">Giá mỗi buổi:</div>
            <div className="coach-value">
              {formatCurrency(coachData.pricePerSession)} VNĐ
            </div>
          </div>
          <div className="separator" />
        </div>
      )}

      <div className="price-details">
        <h2>Chi tiết giá</h2>

        {courtData && (
          <>
            <div className="price-row">
              <div className="price-label">Tiền sân</div>
              <div className="price-value">
                {formatCurrency(courtRentalPrice)} VNĐ
              </div>
            </div>

            <div className="price-row">
              <div className="price-label">Số giờ</div>
              <div className="price-value">{totalHours || 1}</div>
            </div>
          </>
        )}

        {isMultiBooking && slots && coachData && (
          <div className="price-row">
            <div className="price-label">Tiền huấn luyện viên</div>
            <div className="price-value">{formatCurrency(coachFee)} VNĐ</div>
          </div>
        )}

        {selectedVoucherFromConfirmation && (
          <div className="price-row discount">
            <div className="price-label">Khuyến mãi</div>
            <div className="price-value">
              -{formatCurrency(discountAmount)} VNĐ
            </div>
          </div>
        )}

        <div className="separator" />

        <div className="price-row total">
          <div className="price-label">Tổng tiền</div>
          <div className="price-value">
            {formatCurrency(finalDisplayTotalPrice)} VNĐ
          </div>
        </div>
      </div>

      <div className="payment-options">
        <h3>Phương thức thanh toán</h3>
        <div className="payment-method">Thanh toán qua VNPay</div>
        <p className="note">
          Sau khi xác nhận đặt lịch, bạn sẽ được chuyển hướng đến trang thanh
          toán của VNPay.
        </p>
      </div>

      <div className="booking-actions">
        <button
          className="confirm-button"
          onClick={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Xác nhận và Thanh toán"}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
