import React from "react";
import "./style.scss";
import logo from "../../../../../assets/admin/logo.png"; // Import logo
import { Link } from "react-router-dom";
import { ROUTER } from "../../../../../utils/router";

const footerCoach = () => {
  return (
    <div className="footer_coach">
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
                <li>
                  <Link to="/home">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/about-us">Về chúng tôi</Link>
                </li>
              </ul>
            </div>

            {/* Cột 3 - Hỗ trợ khách hàng */}
            <div className="footer_right">
              <div className="footer_title">Hỗ trợ khách hàng</div>
              <ul className="footer_list">
                <li>
                  <Link to="/support-center">Trung tâm hỗ trợ khách hàng</Link>
                </li>

                <li>
                  <Link to="/privacy-policy">Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link to="https://qhdn-hcmuni.fpt.edu.vn/2025/04/14/teamup-cham-la-choi-dua-dam-me-the-thao-den-gan-ban-hon-bao-gio-het/">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 4 - Liên hệ */}
            <div className="footer_contact">
              <div className="footer_title">Liên hệ với chúng tôi</div>
              <ul className="footer_list">
                <li>0941.616.499</li>
                <li>teamupsystemfpt@gmail.com</li>
                <li>7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default footerCoach;
