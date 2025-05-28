import React, { useEffect, useState } from "react";
import { FaStar, FaFlag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CourtReviews.scss";
import ratingService from "../../../../../../services/ratingService.js";

const CourtReviews = ({ rating = 0, totalReviews = 0, revieweeId }) => {
    const [reviewsData, setReviewsData] = useState({
        items: [],
        totalReviews: 0,
        averageRating: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sử dụng giá trị từ props hoặc từ API
    const displayRating = reviewsData.averageRating || rating || 0;
    const displayTotalReviews = reviewsData.totalReviews || totalReviews || 0;

    useEffect(() => {
        const fetchRatings = async () => {
            if (!revieweeId) return;

            try {
                setLoading(true);
                const response = await ratingService.getList(
                    currentPage,
                    pageSize,
                    revieweeId
                );

                if (response.isSuccessed) {
                    // Cập nhật state với dữ liệu từ API
                    const items = response.resultObj?.items || [];

                    setReviewsData({
                        items: items,
                        totalReviews:
                            response.resultObj?.totalCount || totalReviews || 0,
                        averageRating:
                            response.resultObj?.averageRating || rating || 0,
                    });

                    setTotalPages(response.resultObj?.totalPages || 1);
                } else {
                    setError(
                        response.message || "Không thể lấy danh sách đánh giá"
                    );
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đánh giá:", error);
                setError("Đã xảy ra lỗi khi tải dữ liệu đánh giá");
            } finally {
                setLoading(false);
            }
        };

        if (revieweeId) {
            fetchRatings();
        }
    }, [revieweeId, currentPage, pageSize, rating, totalReviews]);

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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

    // Định dạng thời gian
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="court-reviews loading">Đang tải đánh giá...</div>
        );
    }

    if (error) {
        return <div className="court-reviews error">{error}</div>;
    }

    // Hiển thị thông báo nếu không có đánh giá
    if (reviewsData.items.length === 0) {
        return (
            <div className="court-reviews">
                <div className="reviews-header">
                    <h2 className="section-title">Đánh giá</h2>
                    {/* <button
                        className="write-review-button"
                        onClick={handleWriteReview}
                    >
                        Viết đánh giá
                    </button> */}
                </div>
                <div className="rating-summary">
                    <div className="rating-score">
                        <span className="score">
                            {displayRating.toFixed(1)}
                        </span>
                        <div className="rating-details">
                            <span className="rating-text">
                                {displayRating >= 4.5
                                    ? "Tuyệt vời"
                                    : displayRating >= 4.0
                                    ? "Rất tốt"
                                    : displayRating >= 3.5
                                    ? "Tốt"
                                    : displayRating >= 3.0
                                    ? "Khá"
                                    : "Trung bình"}
                            </span>
                            <span className="review-count">
                                {displayTotalReviews} người dùng đã đánh giá
                            </span>
                        </div>
                    </div>
                </div>
                <div className="no-reviews">
                    Chưa có đánh giá nào cho sân này.
                </div>
            </div>
        );
    }

    return (
        <div className="court-reviews">
            <div className="reviews-header">
                <h2 className="section-title">Đánh giá</h2>
                {/* <button
                    className="write-review-button"
                    onClick={handleWriteReview}
                >
                    Viết đánh giá
                </button> */}
            </div>

            <div className="rating-summary">
                <div className="rating-score">
                    <span className="score">{displayRating.toFixed(1)}</span>
                    <div className="rating-details">
                        <span className="rating-text">
                            {displayRating >= 4.5
                                ? "Tuyệt vời"
                                : displayRating >= 4.0
                                ? "Rất tốt"
                                : displayRating >= 3.5
                                ? "Tốt"
                                : displayRating >= 3.0
                                ? "Khá"
                                : "Trung bình"}
                        </span>
                        <span className="review-count">
                            {displayTotalReviews} người dùng đã đánh giá
                        </span>
                    </div>
                </div>
            </div>

            <div className="reviews-list">
                {reviewsData.items.map((review, index) => (
                    <div
                        key={review.id || `review-${index}`}
                        className="review-item"
                    >
                        <div
                            className="review-avatar"
                            style={{
                                backgroundColor: getAvatarColor(
                                    review.reviewer?.fullName || ""
                                ),
                            }}
                        >
                            {getInitials(review.reviewer?.fullName || "")}
                        </div>

                        <div className="review-content">
                            <div className="review-header">
                                <div className="review-rating">
                                    <span className="rating-value">
                                        {review.ratingValue?.toFixed(1) ||
                                            "0.0"}
                                        {review.ratingValue >= 4.5
                                            ? " Tuyệt vời"
                                            : review.ratingValue >= 4.0
                                            ? " Rất tốt"
                                            : review.ratingValue >= 3.5
                                            ? " Tốt"
                                            : review.ratingValue >= 3.0
                                            ? " Khá"
                                            : " Trung bình"}
                                    </span>
                                    <span className="review-author">
                                        |{" "}
                                        {review.reviewer?.fullName ||
                                            "Người dùng ẩn danh"}
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

                            <p className="review-text">
                                {review.comment || "Không có bình luận"}
                            </p>
                            <div className="review-date">
                                {formatDate(review.createDate)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang - đã cập nhật để giống SimilarCourts */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-button prev"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <FaChevronLeft />
                    </button>

                    <div className="page-info">
                        {currentPage} of {totalPages}
                    </div>

                    <button
                        className="pagination-button next"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourtReviews;
