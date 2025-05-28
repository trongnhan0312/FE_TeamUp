import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courtService from "../../../../services/courtService";
import "./CourtSelector.scss";

const CourtSelector = () => {
  const { coachId, type } = useParams();
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const response = await courtService.getList(page, pageSize, type);
        if (response.isSuccessed) {
          setCourts(response.resultObj.items);
          setTotalPages(response.resultObj.totalPages);
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

  const handleBooking = (courtId) => {
    navigate(`/court-schedule/${courtId}`, {
      state: { isMultiBooking: true, coachId },
    });
  };

  return (
    <div className="court-list-page">
      <h2>Danh sách sân</h2>
      {loading ? (
        <div className="loading">Đang tải sân...</div>
      ) : courts.length === 0 ? (
        <div className="no-court">Không có sân khả dụng</div>
      ) : (
        <>
          <div className="court-grid">
            {courts.map((court) => (
              <div key={court.id} className="court-card">
                <img
                  src={court.imageUrls?.[0]}
                  alt={court.name}
                  className="court-image"
                />
                <div className="court-info">
                  <div className="court-name">{court.name}</div>
                  <div className="court-price">
                    {court.pricePerHour.toLocaleString()}đ/giờ
                  </div>
                  <div className="court-description">{court.description}</div>
                  <button
                    className="book-button"
                    onClick={() => handleBooking(court.id)}
                  >
                    Chọn sân
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 1}>
              Trang trước
            </button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <button onClick={handleNext} disabled={page === totalPages}>
              Trang sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CourtSelector;
