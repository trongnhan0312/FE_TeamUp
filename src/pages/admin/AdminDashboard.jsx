"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import employeeService from "../../services/coachService";
import {
  fetchAllOwners,
  fetchSportsComplexesByOwner,
} from "../../services/ownerService"; // Import both functions
import "./AdminDashboard.scss";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [owners, setOwners] = useState([]);
  const [ownerSportsMap, setOwnerSportsMap] = useState({}); // Map of ownerId -> sports complexes
  const [loading, setLoading] = useState(true);
  const [coachesLoading, setCoachesLoading] = useState(true);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [sportsLoading, setSportsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to get sports count for a specific owner
  const getSportsCountByOwner = (ownerId) => {
    return ownerSportsMap[ownerId]?.length || 0;
  };

  // Function to fetch sports complexes for all owners
  const fetchAllOwnersSportsComplexes = async (ownersList) => {
    setSportsLoading(true);
    const sportsMap = {};

    try {
      // Fetch sports complexes for each owner in parallel
      const sportsPromises = ownersList.map(async (owner) => {
        try {
          const sportsComplexes = await fetchSportsComplexesByOwner(
            owner.id,
            1,
            100
          ); // Fetch first 100 complexes
          return { ownerId: owner.id, complexes: sportsComplexes };
        } catch (error) {
          console.error(
            `Lỗi khi lấy khu thể thao cho owner ${owner.id}:`,
            error
          );
          return { ownerId: owner.id, complexes: [] };
        }
      });

      const results = await Promise.all(sportsPromises);

      // Build the sports map
      results.forEach(({ ownerId, complexes }) => {
        sportsMap[ownerId] = complexes;
      });

      setOwnerSportsMap(sportsMap);

      // Log total count
      const totalComplexes = Object.values(sportsMap).reduce(
        (total, complexes) => total + complexes.length,
        0
      );
      console.log(`Tổng số khu thể thao: ${totalComplexes}`);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khu thể thao:", error);
      toast.error("Không thể tải danh sách khu thể thao");
    } finally {
      setSportsLoading(false);
    }
  };

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await userService.getAllUsers();
        setUsers(response.resultObj || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        toast.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch coaches data
  useEffect(() => {
    const fetchCoaches = async () => {
      setCoachesLoading(true);
      try {
        const response = await employeeService.getAllCoaches();
        setCoaches(response.resultObj || response || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách huấn luyện viên:", error);
        toast.error("Không thể tải danh sách huấn luyện viên");
      } finally {
        setCoachesLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  // Fetch owners data and then fetch their sports complexes
  useEffect(() => {
    const fetchOwners = async () => {
      setOwnersLoading(true);
      try {
        const ownersData = await fetchAllOwners();
        setOwners(ownersData || []);

        // After getting owners, fetch their sports complexes
        if (ownersData && ownersData.length > 0) {
          await fetchAllOwnersSportsComplexes(ownersData);
        } else {
          setSportsLoading(false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chủ sân:", error);
        toast.error("Không thể tải danh sách chủ sân");
        setSportsLoading(false);
      } finally {
        setOwnersLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const filteredFieldOwners = owners.filter(
    (owner) =>
      (
        owner.fullName?.toLowerCase() ||
        owner.name?.toLowerCase() ||
        ""
      ).includes(searchTerm.toLowerCase()) ||
      (owner.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (
        owner.fieldName?.toLowerCase() ||
        owner.businessName?.toLowerCase() ||
        ""
      ).includes(searchTerm.toLowerCase())
  );

  const filteredCoaches = coaches.filter(
    (coach) =>
      (
        coach.fullName?.toLowerCase() ||
        coach.name?.toLowerCase() ||
        ""
      ).includes(searchTerm.toLowerCase()) ||
      (coach.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (
        coach.specialty?.toLowerCase() ||
        coach.specialization?.toLowerCase() ||
        ""
      ).includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Calculate total sports complexes count
  const totalSportsCount = Object.values(ownerSportsMap).reduce(
    (total, complexes) => total + complexes.length,
    0
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="crown-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16L3 6L5.5 10L12 4L18.5 10L21 6L19 16H5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1>Admin Dashboard</h1>
          </div>
          <p>Chào mừng bạn đến với trang quản trị</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card users-card">
          <div className="stat-header">
            <div className="stat-info">
              <span className="stat-title">Tổng người dùng</span>
              <div className="stat-number">{users.length}</div>
            </div>
            <div className="stat-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7007C21.7033 16.0473 20.9999 15.5902 20.2 15.4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8003 3.35031 17.5037 3.80771 18.0098 4.46113C18.5159 5.11456 18.8004 5.92494 18.8004 6.76C18.8004 7.59506 18.5159 8.40544 18.0098 9.05887C17.5037 9.71229 16.8003 10.1697 16 10.39"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="stat-description">
            {users.filter((user) => user.status === "Active").length} người dùng
            đang hoạt động
          </p>
        </div>

        <div className="stat-card employees-card">
          <div className="stat-header">
            <div className="stat-info">
              <span className="stat-title">Chủ sân</span>
              <div className="stat-number">
                {ownersLoading ? "..." : owners.length}
              </div>
            </div>
            <div className="stat-icon">
              <svg
                width="24"
                height="24"
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
          </div>
          <p className="stat-description">
            {ownersLoading
              ? "Đang tải..."
              : `${
                  owners.filter(
                    (owner) =>
                      owner.status === "Active" || owner.status === "active"
                  ).length
                } đang hoạt động`}
          </p>
        </div>

        <div className="stat-card bookings-card">
          <div className="stat-header">
            <div className="stat-info">
              <span className="stat-title">Huấn luyện viên</span>
              <div className="stat-number">
                {coaches.filter((coach) => coach.status === "Active").length}
              </div>
            </div>
            <div className="stat-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="stat-description">
            {coachesLoading
              ? "Đang tải..."
              : `${
                  coaches.filter(
                    (c) => c.status === "active" || c.status === "Active"
                  ).length
                } đang hoạt động`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button
            className={`tab-trigger ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
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
            Chủ Sân
          </button>
          <button
            className={`tab-trigger ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7007C21.7033 16.0473 20.9999 15.5902 20.2 15.4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.13C16.8003 3.35031 17.5037 3.80771 18.0098 4.46113C18.5159 5.11456 18.8004 5.92494 18.8004 6.76C18.8004 7.59506 18.5159 8.40544 18.0098 9.05887C17.5037 9.71229 16.8003 10.1697 16 10.39"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Quản lý người dùng
          </button>
          <button
            className={`tab-trigger ${activeTab === "coaches" ? "active" : ""}`}
            onClick={() => setActiveTab("coaches")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Danh sách huấn luyện viên
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <div className="overview-grid">
              {/* Field Owners Section */}
              <div className="management-card">
                <div className="management-header">
                  <div className="header-info">
                    <h3>Danh sách chủ sân</h3>
                    <p>Quản lý tất cả chủ sân trong hệ thống</p>
                  </div>
                </div>
                <div className="management-content">
                  <div className="search-container">
                    <svg
                      className="search-icon"
                      width="20"
                      height="20"
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
                    <input
                      type="text"
                      placeholder="Tìm kiếm chủ sân..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  {ownersLoading || sportsLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>
                        {ownersLoading && sportsLoading
                          ? "Đang tải danh sách chủ sân và khu thể thao..."
                          : ownersLoading
                          ? "Đang tải danh sách chủ sân..."
                          : "Đang tải danh sách khu thể thao..."}
                      </p>
                    </div>
                  ) : (
                    <div className="field-owners-list">
                      {filteredFieldOwners.slice(0, 3).map((owner) => {
                        const sportsCount = getSportsCountByOwner(owner.id);
                        const ownerSports = ownerSportsMap[owner.id] || [];

                        return (
                          <div
                            key={owner.id}
                            className="field-owner-item"
                            onClick={() => navigate(`/ownerDetail/${owner.id}`)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="field-owner-info">
                              <div className="field-owner-avatar">
                                {owner.avatarUrl ? (
                                  <img
                                    src={owner.avatarUrl || "/placeholder.svg"}
                                    alt={owner.fullName || owner.name}
                                    className="avatar-image"
                                  />
                                ) : (
                                  getInitials(owner.fullName || owner.name)
                                )}
                              </div>
                              <div className="field-owner-details">
                                <h4 className="field-owner-name">
                                  {owner.fullName || owner.name}
                                </h4>
                                <p className="field-name">
                                  {owner.fieldName ||
                                    owner.businessName ||
                                    "Chưa có tên sân"}
                                </p>
                                <div className="field-owner-contact">
                                  <span className="contact-item">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <polyline
                                        points="22,6 12,13 2,6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    {owner.email}
                                  </span>
                                  <span className="contact-item">
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
                                    {owner.address || "Chưa có địa chỉ"}
                                  </span>
                                </div>
                                <div className="field-owner-meta">
                                  <span
                                    className={`status-badge ${
                                      owner.status === "Active" ||
                                      owner.status === "active"
                                        ? "active"
                                        : "inactive"
                                    }`}
                                  >
                                    {owner.status === "Active" ||
                                    owner.status === "active"
                                      ? "Hoạt động"
                                      : "Không hoạt động"}
                                  </span>
                                  <span className="field-count-badge">
                                    {sportsCount} khu thể thao
                                  </span>
                                  {/* Show sports complex names if available */}
                                  {ownerSports.length > 0 && (
                                    <div
                                      className="sports-list"
                                      style={{
                                        fontSize: "12px",
                                        color: "#666",
                                        marginTop: "4px",
                                      }}
                                    >
                                      {ownerSports
                                        .slice(0, 2)
                                        .map((sport, index) => (
                                          <span
                                            key={index}
                                            style={{ marginRight: "8px" }}
                                          >
                                            •{" "}
                                            {sport.name ||
                                              sport.title ||
                                              `Khu ${index + 1}`}
                                          </span>
                                        ))}
                                      {ownerSports.length > 2 && (
                                        <span>
                                          và {ownerSports.length - 2} khu
                                          khác...
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="user-actions">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 18L15 12L9 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                      {filteredFieldOwners.length === 0 && !ownersLoading && (
                        <div className="empty-state">
                          <p>Không tìm thấy chủ sân nào.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="tab-content">
            <div className="management-card">
              <div className="management-header">
                <div className="header-info">
                  <h3>Danh sách người dùng</h3>
                  <p>Quản lý tất cả người dùng trong hệ thống</p>
                </div>
              </div>
              <div className="management-content">
                <div className="search-container">
                  <svg
                    className="search-icon"
                    width="20"
                    height="20"
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
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <div className="users-list">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="user-item"
                        onClick={() => navigate(`/userDetail/${user.id}`)}
                      >
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl || "/placeholder.svg"}
                                alt="avatar"
                                className="avatar-image"
                              />
                            ) : (
                              getInitials(user.fullName)
                            )}
                          </div>
                          <div className="user-details">
                            <h4 className="user-name">{user.fullName}</h4>
                            <div className="user-contact">
                              <span className="contact-item">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <polyline
                                    points="22,6 12,13 2,6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {user.email}
                              </span>
                              <span className="contact-item">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06544 2.16708 8.43945 2.48353C8.81346 2.79999 9.06681 3.23945 9.15999 3.72C9.33657 4.68007 9.63248 5.61273 10.04 6.5C10.2 6.89 10.24 7.33 10.16 7.75L8.89999 9.01C10.3357 11.4135 12.4864 13.5642 14.89 15L16.15 13.74C16.57 13.66 17.01 13.7 17.4 13.86C18.2873 14.2675 19.2199 14.5634 20.18 14.74C20.6657 14.8336 21.1093 15.0904 21.4271 15.4706C21.7449 15.8507 21.9156 16.3288 21.91 16.82L22 16.92Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {user.phoneNumber}
                              </span>
                            </div>
                            <div className="user-meta">
                              <span
                                className={`status-badge ${
                                  user.status === "Active"
                                    ? "active"
                                    : "inactive"
                                }`}
                              >
                                {user.status === "Active"
                                  ? "Hoạt động"
                                  : "Không hoạt động"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="user-actions">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Coaches Tab */}
        {activeTab === "coaches" && (
          <div className="tab-content">
            <div className="management-card">
              <div className="management-header">
                <div className="header-info">
                  <h3>Danh sách huấn luyện viên</h3>
                  <p>Quản lý tất cả huấn luyện viên trong hệ thống</p>
                </div>
              </div>
              <div className="management-content">
                <div className="search-container">
                  <svg
                    className="search-icon"
                    width="20"
                    height="20"
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
                  <input
                    type="text"
                    placeholder="Tìm kiếm huấn luyện viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                {coachesLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu huấn luyện viên...</p>
                  </div>
                ) : (
                  <div className="trainers-list">
                    {filteredCoaches.map((coach) => (
                      <div
                        key={coach.id}
                        className="trainer-item"
                        onClick={() => navigate(`/coachDetail/${coach.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="trainer-info">
                          <div className="trainer-avatar">
                            {coach.avatarUrl ? (
                              <img
                                src={coach.avatarUrl || "/placeholder.svg"}
                                alt={coach.fullName || coach.name}
                                className="avatar-image"
                              />
                            ) : (
                              getInitials(coach.fullName || coach.name)
                            )}
                          </div>
                          <div className="trainer-details">
                            <h4 className="trainer-name">
                              {coach.fullName || coach.name}
                            </h4>
                            <p className="trainer-specialty">
                              {coach.specialty ||
                                coach.specialization ||
                                "Chưa có chuyên môn"}
                            </p>
                            <div className="trainer-contact">
                              <span className="contact-item">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <polyline
                                    points="22,6 12,13 2,6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {coach.email}
                              </span>
                              <span className="contact-item">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06544 2.16708 8.43945 2.48353C8.81346 2.79999 9.06681 3.23945 9.15999 3.72C9.33657 4.68007 9.63248 5.61273 10.04 6.5C10.2 6.89 10.24 7.33 10.16 7.75L8.89999 9.01C10.3357 11.4135 12.4864 13.5642 14.89 15L16.15 13.74C16.57 13.66 17.01 13.7 17.4 13.86C18.2873 14.2675 19.2199 14.5634 20.18 14.74C20.6657 14.8336 21.1093 15.0904 21.4271 15.4706C21.7449 15.8507 21.9156 16.3288 21.91 16.82L22 16.92Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {coach.phone ||
                                  coach.phoneNumber ||
                                  "Chưa có SĐT"}
                              </span>
                            </div>
                            <div className="trainer-meta">
                              <span
                                className={`status-badge ${
                                  coach.status === "active" ||
                                  coach.status === "Active"
                                    ? "active"
                                    : "inactive"
                                }`}
                              >
                                {coach.status === "active" ||
                                coach.status === "Active"
                                  ? "Hoạt động"
                                  : "Không hoạt động"}
                              </span>
                              {coach.experience && (
                                <span className="experience-badge">
                                  {coach.experience}
                                </span>
                              )}
                              {coach.certification && (
                                <span className="certification-badge">
                                  {coach.certification}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="user-actions">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                    {filteredCoaches.length === 0 && !coachesLoading && (
                      <div className="empty-state">
                        <p>Không tìm thấy huấn luyện viên nào.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
