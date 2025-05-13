import { memo } from "react";
import "./style.scss";
import banner from "/TeamUp/FE_TeamUp/src/assets/admin/banner.png";
import bongda from "/TeamUp/FE_TeamUp/src/assets/admin/bongda.png";
import pickleball from "/TeamUp/FE_TeamUp/src/assets/admin/pickleball.png";
import cauLong from "/TeamUp/FE_TeamUp/src/assets/admin/caulong.png";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="content_wrapper">
        {/* Cột bên trái - hình ảnh */}
        <div className="bg">
          <div className="left_column">
            <img src={banner} alt="Logo" className="banner_image" />
          </div>

          {/* Cột bên phải - thông tin */}
          <div className="right_column">
            <h1>Sân cầu lông Bình Lợi</h1>
            <div className="rating">
              <span>Đặt sân</span>
              <span className="star">⭐ 4.9 </span>
              <span>đánh giá</span>
            </div>
            <button className="booking_button">Đặt sân</button>
          </div>
        </div>
      </div>

      {/* Các trường tìm kiếm */}
      <div className="search_wrapper">
        <div className="search_filters">
          <div className="filter">
            <span>Địa điểm</span>
          </div>
          <div className="filter">
            <span>Ngày tháng</span>
          </div>
          <div className="filter">
            <span>Khung giờ</span>
          </div>
          <button className="search_button">Tìm</button>
        </div>
      </div>

      {/* Các môn */}
      <div className="cards_section">
        <a href="#" className="card card-pickleball">
          <img src={pickleball} alt="Pickleball" className="card_image" />
          <div className="card_content">
            <h2>Pickleball</h2>
            <div className="card_button">
              <BsArrowUpRightCircleFill />
              Tìm hiểu thêm
            </div>
          </div>
        </a>

        <a href="#" className="card card-bongda">
          <img src={bongda} alt="Bóng đá" className="card_image" />
          <div className="card_content">
            <h2>Bóng đá</h2>
            <div className="card_button">
              <BsArrowUpRightCircleFill />
              Tìm hiểu thêm
            </div>
          </div>
        </a>

        <a href="#" className="card card-caulong">
          <img src={cauLong} alt="Cầu lông" className="card_image" />
          <div className="card_content">
            <h2>Cầu lông</h2>
            <div className="card_button">
              <BsArrowUpRightCircleFill />
              Tìm hiểu thêm
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default memo(HomePage);
