import React, { useState } from "react";
import { FaMapMarkerAlt, FaHeart, FaShare, FaStar } from "react-icons/fa";
import "./CourtDetailPage.scss";
import { memo } from "react";
import loginImg from "../../../../assets/user/register.png";
import AvailableCourts from "./AvailableCourts";
import CourtReviews from "./CourtReviews";

const CourtDetailPage = () => {
  const [isLiked, setIsLiked] = useState(false);

  const courtImages = [loginImg, loginImg, loginImg, loginImg, loginImg];

  // Rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < rating ? "star filled" : "star"} />
      );
    }
    return stars;
  };

  return (
    <div className="court-detail-page">
      <div className="container">
        {/* Court title and rating section */}
        <div className="court-header">
          <h1 className="court-title">Sân cầu lông Tre Xanh</h1>
          <div className="rating-container">{renderRatingStars(5)}</div>
        </div>

        {/* Court address */}
        <div className="court-address">
          <FaMapMarkerAlt className="icon-marker" />
          <span>50/3 Xô Viết Nghệ Tĩnh, Phường 27, Quận Bình Thạnh</span>
        </div>

        {/* Rating score */}
        <div className="rating-score-section">
          <div className="rating-badge">4.2</div>
          <div className="rating-text">Rất tốt 371 đánh giá</div>

          <div className="action-buttons">
            <button
              className={`btn-like ${isLiked ? "liked" : ""}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <FaHeart />
            </button>
            <button className="btn-share">
              <FaShare />
            </button>
          </div>
        </div>

        {/* Court Images Gallery */}
        <div className="court-gallery">
          <div className="main-image">
            <img src={courtImages[0]} alt="Sân cầu lông Tre Xanh" />
          </div>
          <div className="gallery-grid">
            {courtImages.slice(1, 5).map((image, index) => (
              <div className="gallery-item" key={index}>
                <img src={image} alt={`Sân cầu lông Tre Xanh ${index + 1}`} />
              </div>
            ))}
          </div>
          <button className="btn-view-more">Xem thêm</button>
        </div>

        {/* Price section */}
        <div className="price-section">
          <div className="price">
            <span className="amount">50,000VNĐ</span>
            <span className="unit">/giờ</span>
          </div>
          <div className="booking-actions">
            <button className="btn-book">Đặt sân</button>
            <button className="btn-create-room">Tạo phòng</button>
          </div>
        </div>

        {/* Court Description */}
        <div className="court-description">
          <h2>Mô tả</h2>
          <div className="description-content">
            <p>Sân cầu lông Tre Xanh:</p>
            <ul>
              <li>
                Địa chỉ: 50/3 Xô Viết Nghệ Tĩnh, Phường 27, Quận Bình Thạnh,
                TP.HCM.
              </li>
              <li>Số lượng sân: 2 sân với thảm PVC chuyên dụng.</li>
              <li>Giá thuê: 50.000 – 80.000 VNĐ/giờ.</li>
              <li>Giờ hoạt động: 5h – 23h.</li>
            </ul>
          </div>
        </div>

        {/* <div className="court-description">
                    <h2>Tiện ích</h2>
                    <div className="description-content">
                        <p>Sân cầu lông Tre Xanh:</p>
                        <ul>
                            <li>
                                Địa chỉ: 50/3 Xô Viết Nghệ Tĩnh, Phường 27, Quận
                                Bình Thạnh, TP.HCM.
                            </li>
                            <li>
                                Số lượng sân: 2 sân với thảm PVC chuyên dụng.
                            </li>
                            <li>Giá thuê: 50.000 – 80.000 VNĐ/giờ.</li>
                            <li>Giờ hoạt động: 5h – 23h.</li>
                        </ul>
                    </div>
                </div> */}

        {/* Available Courts Section */}
        <AvailableCourts
          courts={[
            {
              image: loginImg,
              name: "Sân cầu lông số 1",
              price: 20000,
            },
            {
              image: loginImg,
              name: "Sân cầu lông số 2",
              price: 20000,
            },
            {
              image: loginImg,
              name: "Sân cầu lông số 3",
              price: 20000,
            },
          ]}
        />
        {/* Reviews Section */}
        <CourtReviews rating={4.2} totalReviews={371} />
      </div>
    </div>
  );
};

export default memo(CourtDetailPage);
