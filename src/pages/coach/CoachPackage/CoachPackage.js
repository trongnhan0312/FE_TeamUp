import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createPayOSUrl } from "../../../services/ownerService";
import "./style.scss";
import { getUserInfo } from "../../../utils/auth";

export default function Package() {
  const location = useLocation();
  const currentPackage = location.state?.currentPackage || "";

  const [loading, setLoading] = useState(false);

  // Lấy user info 1 lần khi component render
  const userInfo = getUserInfo();
  const userId = userInfo?.id || null;

  const handleRegister = async (packageId) => {
    if (!userId) {
      alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    try {
      setLoading(true);
      const paymentUrl = await createPayOSUrl({
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
      <h2 className="title-owner">Coach</h2>
      <div className="packages">
        <div className="package basic">
          <h3 className="package-title">Basic</h3>
          <div className="price">
            159,000 VND x 1 months
            <br />
            <span className="free-text">(Free 15 days)</span>
          </div>
          <div className="automatic-payment">automatic payment</div>
          <div className="subtitle">Basic features and:</div>
          <ul className="feature-list">
            <li>✓ Manage Training Schedule</li>
            <li>✓ Track Student Review</li>
            <li>✓ Revenue Performance Tracking</li>
          </ul>
          <button
            className="btn-register"
            disabled={loading || currentPackage === "Basic"}
            onClick={() => handleRegister(3)} // 1 là packageId Basic
          >
            {currentPackage === "Basic"
              ? "Already"
              : loading
              ? "Đang xử lý..."
              : "REGISTER"}
          </button>
        </div>
      </div>
    </div>
  );
}
