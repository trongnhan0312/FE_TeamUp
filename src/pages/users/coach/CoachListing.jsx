import React, { useState, useEffect, memo } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCertificate,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import "./CoachListing.scss";
import loginImg from "../../../assets/user/login.png";
import coachService from "../../../services/coachService";
import { formatPrice } from "../../../utils/formatUtils";

// Định nghĩa type thể thao
const SPORT_TYPES = {
  SOCCER: "Bóng đá",
  BADMINTON: "Cầu lông",
  PICKLEBALL: "Pickleball",
};

const URL_TO_TYPE = {
  football: SPORT_TYPES.SOCCER,
  badminton: SPORT_TYPES.BADMINTON,
  pickleball: SPORT_TYPES.PICKLEBALL,
};

const TYPE_TO_URL = {
  [SPORT_TYPES.SOCCER]: "football",
  [SPORT_TYPES.BADMINTON]: "badminton",
  [SPORT_TYPES.PICKLEBALL]: "pickleball",
};

const TAB_COLORS = {
  [SPORT_TYPES.PICKLEBALL]: "#FFFFFF",
  [SPORT_TYPES.SOCCER]: "#1F1F1F",
  [SPORT_TYPES.BADMINTON]: "#b8e01a",
};

const TAB_TEXT_COLORS = {
  [SPORT_TYPES.PICKLEBALL]: "#000000",
  [SPORT_TYPES.SOCCER]: "#FFFFFF",
  [SPORT_TYPES.BADMINTON]: "#000000",
};

const TAB_ACTIVE_COLORS = {
  [SPORT_TYPES.PICKLEBALL]: "#Ffffff",
  [SPORT_TYPES.SOCCER]: "#1F1F1F",
  [SPORT_TYPES.BADMINTON]: "#b8e01a",
};

const CoachListing = () => {
  const navigate = useNavigate();
  const { type: urlType } = useParams();
  const initialType = urlType
    ? URL_TO_TYPE[urlType] || SPORT_TYPES.SOCCER
    : null;

  const [coachType, setCoachType] = useState(initialType);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  const handleTypeChange = (newType) => {
    if (newType !== coachType) {
      setCoachType(newType);
      setCurrentPage(1);
      if (newType === null) {
        navigate(`/coaches`);
      } else {
        navigate(`/coaches/${TYPE_TO_URL[newType]}`);
      }
    }
  };

  useEffect(() => {
    if (urlType && URL_TO_TYPE[urlType] && URL_TO_TYPE[urlType] !== coachType) {
      setCoachType(URL_TO_TYPE[urlType]);
      setCurrentPage(1);
    }
  }, [urlType]);

  // Fetch danh sách huấn luyện viên
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;
        if (!coachType) {
          data = await coachService.getCoachesPagination(
            "",
            currentPage,
            pageSize
          );
        } else {
          data = await coachService.getCoachesPagination(
            coachType,
            currentPage,
            pageSize
          );
        }

        if (data.isSuccessed) {
          setCoaches(data.resultObj.items || []);
          setTotalPages(data.resultObj.totalPages || 1);
        } else {
          setError(data.message || "Không thể lấy dữ liệu huấn luyện viên");
          setCoaches([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách huấn luyện viên:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        setCoaches([]);
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [coachType, currentPage]);

  // Fetch đánh giá cho từng huấn luyện viên
  useEffect(() => {
    const fetchRatings = async () => {
      const updated = await Promise.all(
        coaches.map(async (coach) => {
          try {
            const res = await coachService.getRatingAvarage(coach.id);
            const rating = res.isSuccessed
              ? parseFloat(res.resultObj?.averageRating || 0).toFixed(1)
              : "0.0";
            const totalReviews = res.resultObj?.totalReviewerCount || 0;

            return {
              ...coach,
              rating,
              totalReviews,
            };
          } catch {
            return {
              ...coach,
              rating: "0.0",
              totalReviews: 0,
            };
          }
        })
      );
      setCoaches(updated);
    };

    if (coaches.length > 0) {
      fetchRatings();
    }
  }, [coaches]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCoachClick = (coachId) => {
    navigate(`/coaches/profile/${coachId}`);
  };

  const isActiveType = (type) => coachType === type;

  const getAvatarStyle = () => ({ borderColor: "#FFD700" });

  return (
    <div className="coach-listing">
      <div className="container">
        <div className="sport-tabs">
          <button
            className={`tab pickleball-tab ${
              isActiveType(SPORT_TYPES.PICKLEBALL) ? "active" : ""
            }`}
            onClick={() => handleTypeChange(SPORT_TYPES.PICKLEBALL)}
            style={{
              backgroundColor: isActiveType(SPORT_TYPES.PICKLEBALL)
                ? TAB_ACTIVE_COLORS[SPORT_TYPES.PICKLEBALL]
                : TAB_COLORS[SPORT_TYPES.PICKLEBALL],
              color: TAB_TEXT_COLORS[SPORT_TYPES.PICKLEBALL],
            }}
          >
            Pickleball
          </button>
          <button
            className={`tab soccer-tab ${
              isActiveType(SPORT_TYPES.SOCCER) ? "active" : ""
            }`}
            onClick={() => handleTypeChange(SPORT_TYPES.SOCCER)}
            style={{
              backgroundColor: TAB_COLORS[SPORT_TYPES.SOCCER],
              color: TAB_TEXT_COLORS[SPORT_TYPES.SOCCER],
            }}
          >
            Bóng đá
          </button>
          <button
            className={`tab badminton-tab ${
              isActiveType(SPORT_TYPES.BADMINTON) ? "active" : ""
            }`}
            onClick={() => handleTypeChange(SPORT_TYPES.BADMINTON)}
            style={{
              backgroundColor: TAB_COLORS[SPORT_TYPES.BADMINTON],
              color: TAB_TEXT_COLORS[SPORT_TYPES.BADMINTON],
            }}
          >
            Cầu lông
          </button>
        </div>

        <div className="coaches-container">
          {loading && <div className="loading-state">Đang tải dữ liệu...</div>}
          {!loading && error && <div className="error-state">{error}</div>}
          {!loading && !error && coaches.length === 0 && (
            <div className="empty-state">
              Không tìm thấy huấn luyện viên nào
            </div>
          )}

          {!loading && !error && coaches.length > 0 && (
            <div className="coaches-grid">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className="coach-card"
                  onClick={() => handleCoachClick(coach.id)}
                >
                  <div className="coach-avatar-container">
                    <div className="coach-avatar" style={getAvatarStyle()}>
                      {coach.avatarUrl ? (
                        <img
                          src={coach.avatarUrl}
                          alt={coach.fullName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = loginImg;
                          }}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {coach.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="coach-info">
                    <h3 className="coach-name">{coach.fullName}</h3>
                    <div className="coach-rating">
                      <span className="rating-text">{coach.specialty}</span>
                      <div className="rating-stars">
                        <FaStar className="star-icon" />
                        <span>
                          {coach.rating ?? "0.0"} ({coach.totalReviews ?? 0}{" "}
                          đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="coach-details">
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <span>{coach.workingDate}</span>
                    </div>
                    <div className="detail-item">
                      <FaCertificate className="detail-icon" />
                      <span>{coach.certificate}</span>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span>{coach.workingAddress}</span>
                    </div>
                    <div className="detail-item price">
                      <FaMoneyBillWave className="detail-icon" />
                      <span>{formatPrice(coach.pricePerSession)} VNĐ/Buổi</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trang trước
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`page-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                className="pagination-button"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CoachListing);
