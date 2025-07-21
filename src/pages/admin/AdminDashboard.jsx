"use client";

import { useState } from "react";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for users
  const mockUsers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0123456789",
      status: "active",
      joinDate: "2024-01-15",
      bookings: 12,
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@email.com",
      phone: "0987654321",
      status: "active",
      joinDate: "2024-02-20",
      bookings: 8,
    },
    {
      id: 3,
      name: "Lê Hoàng Cường",
      email: "cuong.le@email.com",
      phone: "0456789123",
      status: "inactive",
      joinDate: "2024-03-10",
      bookings: 3,
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung.pham@email.com",
      phone: "0789123456",
      status: "active",
      joinDate: "2024-01-05",
      bookings: 15,
    },
  ];

  // Mock data for employees
  const mockEmployees = [
    {
      id: 1,
      name: "Võ Minh Tuấn",
      email: "tuan.vo@company.com",
      phone: "0123456789",
      position: "Quản lý sân",
      department: "Vận hành",
      status: "active",
      hireDate: "2023-06-15",
    },
    {
      id: 2,
      name: "Đặng Thị Lan",
      email: "lan.dang@company.com",
      phone: "0987654321",
      position: "Nhân viên lễ tân",
      department: "Dịch vụ khách hàng",
      status: "active",
      hireDate: "2023-08-20",
    },
    {
      id: 3,
      name: "Hoàng Văn Nam",
      email: "nam.hoang@company.com",
      phone: "0456789123",
      position: "Kỹ thuật viên",
      department: "Bảo trì",
      status: "active",
      hireDate: "2023-09-10",
    },
    {
      id: 4,
      name: "Ngô Thị Hoa",
      email: "hoa.ngo@company.com",
      phone: "0789123456",
      position: "Kế toán",
      department: "Tài chính",
      status: "inactive",
      hireDate: "2023-05-01",
    },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmployees = mockEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>
            <span className="crown-icon">👑</span>
            Admin Dashboard
          </h1>
          <p>Chào mừng bạn đến với trang quản trị</p>
        </div>
        <button className="add-button">
          <span className="plus-icon">+</span>
          Thêm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Tổng người dùng</span>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">1,500</div>
            <p className="stat-description">+12% từ tháng trước</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Nhân viên</span>
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">45</div>
            <p className="stat-description">+2 nhân viên mới</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Đơn đặt sân</span>
            <span className="stat-icon">📅</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">320</div>
            <p className="stat-description">+8% từ tuần trước</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Báo cáo chưa xử lý</span>
            <span className="stat-icon">⚠️</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">12</div>
            <p className="stat-description">Cần xử lý ngay</p>
          </div>
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
            Tổng quan
          </button>
          <button
            className={`tab-trigger ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Quản lý người dùng
          </button>
          <button
            className={`tab-trigger ${
              activeTab === "employees" ? "active" : ""
            }`}
            onClick={() => setActiveTab("employees")}
          >
            Quản lý nhân viên
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="quick-actions-card">
                <div className="card-header">
                  <h3>Hành động nhanh</h3>
                  <p>Các tác vụ thường dùng</p>
                </div>
                <div className="card-content">
                  <button className="action-button">
                    <span className="action-icon">👥</span>
                    Quản lý người dùng
                  </button>
                  <button className="action-button">
                    <span className="action-icon">✅</span>
                    Quản lý nhân viên
                  </button>
                  <button className="action-button">
                    <span className="action-icon">📊</span>
                    Báo cáo & Thống kê
                  </button>
                </div>
              </div>

              <div className="recent-activity-card">
                <div className="card-header">
                  <h3>Hoạt động gần đây</h3>
                  <p>Các hoạt động mới nhất trong hệ thống</p>
                </div>
                <div className="card-content">
                  <div className="activity-item">
                    <div className="activity-avatar">NA</div>
                    <div className="activity-content">
                      <p className="activity-text">Nguyễn Văn An đã đặt sân</p>
                      <p className="activity-time">2 phút trước</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-avatar">TB</div>
                    <div className="activity-content">
                      <p className="activity-text">
                        Trần Thị Bình đã hủy đặt sân
                      </p>
                      <p className="activity-time">5 phút trước</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-avatar">LC</div>
                    <div className="activity-content">
                      <p className="activity-text">
                        Lê Hoàng Cường đã đăng ký tài khoản
                      </p>
                      <p className="activity-time">10 phút trước</p>
                    </div>
                  </div>
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
                <button className="add-button">
                  <span className="plus-icon">+</span>
                  Thêm người dùng
                </button>
              </div>
              <div className="management-content">
                <div className="search-container">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="users-list">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="user-item">
                      <div className="user-info">
                        <div className="user-avatar">
                          {getInitials(user.name)}
                        </div>
                        <div className="user-details">
                          <h4 className="user-name">{user.name}</h4>
                          <div className="user-contact">
                            <span className="contact-item">
                              <span className="contact-icon">📧</span>
                              {user.email}
                            </span>
                            <span className="contact-item">
                              <span className="contact-icon">📞</span>
                              {user.phone}
                            </span>
                          </div>
                          <div className="user-meta">
                            <span className={`status-badge ${user.status}`}>
                              {user.status === "active"
                                ? "Hoạt động"
                                : "Không hoạt động"}
                            </span>
                            <span className="booking-count">
                              {user.bookings} đơn đặt sân
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="user-actions">
                        <button className="action-btn edit-btn">✏️</button>
                        <button className="action-btn delete-btn">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="tab-content">
            <div className="management-card">
              <div className="management-header">
                <div className="header-info">
                  <h3>Danh sách nhân viên</h3>
                  <p>Quản lý tất cả nhân viên trong công ty</p>
                </div>
                <button className="add-button">
                  <span className="plus-icon">+</span>
                  Thêm nhân viên
                </button>
              </div>
              <div className="management-content">
                <div className="search-container">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="employees-list">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="employee-item">
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {getInitials(employee.name)}
                        </div>
                        <div className="employee-details">
                          <h4 className="employee-name">{employee.name}</h4>
                          <p className="employee-position">
                            {employee.position}
                          </p>
                          <div className="employee-contact">
                            <span className="contact-item">
                              <span className="contact-icon">📧</span>
                              {employee.email}
                            </span>
                            <span className="contact-item">
                              <span className="contact-icon">📞</span>
                              {employee.phone}
                            </span>
                          </div>
                          <div className="employee-meta">
                            <span className={`status-badge ${employee.status}`}>
                              {employee.status === "active"
                                ? "Hoạt động"
                                : "Không hoạt động"}
                            </span>
                            <span className="department-badge">
                              {employee.department}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="employee-actions">
                        <button className="action-btn edit-btn">✏️</button>
                        <button className="action-btn delete-btn">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
