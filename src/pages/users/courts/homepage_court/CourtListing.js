import React, { useState, useEffect } from "react";
import "./CourtListing.scss";
import { memo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    FaSearch,
    FaStar,
    FaHeart,
    FaChevronLeft,
    FaChevronRight,
    FaPlus,
} from "react-icons/fa";
import courtService from "../../../../services/courtService.js";
import loginImg from "../../../../assets/user/register.png"; // Ảnh mặc định nếu không có

// Định nghĩa các type chính xác như backend cần
const SPORT_TYPES = {
    SOCCER: "Bóng đá",
    BADMINTON: "Cầu lông",
    PICKLEBALL: "Pickleball",
};

// Mapping từ URL param sang giá trị backend
const URL_TO_TYPE = {
    football: SPORT_TYPES.SOCCER,
    badminton: SPORT_TYPES.BADMINTON,
    pickleball: SPORT_TYPES.PICKLEBALL,
};

// Mapping từ giá trị backend sang URL param (để cập nhật URL)
const TYPE_TO_URL = {
    [SPORT_TYPES.SOCCER]: "football",
    [SPORT_TYPES.BADMINTON]: "badminton",
    [SPORT_TYPES.PICKLEBALL]: "pickleball",
};

// Màu sắc cố định cho từng loại tab
const TAB_COLORS = {
    [SPORT_TYPES.PICKLEBALL]: "#b8e01a", // Màu lime xanh cho Pickleball
    [SPORT_TYPES.SOCCER]: "#212121", // Màu đen cho Bóng đá
    [SPORT_TYPES.BADMINTON]: "#9e9e9e", // Màu xám cho Cầu lông
};

// Màu text cho từng loại tab
const TAB_TEXT_COLORS = {
    [SPORT_TYPES.PICKLEBALL]: "#000000", // Đen
    [SPORT_TYPES.SOCCER]: "#FFFFFF", // Trắng
    [SPORT_TYPES.BADMINTON]: "#000000", // Đen
};

const CourtListing = () => {
    const { type: urlType } = useParams(); // Lấy type từ URL param
    const navigate = useNavigate();

    // Xác định type để gửi đến API dựa trên URL param, mặc định là Bóng đá
    const initialType = urlType
        ? URL_TO_TYPE[urlType] || SPORT_TYPES.SOCCER
        : SPORT_TYPES.SOCCER;

    // State để lưu trạng thái đang chọn và truyền đến API
    const [courtType, setCourtType] = useState(initialType);

    // State cho dữ liệu và UI
    const [nearbyCourts, setNearbyCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [featuredCourt, setFeaturedCourt] = useState(null);
    const pageSize = 12;

    // Xử lý thay đổi loại sân
    const handleTypeChange = (newType) => {
        if (newType !== courtType) {
            setCourtType(newType);
            setCurrentPage(1);
            setFeaturedCourt(null); // Chỉ reset featured court khi thực sự thay đổi type

            // Cập nhật URL
            navigate(`/court/${TYPE_TO_URL[newType]}`);
        }
    };

    // Theo dõi thay đổi của URL param và cập nhật state nếu cần
    useEffect(() => {
        if (
            urlType &&
            URL_TO_TYPE[urlType] &&
            URL_TO_TYPE[urlType] !== courtType
        ) {
            setCourtType(URL_TO_TYPE[urlType]);
        }
    }, [urlType]);

    // Fetch dữ liệu từ API khi courtType hoặc trang thay đổi
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                setLoading(true);
                const response = await courtService.getList(
                    currentPage,
                    pageSize,
                    courtType // Truyền courtType đúng định dạng mà backend cần
                );

                if (response.isSuccessed) {
                    const courtsData = (response.resultObj?.items || []).map(
                        (court) => ({
                            id: court.id,
                            name: court.name,
                            location:
                                court.sportsComplexModelView?.address ||
                                "Bình Triệu",
                            image: court.imageUrls?.[0] || loginImg,
                            rating:
                                court.ratingSummaryModelView?.averageRating ||
                                4.5,
                            totalRatings:
                                court.ratingSummaryModelView
                                    ?.totalReviewerCount || 0,
                        })
                    );

                    setNearbyCourts(courtsData);

                    // Thiết lập sân đặc trưng từ sân đầu tiên nếu có
                    if (courtsData.length > 0) {
                        setFeaturedCourt(courtsData[0]);
                    } else {
                        setFeaturedCourt(null);
                    }

                    setTotalPages(response.resultObj?.totalPages || 1);
                } else {
                    setError(response.message || "Không thể lấy danh sách sân");
                    setNearbyCourts([]);
                    setFeaturedCourt(null);
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách sân:", err);
                setError("Đã xảy ra lỗi khi tải dữ liệu");
                setNearbyCourts([]);
                setFeaturedCourt(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourts();
    }, [courtType, currentPage, pageSize]);

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Xử lý chuyển đến trang chi tiết sân
    const handleCourtClick = (courtId) => {
        navigate(`/courts/${courtId}`);
    };

    // Kiểm tra xem type nào đang được chọn để hiển thị UI tương ứng
    const isActiveType = (type) => courtType === type;

    return (
        <div className="court-listing">
            {/* Top purple banner */}
            <div className="purple-banner"></div>

            {/* Main content */}
            <div className="container">
                {/* Court detail card - Chỉ hiển thị khi đã có dữ liệu featuredCourt */}
                {featuredCourt && (
                    <div className="court-detail-card">
                        <div className="court-detail-content">
                            {/* Court image */}
                            <div className="court-image">
                                <img
                                    src={featuredCourt.image}
                                    alt={featuredCourt.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = loginImg;
                                    }}
                                />
                            </div>

                            {/* Court info */}
                            <div className="court-info">
                                <div>
                                    <h1>{featuredCourt.name}</h1>
                                    <div className="action-row">
                                        <button
                                            className="book-button"
                                            onClick={() =>
                                                handleCourtClick(
                                                    featuredCourt.id
                                                )
                                            }
                                        >
                                            Đặt sân
                                        </button>
                                        <div className="rating">
                                            <FaStar className="star-icon" />
                                            <span>
                                                {featuredCourt.rating.toFixed(
                                                    1
                                                )}{" "}
                                                đánh giá
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading state cho detail card */}
                {loading && !featuredCourt && (
                    <div className="court-detail-card skeleton-loading">
                        <div className="court-detail-content">
                            <div className="court-image skeleton"></div>
                            <div className="court-info">
                                <div className="skeleton-text"></div>
                                <div className="skeleton-action-row"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search filters */}
                <div className="search-filters">
                    <div className="search-container">
                        <div className="filter-criteria">
                            <div className="filter-item">
                                <span className="label">Địa điểm</span>
                                <span className="required">*</span>
                            </div>
                            <div className="filter-item">
                                <span className="label">Ngày tháng</span>
                                <span className="required">*</span>
                            </div>
                            <div className="filter-item">
                                <span className="label">Khung giờ</span>
                                <span className="required">*</span>
                            </div>
                        </div>
                        <button className="search-button">Tìm</button>
                    </div>
                </div>

                {/* Sport type tabs - Với màu cố định */}
                <div className="sport-tabs">
                    <button
                        className="tab pickleball-tab"
                        onClick={() => handleTypeChange(SPORT_TYPES.PICKLEBALL)}
                        style={{
                            backgroundColor: TAB_COLORS[SPORT_TYPES.PICKLEBALL],
                            color: TAB_TEXT_COLORS[SPORT_TYPES.PICKLEBALL],
                            fontWeight: isActiveType(SPORT_TYPES.PICKLEBALL)
                                ? "bold"
                                : "normal",
                        }}
                    >
                        Pickleball
                    </button>
                    <button
                        className="tab soccer-tab"
                        onClick={() => handleTypeChange(SPORT_TYPES.SOCCER)}
                        style={{
                            backgroundColor: TAB_COLORS[SPORT_TYPES.SOCCER],
                            color: TAB_TEXT_COLORS[SPORT_TYPES.SOCCER],
                            fontWeight: isActiveType(SPORT_TYPES.SOCCER)
                                ? "bold"
                                : "normal",
                        }}
                    >
                        Bóng đá
                    </button>
                    <button
                        className="tab badminton-tab"
                        onClick={() => handleTypeChange(SPORT_TYPES.BADMINTON)}
                        style={{
                            backgroundColor: TAB_COLORS[SPORT_TYPES.BADMINTON],
                            color: TAB_TEXT_COLORS[SPORT_TYPES.BADMINTON],
                            fontWeight: isActiveType(SPORT_TYPES.BADMINTON)
                                ? "bold"
                                : "normal",
                        }}
                    >
                        Cầu lông
                    </button>
                </div>

                {/* Nearby courts section */}
                <div className="nearby-courts-card">
                    <div className="card-header">
                        <h2>Sân gần đây</h2>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="loading-state">Đang tải dữ liệu...</div>
                    )}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="error-state">{error}</div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && nearbyCourts.length === 0 && (
                        <div className="empty-state">
                            Không tìm thấy sân nào gần đây
                        </div>
                    )}

                    {/* Courts grid - populated from API */}
                    {!loading && !error && nearbyCourts.length > 0 && (
                        <>
                            {/* Courts grid - 4 sân mỗi hàng */}
                            <div className="courts-grid">
                                {nearbyCourts.map((court) => (
                                    <div
                                        key={court.id}
                                        className="court-card"
                                        onClick={() =>
                                            handleCourtClick(court.id)
                                        }
                                    >
                                        <div className="court-image-container">
                                            <img
                                                src={court.image}
                                                alt={court.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = loginImg; // Sử dụng ảnh mặc định nếu load lỗi
                                                }}
                                            />
                                            <div className="location-badge">
                                                {court.location}
                                            </div>
                                        </div>
                                        <div className="court-card-footer">
                                            <div className="court-rating">
                                                <FaStar className="star-icon-small" />
                                                <span>
                                                    {court.rating.toFixed(1)} (
                                                    {court.totalRatings} đánh
                                                    giá)
                                                </span>
                                            </div>
                                            <div className="action-buttons">
                                                <button
                                                    className="icon-button favorite"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên card
                                                        // Xử lý yêu thích sân
                                                    }}
                                                >
                                                    <FaHeart size={16} />
                                                </button>
                                                <button
                                                    className="icon-button add"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên card
                                                        handleCourtClick(
                                                            court.id
                                                        );
                                                    }}
                                                >
                                                    <FaPlus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-button prev"
                                        disabled={currentPage <= 1}
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                    >
                                        <FaChevronLeft />
                                    </button>

                                    <div className="page-info">
                                        {currentPage} of {totalPages}
                                    </div>

                                    <button
                                        className="pagination-button next"
                                        disabled={currentPage >= totalPages}
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(CourtListing);
