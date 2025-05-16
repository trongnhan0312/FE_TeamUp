import React from "react";
import "./style.scss";
import logo from "../../../../../assets/admin/logo.png"; // Import logo
import { Link } from "react-router-dom";
import { ROUTER } from "../../../../../utils/router";

const footerOwner = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="footer_wrapper">
          {/* Cột 1 - Logo và đăng ký */}
          <div className="footer_left">
            <div className="footer_logo">
              <img src={logo} alt="Logo" className="footer_logo_img" />
              <span className="footer_logo_text">TeamUp</span>
            </div>
            <div className="footer_signup">
              <input type="email" placeholder="Địa chỉ email..." />
              <button>
                <Link to={ROUTER.AUTH.REGISTER}>Đăng ký ngay</Link>
              </button>
            </div>
          </div>

          {/* Cột 2 - Thông tin công ty */}
          <div className="footer_center">
            <div className="footer_title">Công ty</div>
            <ul className="footer_list">
              <li>Trang chủ</li>
              <li>Về chúng tôi</li>
              <li>Sản phẩm</li>
            </ul>
          </div>

          {/* Cột 3 - Hỗ trợ khách hàng */}
          <div className="footer_right">
            <div className="footer_title">Hỗ trợ khách hàng</div>
            <ul className="footer_list">
              <li>Trung tâm hỗ trợ khách hàng</li>
              <li>Hoàn tiền</li>
              <li>Chính sách bảo mật</li>
              <li>Terms of Use</li>
            </ul>
          </div>

          {/* Cột 4 - Liên hệ */}
          <div className="footer_contact">
            <div className="footer_title">Liên hệ với chúng tôi</div>
            <ul className="footer_list">
              <li>8383838383</li>
              <li>fpt.com</li>
              <li>484N Nơ Trang Long, Bình Thạnh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default footerOwner;
