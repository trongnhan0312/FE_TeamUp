import { memo, useState, useEffect } from "react";
import "./style.scss";
import coachService from "../../../services/coachService";

const ReviewCoach = ({ revieweeId = 1 }) => {
    const [filter, setFilter] = useState("Mới nhất");
    const [searchValue, setSearchValue] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState(new Set());
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 5,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // Hàm format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year}, ${hours}:${minutes} ${
            hours >= 12 ? "PM" : "AM"
        }`;
    };

    // Hàm lấy dữ liệu đánh giá từ API
    const fetchReviews = async (pageNumber = 1, searchTerm = "") => {
        try {
            setLoading(true);
            const response = await coachService.getCoachRatings(
                10,
                pageNumber,
                pagination.pageSize
            );

            if (response.isSuccessed) {
                // Transform data từ API response thành format phù hợp với UI
                const transformedReviews = response.resultObj.items.map(
                    (item) => ({
                        id: `#R${String(item.id).padStart(5, "0")}`,
                        rawId: item.id,
                        name: item.reviewer.fullName,
                        email: item.reviewer.email,
                        date: formatDate(new Date()), // Sử dụng thời gian hiện tại vì API không có createdDate
                        content: item.comment,
                        rating: item.ratingValue,
                        avatarUrl: item.reviewer.avatarUrl,
                        reviewerId: item.reviewer.id,
                        revieweeId: item.reviewee.id,
                    })
                );

                // Lọc theo search nếu có
                const filteredReviews = searchTerm
                    ? transformedReviews.filter(
                          (review) =>
                              review.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                              review.content
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                              review.id
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                      )
                    : transformedReviews;

                // Sắp xếp theo filter
                const sortedReviews = sortReviews(filteredReviews, filter);

                setReviews(sortedReviews);
                setPagination({
                    currentPage: response.resultObj.currentPage,
                    totalPages: response.resultObj.totalPages,
                    totalItems: response.resultObj.totalItems,
                    pageSize: response.resultObj.pageSize,
                    hasNextPage: response.resultObj.hasNextPage,
                    hasPreviousPage: response.resultObj.hasPreviousPage,
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm sắp xếp reviews theo filter
    const sortReviews = (reviewsArray, sortType) => {
        const sorted = [...reviewsArray];
        switch (sortType) {
            case "Mới nhất":
                return sorted.sort((a, b) => b.rawId - a.rawId);
            case "Cũ nhất":
                return sorted.sort((a, b) => a.rawId - b.rawId);
            case "Xác nhận":
                return sorted.filter((review) => review.rating >= 4);
            default:
                return sorted;
        }
    };

    // Load data khi component mount
    useEffect(() => {
        fetchReviews();
    }, [revieweeId]);

    // Xử lý khi thay đổi filter
    useEffect(() => {
        if (reviews.length > 0) {
            const sortedReviews = sortReviews(reviews, filter);
            setReviews(sortedReviews);
        }
    }, [filter]);

    // Xử lý search với debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchReviews(1, searchValue);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue]);

    // Xử lý checkbox
    const handleCheckboxChange = (reviewId) => {
        const newSelected = new Set(selectedReviews);
        if (newSelected.has(reviewId)) {
            newSelected.delete(reviewId);
        } else {
            newSelected.add(reviewId);
        }
        setSelectedReviews(newSelected);
    };

    // Xử lý select all
    const handleSelectAll = () => {
        if (selectedReviews.size === reviews.length) {
            setSelectedReviews(new Set());
        } else {
            setSelectedReviews(new Set(reviews.map((review) => review.rawId)));
        }
    };

    // Render stars với rating thực tế
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={`star ${i < Math.floor(rating) ? "filled" : ""}`}
            >
                ★
            </span>
        ));
    };

    // Xử lý phân trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchReviews(newPage, searchValue);
        }
    };

    return (
        <div className="review-yard-container">
            <div className="header">
                <h2>Đánh giá ({pagination.totalItems})</h2>
                <div className="search-and-filter">
                    <input
                        type="search"
                        placeholder="Tìm kiếm theo tên, nội dung..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="statusFilter"
                    >
                        <option>Mới nhất</option>
                        <option>Cũ nhất</option>
                        <option>Xác nhận</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải đánh giá...</p>
                </div>
            ) : (
                <>
                    {reviews.length > 0 && (
                        <div className="bulk-actions">
                            <label className="select-all">
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedReviews.size ===
                                            reviews.length && reviews.length > 0
                                    }
                                    onChange={handleSelectAll}
                                />
                                Chọn tất cả ({selectedReviews.size} đã chọn)
                            </label>
                        </div>
                    )}

                    <div className="review-list">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.rawId} className="review-item">
                                    <div className="checkbox-wrapper">
                                        <input
                                            type="checkbox"
                                            checked={selectedReviews.has(
                                                review.rawId
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    review.rawId
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="avatar">
                                        {review.avatarUrl ? (
                                            <img
                                                src={review.avatarUrl}
                                                alt={review.name}
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                    e.target.parentElement.classList.add(
                                                        "no-image"
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {review.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="info">
                                        <p className="id">{review.id}</p>
                                        <p className="name">{review.name}</p>
                                        <p className="date">{review.date}</p>
                                    </div>

                                    <div className="content">
                                        {review.content}
                                    </div>

                                    <div className="rating-wrapper">
                                        <div className="rating-value">
                                            {review.rating}
                                        </div>
                                        <div className="stars">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-reviews">
                                {searchValue
                                    ? `Không tìm thấy đánh giá nào với từ khóa "${searchValue}"`
                                    : "Chưa có đánh giá nào"}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() =>
                                    handlePageChange(pagination.currentPage - 1)
                                }
                                disabled={!pagination.hasPreviousPage}
                                className="pagination-btn"
                            >
                                ← Trước
                            </button>

                            <div className="pagination-info">
                                <span>
                                    Trang {pagination.currentPage} /{" "}
                                    {pagination.totalPages}
                                </span>
                                <span className="total-items">
                                    ({pagination.totalItems} đánh giá)
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(pagination.currentPage + 1)
                                }
                                disabled={!pagination.hasNextPage}
                                className="pagination-btn"
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default memo(ReviewCoach);
