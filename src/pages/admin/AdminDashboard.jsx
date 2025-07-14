import React from "react";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>👑 Admin Dashboard</h1>
      <p>Chào mừng bạn đến với trang quản trị.</p>

      <div className="stats">
        <h2>Thống kê nhanh</h2>
        <ul>
          <li>Người dùng: 1500</li>
          <li>Đơn đặt sân: 320</li>
          <li>Báo cáo chưa xử lý: 12</li>
        </ul>
      </div>

      <div className="actions">
        <h2>Hành động nhanh</h2>
        <button>Quản lý người dùng</button>
        <button>Báo cáo & Thống kê</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
