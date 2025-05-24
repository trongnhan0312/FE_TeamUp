import { memo, useState } from "react";
import "./style.scss";
import Map from "../../../component/map";

const CreateYard = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  
  return (
    <div className="create-yard-container">
      {/* Header */}
      <div className="header">
        <span className="title">Tên sân</span>
        <span className="price">.................... VND/giờ</span>
      </div>

      {/* Image section */}
      <div className="image-section">
        <div className="big-image placeholder">+</div>
        <div className="small-images">
          <div className="small-image placeholder"></div>
          <div className="small-image placeholder"></div>
          <div className="small-image placeholder"></div>
        </div>
      </div>

      {/* Description */}
      <div className="description">
        <p>
          Lorem ipsum dolor sit amet consectetur. Gravida sapien facilisis
          consectetur vitae tellus...
        </p>
      </div>

      {/* Utilities & Type and Price */}
      <div className="utility-price">
        <div className="utility">
          <div className="title">Tiện ích</div>
          <div className="type-sport">
            <span className="label">Loại sân</span>
            <button className="add-btn">+</button>
          </div>
        </div>

        <div className="price-info">
          <span>.................... VND/giờ</span>
          <button className="btn-book">Đặt ngay</button>
        </div>
      </div>

      {/* Location */}
      <div className="location-section">
        {/* Bản đồ chọn vị trí */}
        <Map selectable={true} onSelect={setSelectedPosition} />

        {selectedPosition && (
          <div className="location-desc">
            <i className="location-icon">📍</i>
            <span>
              Tọa độ: {selectedPosition.latitude.toFixed(6)},{" "}
              {selectedPosition.longitude.toFixed(6)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CreateYard);
