import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import "./userDetail.scss";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(userId);
        setUser(response.resultObj);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const getInitials = (name) => {
    if (!name) return "U";
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
      address: "Địa chỉ",
      dateOfBirth: "Ngày sinh",
      gender: "Giới tính",
      status: "Trạng thái",
      createdAt: "Ngày tạo",
      updatedAt: "Ngày cập nhật",
      role: "Vai trò",
      avatar: "Ảnh đại diện",
    };
    return fieldNames[key] || key;
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "Không có thông tin";

    if (key === "status") {
      return value === "Active" ? "Hoạt động" : "Không hoạt động";
    }

    if (key === "gender") {
      return value === "male" ? "Nam" : value === "female" ? "Nữ" : value;
    }

    if (key === "createdAt" || key === "updatedAt") {
      return new Date(value).toLocaleDateString("vi-VN");
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }

    return value.toString();
  };

  if (loading) {
    return (
      <div className="user-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-detail-container">
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

  if (!user) {
    return (
      <div className="user-detail-container">
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
          <h3>Không tìm thấy người dùng</h3>
          <p>Người dùng với ID này không tồn tại trong hệ thống.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-detail-container">
      <div className="user-detail-content">
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
            <h1>Thông tin chi tiết người dùng</h1>
            <p>Xem và quản lý thông tin người dùng trong hệ thống</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="user-avatar">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="avatar-image"
                />
              ) : (
                getInitials(user.fullName)
              )}
            </div>

            <div className="user-basic-info">
              <h2>{user.fullName || "Chưa có tên"}</h2>
              <p className="user-email">{user.email}</p>
              <div className="user-status">
                <span
                  className={`status-badge ${
                    user.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  <span className="status-dot"></span>
                  {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="details-card">
          <div className="card-header">
            <h3>Thông tin chi tiết</h3>
            <div className="header-actions">
              {/* <button className="edit-button">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Chỉnh sửa
              </button> */}
            </div>
          </div>
          <div className="details-grid">
            {Object.entries(user).map(([key, value]) => (
              <div key={key} className="detail-item">
                <div className="detail-label">{formatFieldName(key)}</div>
                <div className="detail-value">
                  {key === "status" ? (
                    <span
                      className={`inline-status ${
                        value === "active" ? "active" : "inactive"
                      }`}
                    >
                      {formatValue(key, value)}
                    </span>
                  ) : typeof value === "object" && value !== null ? (
                    <pre className="json-value">
                      {JSON.stringify(value, null, 2)}
                    </pre>
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

export default UserDetail;
