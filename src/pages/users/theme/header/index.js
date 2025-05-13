import { memo } from "react";
import "./style.scss";
import { BsChat, BsCart3, BsHeart, BsBell } from "react-icons/bs";
import logo from "../../../../assets/admin/logo.png";

const header = () => {
  return (
    <>
      <div className="header_top">
        <div className="container">
          <div className="header_wrapper">
            <div className="header_left">
              <div className="logo">
                <img src={logo} alt="Logo" className="logo_img" />
                <span className="logo_text">TeamUp</span>
              </div>
              <ul className="menu">
                <li>Trang chủ</li>
                <li>Tìm sân</li>
                <li>Tìm bạn chơi</li>
                <li>Bản đồ</li>
                <li>Blog</li>
                <li>HLV</li>
              </ul>
            </div>

            <div className="header_right">
              <ul className="icons">
                <li>
                  <BsChat />
                </li>
                <li>
                  <BsCart3 />
                </li>
                <li>
                  <BsHeart />
                </li>
                <li>
                  <BsBell />
                </li>
              </ul>
              <div className="user">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Avatar"
                  className="avatar"
                />
                <span className="username">Nguyễn Văn Tèo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3"></div>
      </div>
    </>
  );
};

export default memo(header);
