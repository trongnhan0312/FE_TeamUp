import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createVnPayUrl } from "../../../services/ownerService";
import "./style.scss";
import { getUserInfo } from "../../../utils/auth";

export default function OwnerPackage() {
  const location = useLocation();
  const currentPackage = location.state?.currentPackage || "";

  const [loading, setLoading] = useState(false);

  // Lấy user info 1 lần khi component render
  const userInfo = getUserInfo();
  const userId = userInfo?.id || null; // lấy id người dùng hoặc null nếu chưa có

  const handleRegister = async (packageId) => {
    if (!userId) {
      alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    try {
      setLoading(true);
      const paymentUrl = await createVnPayUrl({
        userId,
        courtBookingId: null,
        coachBookingId: null,
        packageId,
      });

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Không nhận được link thanh toán");
      }
    } catch (error) {
      alert("Lỗi khi tạo URL thanh toán, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="package-wrapper">
      <h2 className="title-owner">Owner</h2>
      <div className="packages">
        {/* Gói Basic luôn hiển thị */}
        <div className="package basic">
          <h3 className="package-title">Basic</h3>
          <div className="price">
            399,000 VND x 1 months
            <br />
            <span className="free-text">(Free 15 days)</span>
          </div>
          <div className="automatic-payment">automatic payment</div>
          <div className="subtitle">Basic features and:</div>
          <ul className="feature-list" style={{ marginBottom: "71px" }}>
            <li>✓ Revenue Management,</li>
            <li>✓ Revenue Performance Tracking</li>
            <li>✓ Data storage up to 1 years</li>
            <li>✓ Booking limit 100 slot / 1 day</li>
          </ul>
          <button
            className="btn-register"
            disabled={loading || currentPackage === "Basic"}
            onClick={() => handleRegister(1)} // 1 là packageId Basic
          >
            {currentPackage === "Basic"
              ? "Already"
              : loading
              ? "Đang xử lý..."
              : "REGISTER"}
          </button>
        </div>

        {/* Gói Premium luôn hiển thị */}
        <div className="package premium">
          <h3 className="package-title">Premium</h3>
          <div className="price">
            599,000 VND x 1 months
            <br />
            <span className="free-text">(Free 30 days)</span>
          </div>
          <div className="automatic-payment">automatic payment</div>
          <div className="subtitle">Basic features and:</div>
          <ul className="feature-list">
            <li>✓ Revenue Management,</li>
            <li>✓ Revenue Performance Tracking</li>
            <li>✓ Suggest sports field booking schedule</li>
            <li>✓ Data storage up to 3 years</li>
            <li>✓ Booking unlimited</li>
          </ul>
          <button
            className="btn-register"
            disabled={loading}
            onClick={() => handleRegister(2)} // 2 là packageId Premium
          >
            <div>{loading ? "Đang xử lý..." : "REGISTER"}</div>
          </button>
        </div>
      </div>
    </div>
  );
}
