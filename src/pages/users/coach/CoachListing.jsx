import React, { useState, useEffect } from "react";
import {
    FaStar,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaBuilding,
    FaCertificate,
} from "react-icons/fa";
import { memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoachListing.scss";
import loginImg from "../../../assets/user/login.png"; // Ảnh mặc định nếu không có
import coachService from "../../../services/coachService";
import { formatPrice } from "../../../utils/formatUtils";

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

// Màu sắc cố định cho từng loại tab (theo hình được cung cấp)
const TAB_COLORS = {
    [SPORT_TYPES.PICKLEBALL]: "#FFFFFF", // Trắng cho Pickleball (active là lime)
    [SPORT_TYPES.SOCCER]: "#1F1F1F", // Đen cho Bóng đá
    [SPORT_TYPES.BADMINTON]: "#b8e01a", // Lime cho Cầu lông
};

// Màu text cho từng loại tab
const TAB_TEXT_COLORS = {
    [SPORT_TYPES.PICKLEBALL]: "#000000", // Đen
    [SPORT_TYPES.SOCCER]: "#FFFFFF", // Trắng
    [SPORT_TYPES.BADMINTON]: "#000000", // Đen
};

// Màu active cho từng loại tab
const TAB_ACTIVE_COLORS = {
    [SPORT_TYPES.PICKLEBALL]: "#b8e01a", // Lime khi active
    [SPORT_TYPES.SOCCER]: "#1F1F1F", // Đen khi active
    [SPORT_TYPES.BADMINTON]: "#b8e01a", // Lime khi active
};

const CoachListing = () => {
    const navigate = useNavigate();

    const { type: urlType } = useParams();

    // Xác định type để gửi đến API dựa trên URL param, mặc định là ALL hoặc một giá trị null
    const initialType = urlType
        ? URL_TO_TYPE[urlType] || SPORT_TYPES.SOCCER // Nếu có urlType
        : null; // Nếu không có urlType, gán null hoặc một giá trị đặc biệt

    // Thêm một hằng số cho tất cả các thể loại
    const ALL_SPORTS = "ALL";

    // State để lưu trạng thái đang chọn và truyền đến API
    const [coachType, setCoachType] = useState(initialType);

    // State cho dữ liệu và UI
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
        if (
            urlType &&
            URL_TO_TYPE[urlType] &&
            URL_TO_TYPE[urlType] !== coachType
        ) {
            setCoachType(URL_TO_TYPE[urlType]);
            setCurrentPage(1);
        }
    }, [urlType]);

    // Fetch dữ liệu từ API khi coachType hoặc trang thay đổi
    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                setLoading(true);
                setError(null);
                let data;
                if (!coachType) {
                    // Gọi API không có searchValue (tùy theo backend)
                    data = await coachService.getCoachesPagination(
                        "",
                        currentPage,
                        pageSize
                    );
                } else {
                    // Gọi API với searchValue là coachType
                    data = await coachService.getCoachesPagination(
                        coachType,
                        currentPage,
                        pageSize
                    );
                }

                // Xử lý response
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
                setError(typeof err === 'string' ? err : "Đã xảy ra lỗi khi tải dữ liệu");
                setCoaches([]);
                setLoading(false);
            }
        };

        fetchCoaches();
    }, [coachType, currentPage, pageSize]);

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Xử lý chuyển đến trang chi tiết huấn luyện viên
    const handleCoachClick = (coachId) => {
        navigate(`/coaches/detail/${coachId}`);
    };

    // Kiểm tra xem type nào đang được chọn để hiển thị UI tương ứng
    const isActiveType = (type) => coachType === type;

    // Hàm tạo đường viền màu vàng cho avatar
    const getAvatarStyle = () => {
        return {
            borderColor: "#FFD700", // Màu vàng cho viền avatar
        };
    };

    return (
        <div className="coach-listing">
            {/* Main content */}
            <div className="container">
                {/* Sport type tabs với viền tím */}
                <div className="sport-tabs">
                    <button
                        className={`tab pickleball-tab ${isActiveType(SPORT_TYPES.PICKLEBALL) ? "active" : ""
                            }`}
                        onClick={() => handleTypeChange(SPORT_TYPES.PICKLEBALL)}
                        style={{
                            backgroundColor: isActiveType(
                                SPORT_TYPES.PICKLEBALL
                            )
                                ? TAB_ACTIVE_COLORS[SPORT_TYPES.PICKLEBALL]
                                : TAB_COLORS[SPORT_TYPES.PICKLEBALL],
                            color: TAB_TEXT_COLORS[SPORT_TYPES.PICKLEBALL],
                        }}
                    >
                        Pickleball
                    </button>
                    <button
                        className={`tab soccer-tab ${isActiveType(SPORT_TYPES.SOCCER) ? "active" : ""
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
                        className={`tab badminton-tab ${isActiveType(SPORT_TYPES.BADMINTON) ? "active" : ""
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

                {/* Coaches grid */}
                <div className="coaches-container">
                    {/* Loading state */}
                    {loading && (
                        <div className="loading-state">Đang tải dữ liệu...</div>
                    )}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="error-state">{error}</div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && coaches.length === 0 && (
                        <div className="empty-state">
                            Không tìm thấy huấn luyện viên nào
                        </div>
                    )}

                    {/* Coaches grid - populated with data */}
                    {!loading && !error && coaches.length > 0 && (
                        <div className="coaches-grid">
                            {coaches.map((coach) => (
                                <div
                                    key={coach.id}
                                    className="coach-card"
                                    onClick={() => handleCoachClick(coach.id)}
                                >
                                    <div className="coach-avatar-container">
                                        <div
                                            className="coach-avatar"
                                            style={getAvatarStyle()}
                                        >
                                            {coach.avatar ? (
                                                <img
                                                    src={coach.avatar}
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
                                        <h3 className="coach-name">
                                            {coach.fullName}
                                        </h3>
                                        <div className="coach-rating">
                                            <span className="rating-text">
                                                {coach.specialty}
                                            </span>
                                            <div className="rating-stars">
                                                <FaStar className="star-icon" />
                                                <span>
                                                    {coach.rating} đánh giá
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="coach-details">
                                        <div className="detail-item">
                                            <FaCalendarAlt className="detail-icon" />
                                            <span>
                                                {coach.workingDate}
                                            </span>
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

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-button"
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                            >
                                Trang trước
                            </button>
                            <div className="page-numbers">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        className={`page-number ${currentPage === page ? "active" : ""
                                            }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="pagination-button"
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
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
