import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.scss";

const CRMCoach = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const crmData = location.state?.crmData;

    if (!crmData) {
      toast.error("Không có dữ liệu CRM.");
      navigate("/coach");
      return;
    }

    const data = crmData.resultObj ?? crmData;

    setCustomerData(data);
    setFilteredBookings(data.bookingHistory);
  }, [location.state, navigate]);

  useEffect(() => {
    if (!customerData) return;

    let filtered = customerData.bookingHistory;

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.courtName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.sportsComplexName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [statusFilter, searchTerm, customerData]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { className: "badge-secondary", label: "Chờ xử lý" },
      CancelledByUser: { className: "badge-danger", label: "Đã hủy" },
      Completed: { className: "badge-success", label: "Hoàn thành" },
      Confirmed: { className: "badge-primary", label: "Đã xác nhận" },
    };

    const config = statusConfig[status] || {
      className: "badge-secondary",
      label: status,
    };
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const handleExportReport = () => {
    const csvContent = [
      [
        "Mã đặt sân",
        "Sân",
        "Khu thể thao",
        "Thời gian",
        "Giá tiền",
        "Trạng thái",
        "Thanh toán",
        "Ghi chú",
      ],
      ...filteredBookings.map((booking) => [
        booking.bookingId,
        booking.courtName,
        booking.sportsComplexName,
        booking.slotTimes.join(" | "),
        booking.totalPrice,
        booking.status,
        booking.paymentStatus,
        booking.note || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const BOM = "\uFEFF"; // Byte Order Mark cho UTF-8
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!customerData) {
    return <div className="crm-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="crm-container-coach">
      <div className="crm-header">
        <div className="crm-header-content">
          <h1 className="crm-title">Quản lý khách hàng</h1>
          <div className="crm-actions">
            <button className="btn btn-outline" onClick={handleExportReport}>
              <span className="icon">📊</span>
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Customer Overview */}
      <div className="crm-overview">
        <div className="cards customer-profile">
          <div className="cards-header">
            <div className="customer-header">
              <div className="customer-avatar">
                <span className="avatar-text">
                  {customerData?.playerName
                    ? customerData.playerName.charAt(0)
                    : "?"}
                </span>
              </div>
              <div className="customer-info">
                <h3 className="customer-name">{customerData.playerName}</h3>
                <div className="customer-category">
                  <span className="badge badge-outline">
                    {customerData.customerCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="cards-content">
            <div className="customer-details">
              <div className="detail-item">
                <span className="icon">📧</span>
                <span>{customerData.email}</span>
              </div>
              {customerData.phoneNumber && (
                <div className="detail-item">
                  <span className="icon">📞</span>
                  <span>{customerData.phoneNumber}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="icon">👤</span>
                <span>ID: {customerData.playerId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="cards stat-cards">
            <div className="cards-header stat-header">
              <h4 className="stat-title">Tổng đặt sân</h4>
              <span className="stat-icon">📅</span>
            </div>
            <div className="cards-content">
              <div className="stat-value">{customerData.totalBookings}</div>
              <p className="stat-description">Lượt đặt sân</p>
            </div>
          </div>

          <div className="cards stat-cards">
            <div className="cards-header stat-header">
              <h4 className="stat-title">Tổng chi tiêu</h4>
              <span className="stat-icon">💰</span>
            </div>
            <div className="cards-content">
              <div className="stat-value">
                {formatCurrency(customerData.totalSpent)}
              </div>
              <p className="stat-description">Tổng số tiền đã chi</p>
            </div>
          </div>

          <div className="cards stat-cards">
            <div className="cards-header stat-header">
              <h4 className="stat-title">Thời gian ưa thích</h4>
              <span className="stat-icon">🕐</span>
            </div>
            <div className="cards-content">
              <div className="time-distribution">
                {customerData.bookingTimeDistribution.map((time, index) => (
                  <div key={index} className="time-item">
                    <span className="time-label">{time.timeRangeLabel}</span>
                    <span className="badge badge-secondary">
                      {time.count} lần
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History */}
      <div className="cards booking-history">
        <div className="cards-header">
          <div className="booking-header">
            <div>
              <h3 className="cards-title">Lịch sử đặt sân</h3>
              <p className="cards-description">
                Danh sách tất cả các lần đặt sân của khách hàng
              </p>
            </div>
            <div className="booking-filters">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm sân, khu thể thao..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="CancelledByUser">Đã hủy</option>
                <option value="Completed">Hoàn thành</option>
              </select>
            </div>
          </div>
        </div>
        <div className="cards-content">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã đặt sân</th>
                  <th>Sân</th>
                  <th>Khu thể thao</th>
                  <th>Thời gian</th>
                  <th>Giá tiền</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="booking-row">
                    <td className="booking-id">#{booking.bookingId}</td>
                    <td>{booking.courtName}</td>
                    <td>{booking.sportsComplexName}</td>
                    <td>
                      {booking.slotTimes?.map((slot, idx) => (
                        <div key={idx}>{slot}</div>
                      ))}
                    </td>
                    <td>{formatCurrency(booking.totalPrice)}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      <div className="payment-info">
                        <span className="badge badge-outline">
                          {booking.paymentMethod}
                        </span>
                        <span
                          className={`badge ${
                            booking.paymentStatus === "Paid"
                              ? "badge-success"
                              : "badge-secondary"
                          }`}
                        >
                          {booking.paymentStatus === "Paid"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </span>
                      </div>
                    </td>
                    <td>{booking.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMCoach;
