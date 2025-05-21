import { memo, useState } from "react";
import "./style.scss";

const CreateYard = () => {
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
          consectetur vitae tellus. Sed tellus elit enim suscipit penatibus eget
          risus. Et suspendisse donec ut et mi ultricies elit eget port. Arcu
          tellus la commodo ullamcorper tincidunt venenatis lectus dui. In dolor
          mi. Imperdiet fermentum faucibus eget sed consequat. Risus malesuada
          pellentesque morbi suspendisse ultricies pulvinar mollis. Massa et
          ligula pellentesque dictum sit interdum malesuada phastra. Vivamus est
          turpis donec facilisi placerat sed. Tristique orci diam mi orci vitae
          id quam tellus tellus. Nunc netus tristique gravida libero morbi lorem
          dictum. A tortor neque aenean ultrices. Sed bibendum faucibus fames
          diam ornare at. Tristique consequat cursus tortor in mattis feugiat
          iaculis pellentesque.
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
        <div className="location-title">Địa điểm</div>
        <div className="location-map placeholder"></div>
        <div className="location-desc">
          <i className="location-icon">📍</i>
          <span>Lorem ipsum dolor sit amet consectetur. Lectus.</span>
        </div>
      </div>
    </div>
  );
};

export default memo(CreateYard);
