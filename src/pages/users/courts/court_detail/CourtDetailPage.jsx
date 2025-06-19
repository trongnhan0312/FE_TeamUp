import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaShare,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import "./CourtDetailPage.scss";
import { memo } from "react";
import AvailableCourts from "./AvailableCourts.jsx";
import CourtReviews from "./CourtReviews.jsx";
import SimilarCourts from "./SimilarCourts.jsx";
import courtService from "../../../../services/courtService.js";
import { useNavigate, useParams } from "react-router-dom";
import {
  formatPrice,
  getRatingText,
  renderRatingStars,
} from "../../../../utils/formatUtils.js";
import Map from "../../../../component/map/index.jsx";

const CourtDetailPage = () => {
  const { courtId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [court, setCourt] = useState(null);
  const [sportId, setSportId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (!courtId) return;
    navigate(`/court-schedule/${courtId}`, {
      state: { isMultiBooking: false },
    });
  };

  // Fetch court details
  useEffect(() => {
    const fetchCourtDetails = async () => {
      if (!courtId) return;

      try {
        setLoading(true);
        const data = await courtService.getById(courtId);

        if (!data.isSuccessed) {
          throw new Error(data.message || "Không thể tải thông tin sân");
        }

        const courtInfo = data.resultObj;
        const owner = courtInfo.sportsComplexModelView?.owner;

        setCourt(courtInfo);
        setSportId(courtInfo.sportsComplexModelView?.id);
        setOwnerId(owner?.id); // Vẫn set để sử dụng sau này nếu cần

        console.log("ownerID:", owner?.id);

        // ✅ Gọi countViews trực tiếp với owner.id lấy từ dữ liệu vừa fetch
        if (owner?.id) {
          try {
            await courtService.countViews(owner.id);
            console.log("View count increased successfully!");
          } catch (viewErr) {
            console.error("Lỗi khi tăng lượt xem:", viewErr);
          }
        }
      } catch (err) {
        console.error("Error fetching court details:", err);
        setError(err.message || "Không thể lấy thông tin sân");
      } finally {
        setLoading(false);
      }
    };

    fetchCourtDetails();
  }, [courtId]);

  // Loading state
  if (loading) {
    return <div className="loading">Đang tải thông tin sân...</div>;
  }

  // Error state
  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  // No data state
  if (!court) {
    return <div className="not-found">Không tìm thấy thông tin sân</div>;
  }

  // Extract rating data for easier access
  const { averageRating, totalReviewerCount } =
    court.ratingSummaryModelView || {
      averageRating: 0,
      totalReviewerCount: 0,
    };

  return (
    <div className="court-detail-page-user">
      <div className="container">
        {/* Court title and rating section */}
        <div className="court-header">
          <h1 className="court-title">{court.name}</h1>
          <div className="rating-container">
            {renderRatingStars(averageRating)}
          </div>
        </div>

        {/* Court address */}
        <div className="court-address">
          <FaMapMarkerAlt className="icon-marker" />
          <span>{court.sportsComplexModelView.address}</span>
        </div>

        {/* Rating score */}
        <div className="rating-score-section">
          <div className="rating-badge">{averageRating.toFixed(1)}</div>
          <div className="rating-text">
            {getRatingText(averageRating)} | {totalReviewerCount} đánh giá
          </div>

          <div className="action-buttons">
            <button
              className={`btn-like ${isLiked ? "liked" : ""}`}
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? "Bỏ thích" : "Thích"}
            >
              <FaHeart />
            </button>
            <button className="btn-share" aria-label="Chia sẻ">
              <FaShare />
            </button>
          </div>
        </div>
        {/* Price section */}
        <div className="price-section">
          <div className="price">
            <span className="amount" style={{ fontSize: "40px" }}>
              {formatPrice(court.pricePerHour)}
            </span>
            <span className="unit">/giờ</span>
          </div>
          <div className="booking-actions">
            <button className="btn-book" onClick={handleBookingClick}>
              Đặt sân
            </button>
            {/* <button className="btn-create-room">Tạo phòng</button> */}
          </div>
        </div>
        {/* Court Images Gallery */}
        <div className="court-gallery">
          <div className="main-image">
            <img
              src={court.imageUrls[0]}
              alt={`${court.name} - Hình ảnh chính`}
              loading="lazy"
            />
          </div>
          <div className="gallery-grid">
            {court.imageUrls.slice(1, 5).map((image, index) => (
              <div className="gallery-item" key={`gallery-${index}`}>
                <img
                  src={image}
                  alt={`${court.name} - Hình ảnh ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <button className="btn-view-more">Xem thêm</button>
        </div>

        {/* Court Description */}
        <div className="court-description">
          <h2>Mô tả</h2>
          <div className="description-content">
            <strong style={{ fontSize: "20px" }}>
              <p>{court.name}:</p>

              <ul>
                <li>
                  <FaMapMarkerAlt
                    style={{ color: "#4caf50", marginRight: "8px" }}
                  />
                  Địa chỉ: {court.sportsComplexModelView.address}
                </li>
                <li>
                  <FaMoneyBillWave
                    style={{ color: "#ff9800", marginRight: "8px" }}
                  />
                  Giá thuê: {formatPrice(court.pricePerHour)}/giờ.
                </li>
                <li>
                  <FaClock style={{ color: "#2196f3", marginRight: "8px" }} />
                  Giờ hoạt động: 5h – 23h.
                </li>
              </ul>
            </strong>
          </div>
        </div>

        {/* Available Courts Section */}
        <AvailableCourts sportId={sportId} currentCourtId={courtId} />

        {/* Map */}
        <Map
          coordinate={{
            latitude: court.sportsComplexModelView.latitude,
            longitude: court.sportsComplexModelView.longitude,
          }}
          address={court.sportsComplexModelView.address}
        />

        {/* Reviews Section */}
        <CourtReviews
          rating={averageRating}
          totalReviews={totalReviewerCount}
          revieweeId={ownerId} // Chuyển ownerId sang courtId
        />

        {/* Similar Courts Section */}
        <div className="similar-courts-section">
          <h2 className="section-title">Các sân tương tự</h2>
          <SimilarCourts />
        </div>
      </div>
    </div>
  );
};

export default memo(CourtDetailPage);
