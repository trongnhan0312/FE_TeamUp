import React, { useState, useEffect } from "react";
import loginImg from "../../../../assets/user/register.png";
import {
    FaStar,
    FaHeart,
    FaPlus,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import "./SimilarCourts.scss";
import courtService from "../../../../services/courtService.js";

const SimilarCourts = () => {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 4; // Số sân hiển thị trên một trang

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                setLoading(true);
                const response = await courtService.getList(
                    currentPage,
                    pageSize
                );

                if (response.isSuccessed) {
                    // Chuyển đổi dữ liệu từ API sang định dạng component cần
                    const courtsData = (response.resultObj?.items || []).map(
                        (court) => ({
                            id: court.id,
                            name: court.name,
                            image: court.imageUrls?.[0] || loginImg,
                            rating: court.ratingSummaryModelView.averageRating,
                            reviewCount:
                                court.ratingSummaryModelView.totalReviewerCount,
                        })
                    );

                    setCourts(courtsData);
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

        fetchCourts();
    }, [currentPage, pageSize]);

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return <div className="similar-courts loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="similar-courts error">{error}</div>;
    }

    // Sử dụng dữ liệu mặc định nếu không có dữ liệu từ API
    const displayCourts = courts.length > 0 ? courts : [];

    if (displayCourts.length === 0) {
        return null; // Không hiển thị gì nếu không có sân
    }

    return (
        <div className="similar-courts">
            <div className="courts-row">
                {displayCourts.map((court) => (
                    <div className="court-item" key={court.id}>
                        <div className="court-header">
                            <h3 className="court-name">{court.name}</h3>
                        </div>

                        <div className="court-image-container">
                            <img
                                src={court.image}
                                alt={court.name}
                                className="court-image"
                            />
                        </div>

                        <div className="court-footer">
                            <div className="rating">
                                <FaStar className="star-icon" />
                                <span className="rating-text">
                                    {court.rating} ({court.reviewCount} đánh
                                    giá)
                                </span>
                            </div>

                            {/* <div className="action-buttons">
                                <button className="action-button heart-button">
                                    <FaHeart />
                                </button>

                                <button className="action-button add-button">
                                    <FaPlus />
                                </button>
                            </div> */}
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

export default SimilarCourts;
