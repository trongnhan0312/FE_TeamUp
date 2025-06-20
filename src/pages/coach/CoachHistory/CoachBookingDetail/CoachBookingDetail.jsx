import React, { useEffect, useState } from "react";
import "./style.scss";
import { useParams } from "react-router-dom";
import coachBookingService from "../../../../services/coachBookingService";

const CoachBookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await coachBookingService.getById(bookingId);
        if (res.isSuccessed) {
          setBooking(res.resultObj);
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn huấn luyện:", err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <div className="coach-booking-detail">Đang tải...</div>;

  const {
    coach,
    player,
    court,
    slots,
    totalPrice,
    status,
    paymentStatus,
    paymentMethod,
    note,
    discountAmount,
    voucher,
  } = booking;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

  const formatTime = (timeStr) =>
    new Date(timeStr).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatSlotTimes = () => {
    return slots
      .map(
        (slot) =>
          `${formatDate(slot.startTime)}: ${formatTime(
            slot.startTime
          )} - ${formatTime(slot.endTime)}`
      )
      .join("\n");
  };

  return (
    <div className="coach-booking-detail">
      <h2>Chi tiết đơn đặt huấn luyện #{booking.id}</h2>

      <div className="detail-grid">
        <div className="images">
          {court?.imageUrls?.map((url, i) => (
            <img key={i} src={url.replace("u0026", "&")} alt={`court-${i}`} />
          ))}
        </div>

        <div className="info">
          <h3>{coach.fullName}</h3>
          <p>
            <strong>Chuyên môn:</strong> {coach.specialty}
          </p>
          <p>
            <strong>Kinh nghiệm:</strong> {coach.experience}
          </p>
          <p>
            <strong>Chứng chỉ:</strong> {coach.certificate}
          </p>

          <hr />

          <p>
            <strong>Ngày - giờ huấn luyện:</strong>
          </p>
          <p style={{ whiteSpace: "pre-line" }}>{formatSlotTimes()}</p>

          <p>
            <strong>Sân:</strong> {court?.name || "N/A"}
          </p>
          <p>
            <strong>Địa chỉ:</strong>{" "}
            {court?.sportsComplexModelView?.address || "Không rõ"}
          </p>

          <p>
            <strong>Giá gốc:</strong>{" "}
            {(totalPrice + (discountAmount || 0)).toLocaleString("vi-VN")} VND
          </p>
          <p>
            <strong>Giảm giá:</strong>{" "}
            {discountAmount?.toLocaleString("vi-VN") || 0} VND
          </p>
          <p>
            <strong>Thanh toán:</strong> {paymentStatus} ({paymentMethod})
          </p>
          <p>
            <strong>Trạng thái:</strong> {status}
          </p>
          <p>
            <strong>Ghi chú:</strong> {note || "Không có"}
          </p>

          {voucher && (
            <p>
              <strong>Voucher:</strong> {voucher.code} - {voucher.description}
            </p>
          )}

          <hr />

          <h4>Người đặt</h4>
          <p>
            <strong>Họ tên:</strong> {player.fullName}
          </p>
          <p>
            <strong>Email:</strong> {player.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoachBookingDetail;
