import React, { useState, useEffect } from "react";
import "./AvailableCourts.scss";
import courtService from "../../../../services/courtService.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { formatPrice } from "../../../../utils/formatUtils.js";
import { useNavigate } from "react-router-dom";

const AvailableCourts = ({ sportId, currentCourtId }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAvailableCourts = async () => {
      if (!sportId) return;
      console.log("SportId", sportId);
      try {
        setLoading(true);
        const response = await courtService.getList(
          pageNumber,
          pageSize,
          "",
          sportId
        );
        console.log("SportData", response);

        if (response.isSuccessed) {
          // Lọc ra để không hiển thị sân hiện tại
          const filteredCourts = (response.resultObj?.items || []).filter(
            (court) => court.id !== currentCourtId
          );

          setCourts(filteredCourts);
          setTotalPages(response.resultObj?.totalPages || 1);
        } else {
          setError(response.message || "Không thể lấy danh sách sân");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sân:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    if (sportId) {
      fetchAvailableCourts();
    }
  }, [sportId, pageNumber, pageSize, currentCourtId]);

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  // Hàm xử lý khi nhấn nút đặt ngay
  const handleBooking = (courtId) => {
    console.log(`Đặt sân có ID: ${courtId}`);
    // Thêm logic xử lý đặt sân ở đây
    window.scrollTo(0, 0); // Cuộn lên đầu trang
    navigate(`/courts/${courtId}`);
  };

  if (loading) {
    return <div className="available-courts loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="available-courts error">{error}</div>;
  }

  if (courts.length === 0) {
    return null; // Không hiển thị gì nếu không có sân khả dụng
  }

  return (
    <div className="available-courts">
      <h2 className="section-title">Sân khả dụng</h2>

      <div className="courts-list">
        {courts.map((court) => (
          <div key={court.id} className="court-item">
            <div className="court-info">
              <div className="court-thumbnail">
                <img
                  src={court.imageUrls?.[0] || court.image}
                  alt={court.name}
                />
              </div>
              <div className="court-name">{court.name}</div>
            </div>

            <div className="court-price">
              <span className="price-amount">
                {formatPrice(court.pricePerHour || court.price)}
                VNĐ
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

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button prev"
            disabled={pageNumber <= 1}
            onClick={() => handlePageChange(pageNumber - 1)}
          >
            <FaChevronLeft />
          </button>

          <span className="pagination-info">
            Trang {pageNumber} / {totalPages}
          </span>

          <button
            className="pagination-button next"
            disabled={pageNumber >= totalPages}
            onClick={() => handlePageChange(pageNumber + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableCourts;
