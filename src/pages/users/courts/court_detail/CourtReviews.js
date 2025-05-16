import React from "react";
import { FaStar, FaFlag } from "react-icons/fa";
import "./CourtReviews.scss";

const CourtReviews = ({ reviews, rating, totalReviews }) => {
    // Dữ liệu mẫu nếu không có props
    const defaultRating = rating || 4.2;
    const defaultTotalReviews = totalReviews || 371;

    const defaultReviews = reviews || [
        {
            id: 1,
            author: "Paula",
            rating: 5.0,
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            date: new Date("2023-10-15"),
        },
        {
            id: 2,
            author: "Cristofer Ekstrom Bothman",
            rating: 5.0,
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            date: new Date("2023-10-10"),
        },
        {
            id: 3,
            author: "Johnson, White and Lang",
            rating: 5.0,
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            date: new Date("2023-10-05"),
        },
        {
            id: 4,
            author: "Erin Septimus",
            rating: 5.0,
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            date: new Date("2023-09-28"),
        },
        {
            id: 5,
            author: "Terry George",
            rating: 5.0,
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            date: new Date("2023-09-20"),
        },
    ];

    // Hàm xử lý khi nhấn nút viết đánh giá
    const handleWriteReview = () => {
        console.log("Write review button clicked");
        // Thêm logic mở modal hoặc chuyển đến trang đánh giá ở đây
    };

    // Hàm xử lý khi nhấn nút report đánh giá
    const handleReportReview = (reviewId) => {
        console.log(`Report review ${reviewId} clicked`);
        // Thêm logic báo cáo đánh giá ở đây
    };

    // Hàm để hiển thị avatar từ tên người dùng
    const getInitials = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase();
    };

    // Hàm tạo màu ngẫu nhiên cho avatar dựa trên tên
    const getAvatarColor = (name) => {
        if (!name) return "#cccccc";

        // Tạo màu dựa trên tên người dùng
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 70%, 80%)`;
    };

    return (
        <div className="court-reviews">
            <div className="reviews-header">
                <h2 className="section-title">Đánh giá</h2>
                <button
                    className="write-review-button"
                    onClick={handleWriteReview}
                >
                    Viết đánh giá
                </button>
            </div>

            <div className="rating-summary">
                <div className="rating-score">
                    <span className="score">{defaultRating}</span>
                    <div className="rating-details">
                        <span className="rating-text">Rất tốt</span>
                        <span className="review-count">
                            {defaultTotalReviews} người dùng đã đánh giá
                        </span>
                    </div>
                </div>
            </div>

            <div className="reviews-list">
                {defaultReviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <div
                            className="review-avatar"
                            style={{
                                backgroundColor: getAvatarColor(review.author),
                            }}
                        >
                            {getInitials(review.author)}
                        </div>

                        <div className="review-content">
                            <div className="review-header">
                                <div className="review-rating">
                                    <span className="rating-value">
                                        {review.rating.toFixed(1)} Amazing
                                    </span>
                                    <span className="review-author">
                                        | {review.author}
                                    </span>
                                </div>

                                <button
                                    className="report-button"
                                    onClick={() =>
                                        handleReportReview(review.id)
                                    }
                                    aria-label="Report review"
                                >
                                    <FaFlag />
                                </button>
                            </div>

                            <p className="review-text">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourtReviews;
