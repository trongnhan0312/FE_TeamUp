import { memo, useState } from "react";
import "./style.scss";
import Map from "../../../component/map";

const CreateYard = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Tên sân");
  const [editingTitle, setEditingTitle] = useState(false);
  const formatVND = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    const formatted = formatVND(e.target.value);
    setPrice(formatted);
  };

  // Khi người dùng nhấn Enter hoặc mất focus thì ẩn input
  const handleBlur = () => {
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setEditing(false);
    }
  };
  //
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      setEditingTitle(false);
    }
  };
  const [bigImage, setBigImage] = useState(null);
  const [smallImages, setSmallImages] = useState([null, null, null, null]);

  // Xử lý khi chọn file ảnh cho big image
  const handleBigImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBigImage(URL.createObjectURL(file));
    }
  };

  // Xử lý khi chọn file ảnh cho small images (theo index)
  const handleSmallImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newSmallImages = [...smallImages];
      newSmallImages[index] = URL.createObjectURL(file);
      setSmallImages(newSmallImages);
    }
  };
  return (
    <div className="create-yard-container">
      {/* Header */}
      <div className="header">
        <div>
          {!editingTitle && (
            <span
              className="title"
              onClick={() => setEditingTitle(true)}
              style={{
                cursor: "pointer",
                padding: "4px 8px",
                display: "inline-block",
                border: "1px dashed #aaa",
              }}
              title="Nhấn để sửa tên"
            >
              {title}
            </span>
          )}
          {editingTitle && (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              style={{
                padding: "4px 8px",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            />
          )}
        </div>
        <div>
          {!editing && (
            <span
              onClick={() => setEditing(true)}
              style={{
                cursor: "pointer",
                padding: "5px",
                border: "1px solid #ccc",
              }}
              title="Nhấn để sửa giá"
            >
              {price ? `${price} VND/giờ` : "Chưa nhập giá"}
            </span>
          )}

          {editing && (
            <input
              type="text"
              value={price}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{ width: "150px" }}
              placeholder="Nhập giá tiền"
            />
          )}
        </div>
      </div>

      {/* Image section */}
      <div
        className="image-section"
        style={{
          maxWidth: 620,
          margin: "auto",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Big Image Upload */}
        <label
          className="big-image"
          style={{
            cursor: "pointer",
            display: "block",
            width: 200,
            height: 260,
            borderRadius: 12,
            border: "2px dashed #bbb",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
            position: "relative",
            transition: "border-color 0.3s ease",

            backgroundColor: "#fafafa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 48,
            color: "#ccc",
            fontWeight: "bold",
            userSelect: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#6c63ff")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#bbb")}
        >
          {bigImage ? (
            <img
              src={bigImage}
              alt="Big"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
          ) : (
            "+"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleBigImageChange}
            style={{ display: "none" }}
          />
        </label>

        {/* Small Images Upload */}
        <div
          className="small-images"
          style={{ display: "flex", gap: 16, justifyContent: "center" }}
        >
          {smallImages.map((img, index) => (
            <label
              key={index}
              className="small-image"
              style={{
                cursor: "pointer",
                width: 185,
                height: 100,
                borderRadius: 12,
                border: "2px dashed #bbb",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgb(0 0 0 / 0.08)",
                backgroundColor: "#f9f9f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                color: "#ccc",
                fontWeight: "bold",
                userSelect: "none",
                transition: "border-color 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#6c63ff")
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#bbb")}
            >
              {img ? (
                <img
                  src={img}
                  alt={`Small ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              ) : (
                "+"
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSmallImageChange(index, e)}
                style={{ display: "none" }}
              />
            </label>
          ))}
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
          {price ? `${price} VND/giờ` : "Chưa nhập giá"}
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
