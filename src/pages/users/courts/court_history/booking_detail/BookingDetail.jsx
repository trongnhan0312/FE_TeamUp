import React, { useEffect, useState } from "react";
import "./style.scss";
import { useParams } from "react-router-dom";
import courtBookingService from "../../../../../services/courtBookingService";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await courtBookingService.getById(bookingId);
        if (res.isSuccessed) {
          setBooking(res.resultObj);
        }
      } catch (err) {
        console.error("Error fetching booking detail:", err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <div className="booking-detail">Đang tải...</div>;

  const {
    court,
    user,
    startTime,
    endTime,
    totalPrice,
    status,
    paymentStatus,
    paymentMethod,
    discountAmount,
  } = booking;

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (time) => new Date(time).toLocaleDateString("vi-VN");

  return (
    <div className="booking-detail">
      <h2>Chi tiết đơn đặt sân #{booking.id}</h2>

      <div className="detail-grid">
        <div className="images">
          {court.imageUrls.map((url, i) => (
            <img key={i} src={url.replace("u0026", "&")} alt={`court-${i}`} />
          ))}
        </div>

        <div className="info">
          <h3>{court.name}</h3>
          <p>
            <strong>Mô tả:</strong> {court.description}
          </p>
          <p>
            <strong>Giờ:</strong> {formatTime(startTime)} -{" "}
            {formatTime(endTime)}
          </p>
          <p>
            <strong>Ngày:</strong> {formatDate(startTime)}
          </p>
          <p>
            <strong>Giá mỗi giờ:</strong>{" "}
            {court.pricePerHour.toLocaleString("vi-VN")} VND
          </p>
          <p>
            <strong>Tổng giá:</strong> {totalPrice.toLocaleString("vi-VN")} VND
          </p>
          <p>
            <strong>Giảm giá:</strong>{" "}
            {discountAmount?.toLocaleString("vi-VN") || 0} VND
          </p>
          <p>
            <strong>Thanh toán:</strong> {paymentStatus} ({paymentMethod})
          </p>
          <p>
            <strong>Trạng thái đơn:</strong> {status}
          </p>

          <hr />

          <h4>Khu thể thao</h4>
          <p>
            <strong>Tên:</strong> {court.sportsComplexModelView.name}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {court.sportsComplexModelView.address}
          </p>
          <p>
            <strong>Loại:</strong> {court.sportsComplexModelView.type}
          </p>

          <hr />

          <h4>Người đặt</h4>
          <p>
            <strong>Họ tên:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
