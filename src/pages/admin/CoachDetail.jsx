import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import coachService from "../../services/coachService";
import "./CoachDetail.scss";

const CoachDetail = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const response = await coachService.getCoachById(coachId);
        setCoach(response.resultObj);
      } catch (err) {
        setError("Không thể tải thông tin huấn luyện viên.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [coachId]);

  const getInitials = (name) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatFieldName = (key) => {
    const fieldNames = {
      id: "ID",
      fullName: "Họ và tên",
      email: "Email",
      phoneNumber: "Số điện thoại",
      age: "Tuổi",
      height: "Chiều cao (cm)",
      weight: "Cân nặng (kg)",
      specialty: "Chuyên môn",
      certificate: "Chứng chỉ",
      workingAddress: "Địa điểm làm việc",
      workingDate: "Lịch làm việc",
      pricePerSession: "Giá mỗi buổi (VNĐ)",
      startDate: "Ngày bắt đầu",
      expireDate: "Ngày hết hạn",
      status: "Trạng thái",
      statusForCoach: "Trạng thái HLV",
      package: "Gói đăng ký",
      role: "Vai trò",
    };
    return fieldNames[key] || key;
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "Không có thông tin";

    if (key === "status" || key === "statusForCoach") {
      return value === "Active" ? "Hoạt động" : "Không hoạt động";
    }

    if (key === "startDate" || key === "expireDate") {
      return new Date(value).toLocaleDateString("vi-VN");
    }

    if (key === "package") {
      return `${value.name} - ${value.description}`;
    }

    if (key === "role") {
      return value.name;
    }

    return value.toString();
  };

  if (loading) {
    return <div className="coach-detail-container">Đang tải...</div>;
  }

  if (error) {
    return <div className="coach-detail-container">{error}</div>;
  }

  if (!coach) {
    return <div className="coach-detail-container">Không tìm thấy HLV</div>;
  }

  return (
    <div className="coach-detail-container">
      <div className="coach-detail-content">
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            &larr; Quay lại
          </button>
          <h1>Thông tin chi tiết HLV</h1>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="coach-avatar">
              {coach.avatarUrl ? (
                <img
                  src={coach.avatarUrl}
                  alt={coach.fullName}
                  className="avatar-image"
                />
              ) : (
                getInitials(coach.fullName)
              )}
            </div>
            <div className="coach-basic-info">
              <h2>{coach.fullName}</h2>
              <p>{coach.email}</p>
              <div className="coach-status">
                <span
                  className={`status-badge ${
                    coach.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  <span className="status-dot"></span>
                  {coach.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Thông tin chi tiết</h3>
          <div className="details-grid">
            {Object.entries(coach).map(([key, value]) => (
              <div key={key} className="detail-item">
                <div className="detail-label">{formatFieldName(key)}</div>
                <div className="detail-value">{formatValue(key, value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDetail;
