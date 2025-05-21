import { memo, useState } from "react";
import "./style.scss";
const reviews = [
  {
    id: "#C01234",
    name: "Louis Jean",
    date: "26/04/2020, 12:42 AM",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rating: 4.2,
  },
  // Có thể lặp lại nhiều phần tử tương tự
];

const ReviewCoach = () => {
  const [filter, setFilter] = useState("Mới nhất");
  return (
    <div className="review-yard-container">
      <div className="header">
        <h2>Đánh giá</h2>
        <div className="search-and-filter">
          <input type="search" placeholder="Tìm kiếm ..." />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="statusFilter"
          >
            <option>Mới nhất</option>
            <option>Cũ nhất</option>
            <option>Xác nhận</option>
          </select>
        </div>
      </div>
      <div className="review-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <div className="checkbox-wrapper">
              <input type="checkbox" />
            </div>
            <div className="avatar"></div>
            <div className="info">
              <p className="id">{review.id}</p>
              <p className="name">{review.name}</p>
              <p className="date">{review.date}</p>
            </div>
            <div className="content">{review.content}</div>
            <div className="rating-wrapper">
              <div className="rating-value">{review.rating}</div>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {/* Lặp lại để giống mẫu */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="review-item">
            <div className="checkbox-wrapper">
              <input type="checkbox" />
            </div>
            <div className="avatar"></div>
            <div className="info">
              <p className="id">#C01234</p>
              <p className="name">Louis Jean</p>
              <p className="date">26/04/2020, 12:42 AM</p>
            </div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </div>
            <div className="rating-wrapper">
              <div className="rating-value">4.2</div>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ReviewCoach);
