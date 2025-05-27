import React, { useState, useEffect } from "react";
import "./CourtSelector.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import courtService from "../../../services/courtService";

const CourtSelector = ({ selectedCourt, onSelectCourt, pageSize = 4 }) => {
  const [courts, setCourts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const data = await courtService.getList(page, pageSize);
        if (data.isSuccessed) {
          setCourts(data.resultObj.items);
          setTotalPages(data.resultObj.totalPages);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="court-selector">
      <h4>Chọn sân</h4>
      {loading ? (
        <div className="loading">Đang tải danh sách sân...</div>
      ) : courts.length === 0 ? (
        <div className="no-court">Không có sân khả dụng</div>
      ) : (
        <div className="carousel-wrapper">
          <button className="arrow-button left" onClick={handlePrev} disabled={page === 1}>
            <FaChevronLeft />
          </button>
          <div className="court-carousel">
            {courts.map((court) => (
              <div
                key={court.id}
                className={`court-card ${selectedCourt?.id === court.id ? "selected" : ""}`}
                onClick={() => onSelectCourt(court)}
              >
                <img src={court.imageUrls?.[0]} alt={court.name} className="court-image" />
                <div className="court-info">
                  <div className="court-name">{court.name}</div>
                  <div className="court-price">{court.pricePerHour.toLocaleString()}đ/giờ</div>
                  <div className="court-description">{court.description}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="arrow-button right" onClick={handleNext} disabled={page === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default CourtSelector;
