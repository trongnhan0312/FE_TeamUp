import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAllOwners,
  fetchSportsComplexesByOwner,
  fetchCourtsBySportsComplexId,
} from "../../services/ownerService";
import "./ownerDetail.scss";

const OwnerDetail = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [sportsComplexes, setSportsComplexes] = useState([]);
  const [complexCourts, setComplexCourts] = useState({}); // Map of complexId -> courts
  const [loading, setLoading] = useState(true);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [courtsLoading, setCourtsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        setLoading(true);

        // Fetch all owners and find the specific one
        const allOwners = await fetchAllOwners();
        const foundOwner = allOwners.find(
          (o) => o.id.toString() === ownerId.toString()
        );

        if (!foundOwner) {
          setError("Không tìm thấy chủ sân với ID này.");
          return;
        }

        setOwner(foundOwner);

        // Fetch sports complexes for this owner
        setSportsLoading(true);
        const complexes = await fetchSportsComplexesByOwner(ownerId, 1, 100);
        setSportsComplexes(complexes);

        // Fetch courts for each sports complex
        if (complexes.length > 0) {
          setCourtsLoading(true);
          const courtsMap = {};

          for (const complex of complexes) {
            try {
              const courts = await fetchCourtsBySportsComplexId(complex.id);
              courtsMap[complex.id] = courts;
            } catch (error) {
              console.error(
                `Lỗi khi lấy sân cho khu thể thao ${complex.id}:`,
                error
              );
              courtsMap[complex.id] = [];
            }
          }

          setComplexCourts(courtsMap);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin chủ sân:", err);
        setError("Không thể tải thông tin chủ sân.");
      } finally {
        setLoading(false);
        setSportsLoading(false);
        setCourtsLoading(false);
      }
    };

    if (ownerId) {
      fetchOwnerData();
    }
  }, [ownerId]);

  const getInitials = (name) => {
    if (!name) return "O";
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

    if (key === "status") {
      return value === "Active" ? "Hoạt động" : "Không hoạt động";
    }

    if (key === "startDate" || key === "expireDate") {
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

    if (typeof value === "object" && value !== null) {
      if (key === "package") {
        return `${value.name} - ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value.price)} (${value.durationDays} ngày)`;
      }
      if (key === "role") {
        return value.name;
      }
      return JSON.stringify(value, null, 2);
    }

    return value.toString();
  };

  const getTotalCourts = () => {
    return Object.values(complexCourts).reduce(
      (total, courts) => total + courts.length,
      0
    );
  };

  if (loading) {
    return (
      <div className="owner-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin chủ sân...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-detail-container">
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

  if (!owner) {
    return (
      <div className="owner-detail-container">
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
          <h3>Không tìm thấy chủ sân</h3>
          <p>Chủ sân với ID này không tồn tại trong hệ thống.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-detail-container">
      <div className="owner-detail-content">
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
            <h1>Thông tin chi tiết chủ sân</h1>
            <p>Xem và quản lý thông tin chủ sân trong hệ thống</p>
          </div>
        </div>

        {/* Owner Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="user-avatar">
              {owner.avatarUrl ? (
                <img
                  src={owner.avatarUrl || "/placeholder.svg"}
                  alt="avatar"
                  className="avatar-image"
                />
              ) : (
                getInitials(owner.fullName)
              )}
            </div>
            <div className="user-basic-info">
              <h2>{owner.fullName || "Chưa có tên"}</h2>
              <p className="user-email">{owner.email}</p>
              <div className="user-status">
                <span
                  className={`status-badge ${
                    owner.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  <span className="status-dot"></span>
                  {owner.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>
              <div className="owner-stats">
                <div className="stat-item">
                  <span className="stat-number">{sportsComplexes.length}</span>
                  <span className="stat-label">Khu thể thao</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{getTotalCourts()}</span>
                  <span className="stat-label">Tổng số sân</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {owner.role?.name || "N/A"}
                  </span>
                  <span className="stat-label">Vai trò</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-list">
            <button
              className={`tab-trigger ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Thông tin cá nhân
            </button>
            <button
              className={`tab-trigger ${
                activeTab === "complexes" ? "active" : ""
              }`}
              onClick={() => setActiveTab("complexes")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="9,22 9,12 15,12 15,22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Khu thể thao ({sportsComplexes.length})
            </button>
          </div>

          {/* Personal Info Tab */}
          {activeTab === "info" && (
            <div className="tab-content">
              <div className="details-card">
                <div className="card-header">
                  <h3>Thông tin chi tiết</h3>
                </div>
                <div className="details-grid">
                  {Object.entries(owner).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <div className="detail-label">{formatFieldName(key)}</div>
                      <div className="detail-value">
                        {key === "status" ? (
                          <span
                            className={`inline-status ${
                              value === "Active" ? "active" : "inactive"
                            }`}
                          >
                            {formatValue(key, value)}
                          </span>
                        ) : typeof value === "object" && value !== null ? (
                          <div className="object-value">
                            {formatValue(key, value)}
                          </div>
                        ) : (
                          formatValue(key, value)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sports Complexes Tab */}
          {activeTab === "complexes" && (
            <div className="tab-content">
              <div className="complexes-section">
                {sportsLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải danh sách khu thể thao...</p>
                  </div>
                ) : sportsComplexes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="9,22 9,12 15,12 15,22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3>Chưa có khu thể thao</h3>
                    <p>Chủ sân này chưa có khu thể thao nào trong hệ thống.</p>
                  </div>
                ) : (
                  <div className="complexes-grid">
                    {sportsComplexes.map((complex) => (
                      <div key={complex.id} className="complex-card">
                        <div className="complex-header">
                          <div className="complex-info">
                            <h4>
                              {complex.name || `Khu thể thao ${complex.id}`}
                            </h4>
                            <p className="complex-description">
                              {complex.description || "Không có mô tả"}
                            </p>
                          </div>
                          <div className="complex-stats">
                            <span className="courts-count">
                              {complexCourts[complex.id]?.length || 0} sân
                            </span>
                          </div>
                        </div>

                        {complex.address && (
                          <div className="complex-address">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="12"
                                cy="10"
                                r="3"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            {complex.address}
                          </div>
                        )}

                        {/* Courts List */}
                        {courtsLoading ? (
                          <div className="courts-loading">
                            <div className="mini-spinner"></div>
                            <span>Đang tải sân...</span>
                          </div>
                        ) : complexCourts[complex.id]?.length > 0 ? (
                          <div className="courts-section">
                            <h5>Danh sách sân:</h5>
                            <div className="courts-grid">
                              {complexCourts[complex.id].map((court) => (
                                <div key={court.id} className="court-item">
                                  <div className="court-info">
                                    <span className="court-name">
                                      {court.name || `Sân ${court.id}`}
                                    </span>
                                    {court.price && (
                                      <span className="court-price">
                                        {new Intl.NumberFormat("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        }).format(court.price)}
                                        /giờ
                                      </span>
                                    )}
                                  </div>
                                  {court.status && (
                                    <span
                                      className={`court-status ${court.status.toLowerCase()}`}
                                    >
                                      {court.status === "Active"
                                        ? "Hoạt động"
                                        : "Không hoạt động"}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="no-courts">
                            <span>Chưa có sân nào</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDetail;
