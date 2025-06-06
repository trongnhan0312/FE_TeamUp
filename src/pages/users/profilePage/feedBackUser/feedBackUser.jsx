import React, { useEffect, useState } from "react";
import { FaFlag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./feedBackUser.scss";
import ratingService from "../../../../services/ratingService";

const FeedBackUser = ({ revieweeId }) => {
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

  // Hiển thị giá trị ưu tiên API, fallback 0
  const displayRating = reviewsData.averageRating ?? 0;
  const displayTotalReviews = reviewsData.totalReviews ?? 0;

  // Lấy danh sách đánh giá phân trang
  useEffect(() => {
    if (!revieweeId) return;

    const fetchRatingsList = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ratingService.getList(
          currentPage,
          pageSize,
          revieweeId
        );

        if (response.isSuccessed) {
          setReviewsData((prev) => ({
            ...prev,
            items: response.resultObj?.items || [],
          }));
          setTotalPages(response.resultObj?.totalPages ?? 1);
        } else {
          setError(response.message || "Không thể lấy danh sách đánh giá");
        }
      } catch {
        setError("Lỗi khi lấy danh sách đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchRatingsList();
  }, [revieweeId, currentPage]);

  // Lấy summary điểm trung bình và tổng đánh giá
  useEffect(() => {
    if (!revieweeId) return;

    const fetchRatingsSummary = async () => {
      try {
        const response = await ratingService.getAverageCount(revieweeId);
        if (response.isSuccessed) {
          setReviewsData((prev) => ({
            ...prev,
            averageRating:
              response.resultObj?.averageRating ?? prev.averageRating,
            totalReviews:
              response.resultObj?.totalReviewerCount ?? prev.totalReviews,
          }));
        }
      } catch {
        // Bỏ qua lỗi summary
      }
    };

    fetchRatingsSummary();
  }, [revieweeId]);

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Xử lý báo cáo đánh giá
  const handleReportReview = (reviewId) => {
    console.log(`Report review ${reviewId} clicked`);
    // Thêm logic báo cáo ở đây
  };

  // Tạo avatar chữ cái đầu
  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  // Tạo màu avatar dựa trên tên
  const getAvatarColor = (name) => {
    if (!name) return "#cccccc";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Định dạng ngày tháng
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
    return <div className="court-reviews loading">Đang tải đánh giá...</div>;
  }

  if (error) {
    return <div className="court-reviews error">{error}</div>;
  }

  if (reviewsData.items.length === 0) {
    return (
      <div className="court-reviews no-reviews">
        <div className="reviews-header">
          <h2 className="section-title">Đánh giá</h2>
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
        <div>Chưa có đánh giá nào.</div>
      </div>
    );
  }

  return (
    <div className="court-reviews">
      <div className="reviews-header">
        <h2 className="section-title">Đánh giá</h2>
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
          <div key={review.id || `review-${index}`} className="review-item">
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
                    {review.ratingValue?.toFixed(1) || "0.0"}
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
                    | {review.reviewer?.fullName || "Người dùng ẩn danh"}
                  </span>
                </div>

                <button
                  className="report-button"
                  onClick={() => handleReportReview(review.id)}
                  aria-label="Report review"
                >
                  <FaFlag />
                </button>
              </div>

              <p className="review-text">
                {review.comment || "Không có bình luận"}
              </p>
              <div className="review-date">{formatDate(review.createDate)}</div>
            </div>
          </div>
        ))}
      </div>

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

export default FeedBackUser;
