import React, { useEffect, useState, useMemo } from "react";
import {
    FaMapMarkerAlt,
    FaHeart,
    FaShare,
    FaStar,
    FaStarHalfAlt,
} from "react-icons/fa";
import "./CourtDetailPage.scss";
import { memo } from "react";
import AvailableCourts from "./AvailableCourts";
import CourtReviews from "./CourtReviews";
import SimilarCourts from "./SimilarCourts.js";
import courtService from "../../../../services/courtService.js";
import { useParams } from "react-router-dom";
import { formatPrice } from "../../../../utils/formatUtils.js";

const CourtDetailPage = () => {
    const { courtId } = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [court, setCourt] = useState(null);
    const [sportId, setSportId] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch court details
    useEffect(() => {
        const fetchCourtDetails = async () => {
            if (!courtId) return;

            try {
                setLoading(true);
                const data = await courtService.getById(courtId);

                if (!data.isSuccessed) {
                    throw new Error(
                        data.message || "Không thể tải thông tin sân"
                    );
                }

                setCourt(data.resultObj);
                setSportId(data.resultObj.sportsComplexModelView?.id);
                setOwnerId(data.resultObj.sportsComplexModelView?.owner?.id);
            } catch (err) {
                console.error("Error fetching court details:", err);
                setError(err.message || "Không thể lấy thông tin sân");
            } finally {
                setLoading(false);
            }
        };

        fetchCourtDetails();
    }, [courtId]);

    // Helper function to render rating stars
    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FaStar key={i} className="star filled" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="star filled" />);
            } else {
                stars.push(<FaStar key={i} className="star" />);
            }
        }
        return stars;
    };

    // Get rating text based on rating value
    const getRatingText = (rating) => {
        if (rating >= 4.5) return "Tuyệt vời";
        if (rating >= 4.0) return "Rất tốt";
        if (rating >= 3.5) return "Tốt";
        if (rating >= 3.0) return "Khá";
        return "Trung bình";
    };

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
        <div className="court-detail-page">
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
                    <div className="rating-badge">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="rating-text">
                        {getRatingText(averageRating)} | {totalReviewerCount}{" "}
                        đánh giá
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
                            <div
                                className="gallery-item"
                                key={`gallery-${index}`}
                            >
                                <img
                                    src={image}
                                    alt={`${court.name} - Hình ảnh ${
                                        index + 1
                                    }`}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                    <button className="btn-view-more">Xem thêm</button>
                </div>

                {/* Price section */}
                <div className="price-section">
                    <div className="price">
                        <span className="amount">
                            {formatPrice(court.pricePerHour)}
                        </span>
                        <span className="unit">/giờ</span>
                    </div>
                    <div className="booking-actions">
                        <button className="btn-book">Đặt sân</button>
                        <button className="btn-create-room">Tạo phòng</button>
                    </div>
                </div>

                {/* Court Description */}
                <div className="court-description">
                    <h2>Mô tả</h2>
                    <div className="description-content">
                        <p>{court.name}:</p>
                        <ul>
                            <li>
                                Địa chỉ: {court.sportsComplexModelView.address}
                            </li>
                            <li>
                                Giá thuê: {formatPrice(court.pricePerHour)}/giờ.
                            </li>
                            <li>Giờ hoạt động: 5h – 23h.</li>
                        </ul>
                    </div>
                </div>

                {/* Available Courts Section */}
                <AvailableCourts sportId={sportId} currentCourtId={courtId} />

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
