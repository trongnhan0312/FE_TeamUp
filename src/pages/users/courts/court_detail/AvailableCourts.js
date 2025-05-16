import React from "react";
import "./AvailableCourts.scss";

const AvailableCourts = ({ courts }) => {
    const defaultCourts = [
        { id: 1, name: "Sân cầu lông", price: 20000 },
        { id: 2, name: "Sân cầu lông", price: 20000 },
        { id: 3, name: "Sân cầu lông", price: 20000 },
    ];

    const courtsToRender = courts || defaultCourts;

    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    // Hàm xử lý khi nhấn nút đặt ngay
    const handleBooking = (courtId) => {
        console.log(`Đặt sân có ID: ${courtId}`);
        // Thêm logic xử lý đặt sân ở đây
    };

    return (
        <div className="available-courts">
            <h2 className="section-title">Sân khả dụng</h2>

            <div className="courts-list">
                {courtsToRender.map((court) => (
                    <div key={court.id} className="court-item">
                        <div className="court-info">
                            <div className="court-thumbnail">
                                <img
                                    src={court.image}
                                    alt="Sân cầu lông Tre Xanh"
                                />
                            </div>
                            <div className="court-name">{court.name}</div>
                        </div>

                        <div className="court-price">
                            <span className="price-amount">
                                {formatPrice(court.price)}VNĐ
                            </span>
                            <span className="price-unit">/giờ</span>
                        </div>

                        <button
                            className="booking-button"
                            onClick={() => handleBooking(court.id)}
                        >
                            Đặt ngay
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableCourts;
