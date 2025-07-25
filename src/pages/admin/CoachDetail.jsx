"use client";

import { useEffect, useState } from "react";
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

    if (coachId) {
      fetchCoach();
    }
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
      height: "Chiều cao",
      weight: "Cân nặng",
      avatarUrl: "Ảnh đại diện",
      type: "Loại",
      specialty: "Chuyên môn",
      certificate: "Chứng chỉ",
      workingAddress: "Địa chỉ làm việc",
      workingDate: "Ngày làm việc",
      pricePerSession: "Giá mỗi buổi",
      experience: "Kinh nghiệm",
      targetObject: "Đối tượng mục tiêu",
      statusForCoach: "Trạng thái HLV",
      status: "Trạng thái",
      startDate: "Ngày bắt đầu",
      expireDate: "Ngày hết hạn",
      role: "Vai trò",
      package: "Gói dịch vụ",
    };
    return fieldNames[key] || key;
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "Không có thông tin";

    if (key === "status" || key === "statusForCoach") {
      return value === "Active" || value === "active"
        ? "Hoạt động"
        : "Không hoạt động";
    }

    if (key === "startDate" || key === "expireDate" || key === "workingDate") {
      return new Date(value).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (key === "pricePerSession" && typeof value === "number") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    }

    if (key === "height" && typeof value === "number") {
      return `${value} cm`;
    }

    if (key === "weight" && typeof value === "number") {
      return `${value} kg`;
    }

    if (typeof value === "object" && value !== null) {
      if (key === "package") {
        return `${value.name} - ${
          value.description || ""
        } (${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value.price || 0)})`;
      }
      if (key === "role") {
        return value.name;
      }
      return JSON.stringify(value, null, 2);
    }

    return value.toString();
  };

  if (loading) {
    return (
      <div className="coach-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin huấn luyện viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coach-detail-container">
        <div className="error-container">
          <div className="error-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.29 3.86L1.82 18C1.64486 18.3024 1.55674 18.6453 1.56554 18.9928C1.57434 19.3402 1.67967 19.6781 1.87 19.97C2.06032 20.2618 2.32636 20.4972 2.64188 20.6501C2.95740 20.8029 3.31 20.8979 3.67 20.93H20.33C20.69 20.8979 21.0426 20.8029 21.3581 20.6501C21.6736 20.4972 21.9397 20.2618 22.13 19.97C22.3203 19.6781 22.4257 19.3402 22.4345 18.9928C22.4433 18.6453 22.3551 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="13"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="17"
                x2="12.01"
                y2="17"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="coach-detail-container">
        <div className="not-found-container">
          <div className="not-found-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>Không tìm thấy huấn luyện viên</h3>
          <p>Huấn luyện viên với ID này không tồn tại trong hệ thống.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="coach-detail-container">
      <div className="coach-detail-content">
        {/* Header */}
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Quay lại
          </button>
          <div className="header-info">
            <h1>Thông tin chi tiết huấn luyện viên</h1>
            <p>Xem và quản lý thông tin huấn luyện viên trong hệ thống</p>
          </div>
        </div>

        {/* Coach Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="coach-avatar">
              {coach.avatarUrl ? (
                <img
                  src={coach.avatarUrl || "/placeholder.svg"}
                  alt="avatar"
                  className="avatar-image"
                />
              ) : (
                getInitials(coach.fullName)
              )}
            </div>
            <div className="coach-basic-info">
              <h2>{coach.fullName || "Chưa có tên"}</h2>
              <p className="coach-email">{coach.email}</p>
              {coach.specialty && (
                <p className="coach-specialty">Chuyên môn: {coach.specialty}</p>
              )}
              <div className="coach-status">
                <span
                  className={`status-badge ${
                    coach.status === "Active" || coach.status === "active"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  <span className="status-dot"></span>
                  {coach.status === "Active" || coach.status === "active"
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </span>
              </div>
            </div>
          </div>

          {/* Coach Stats - moved outside profile-header */}
          <div className="coach-stats">
            {coach.experience && (
              <div className="stat-item">
                <span className="stat-number">{coach.experience}</span>
                <span className="stat-label">Kinh nghiệm</span>
              </div>
            )}
            {coach.pricePerSession && (
              <div className="stat-item">
                <span className="stat-number">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(coach.pricePerSession)}
                </span>
                <span className="stat-label">Giá/buổi</span>
              </div>
            )}
            <div className="stat-item">
              <span className="stat-number">
                {coach.role?.name || coach.role || "Coach"}
              </span>
              <span className="stat-label">Vai trò</span>
            </div>
          </div>
        </div>

        {/* Coach Details */}
        <div className="details-card">
          <div className="card-header">
            <h3>Thông tin chi tiết</h3>
            <div className="header-actions">
              {/* Future: Add edit button */}
            </div>
          </div>
          <div className="details-grid">
            {Object.entries(coach).map(([key, value]) => (
              <div key={key} className="detail-item">
                <div className="detail-label">{formatFieldName(key)}</div>
                <div className="detail-value">
                  {key === "status" || key === "statusForCoach" ? (
                    <span
                      className={`inline-status ${
                        value === "Active" || value === "active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {formatValue(key, value)}
                    </span>
                  ) : (
                    formatValue(key, value)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDetail;
