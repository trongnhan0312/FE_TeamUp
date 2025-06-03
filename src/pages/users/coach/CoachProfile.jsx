import { useState, useEffect } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCertificate,
  FaCheckCircle,
} from "react-icons/fa";
import { memo } from "react";
import { formatPrice } from "../../../utils/formatUtils";
import "./CoachProfile.scss";
import { useNavigate, useParams } from "react-router-dom";
import coachService from "../../../services/coachService";
import CourtReviews from "../courts/court_detail/CourtReviews";

const CoachProfile = () => {
  // Sử dụng useParams để lấy coachId từ URL
  const { coachId } = useParams();

  // State để lưu thông tin coach
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleContract = () => {
    navigate(`/chat`, { state: { userId: coachId, role: "Coach" } });
  };

  const handleBooking = () => {
    navigate(`/coach-booking/${coachId}/court-selector/${coach.type}`);
  };
  // Gọi API để lấy thông tin coach dựa trên coachId
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API getById từ coachService
        const response = await coachService.getCoachProfile(coachId);

        // Kiểm tra kết quả từ API
        if (response.isSuccessed) {
          setCoach(response.resultObj);
        } else {
          setError(
            response.message || "Không thể lấy thông tin huấn luyện viên"
          );
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin huấn luyện viên:", err);
        setError(
          typeof err === "string" ? err : "Đã xảy ra lỗi khi tải dữ liệu"
        );
      } finally {
        setLoading(false);
      }
    };

    if (coachId) {
      fetchCoachData();
    }
  }, [coachId]);

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="coach-profile-loading">
        Đang tải thông tin huấn luyện viên...
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div className="coach-profile-error">{error}</div>;
  }

  // Hiển thị thông báo nếu không tìm thấy coach
  if (!coach) {
    return (
      <div className="coach-profile-not-found">
        Không tìm thấy thông tin huấn luyện viên
      </div>
    );
  }

  return (
    <div className="coach-profile-container">
      <div className="coach-profile-card">
        {/* Left side - Avatar and basic info */}
        <div className="coach-profile-left">
          <div className="coach-avatar-container">
            {coach.avatar ? (
              <img src={coach.avatar} alt={coach.fullName} />
            ) : (
              <div className="avatar-circle">
                <span className="avatar-text">{coach.fullName.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="coach-basic-info">
            <h2>{coach.fullName}</h2>
            <div className="coach-specialty">
              <div className="specialty">{coach.specialty}</div>
              <div className="rating">
                <FaStar className="star-icon" />
                <span>{coach.rating} đánh giá</span>
              </div>
            </div>

            <div className="coach-key-details">
              <div className="key-detail-item">
                <FaCalendarAlt className="detail-icon" />
                <span>{coach.workingDate}</span>
              </div>
              <div className="key-detail-item">
                <FaCertificate className="detail-icon" />
                <span>{coach.certificate}</span>
              </div>
              <div className="key-detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <span>{coach.workingAddress}</span>
              </div>
              <div className="key-detail-item price">
                <FaMoneyBillWave className="detail-icon" />
                <span>{formatPrice(coach.pricePerSession)} VNĐ/buổi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Detailed information */}
        <div className="coach-profile-right">
          <div className="coach-details-section">
            {/* Experience & Area */}
            <div className="detail-row">
              <div className="detail-icon-container">📍</div>
              <div className="detail-content">
                <strong>Khu vực dạy:</strong> {coach.workingAddress}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon-container">🏆</div>
              <div className="detail-content">
                <strong>Kinh nghiệm:</strong> {coach.experience}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon-container">🥇</div>
              <div className="detail-content">
                <strong>Chứng chỉ:</strong> {coach.certificate}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon-container">👥</div>
              <div className="detail-content">
                <strong>Đối tượng:</strong> {coach.targetAudience}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon-container">📅</div>
              <div className="detail-content">
                <strong>Lịch dạy:</strong> {coach.workingDate}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon-container">🏟️</div>
              <div className="detail-content">
                <strong>Địa điểm:</strong> Theo yêu cầu (thoả thuận)
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon-container">💰</div>
              <div className="detail-content">
                <strong>Học phí:</strong> {formatPrice(coach.pricePerSession)}{" "}
                VNĐ/buổi
              </div>
            </div>

            {/* Training Content */}
            <div className="training-content-section">
              <h3>
                <span className="fire-icon">🔥</span> Nội dung đào tạo:
              </h3>
              <ul className="training-list">
                <li className="training-item">
                  <FaCheckCircle className="check-icon" />
                  <span>
                    Thể lực & tốc độ: Bài tập tăng cường sức bền, phản xạ nhanh
                  </span>
                </li>
                <li className="training-item">
                  <FaCheckCircle className="check-icon" />
                  <span>
                    Chiến thuật thi đấu: Đọc trận đấu, chơi theo đội hình phù
                    hợp
                  </span>
                </li>
                <li className="training-item">
                  <FaCheckCircle className="check-icon" />
                  <span>
                    Cải thiện vị trí thi đấu: Hỗ trợ luyện tập chuyên sâu theo
                    vị trí sở trường
                  </span>
                </li>
                <li className="training-item">
                  <FaCheckCircle className="check-icon" />
                  <span>
                    Huấn luyện cá nhân hoặc nhóm nhỏ: Đảm bảo hiệu quả tối đa
                    cho học viên
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="contact-section">
              <p className="contact-message">
                👋{" "}
                {coach.contactMessage ||
                  "Liên hệ ngay để đặt lịch học và nâng cao kỹ năng của bạn!"}
              </p>
              <div className="contact-buttons">
                <button onClick={handleContract} className="contact-button">
                  Liên hệ
                </button>
                <button
                  onClick={handleBooking}
                  className="contact-button schedule-button"
                >
                  Đặt lịch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CourtReviews revieweeId={coachId} />
    </div>
  );
};

export default memo(CoachProfile);
