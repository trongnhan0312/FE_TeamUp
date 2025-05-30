import { memo, useState } from "react";
import axios from "axios";
import "./style.scss";
import Map from "../../../../component/map";
import { getUserInfo } from "../../../../utils/auth";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateSportsComplexes = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(false);

  // Giá trị mặc định tên khu thể thao
  const [title, setTitle] = useState("Khu thể thao mới - Chưa đặt tên");
  const [editingTitle, setEditingTitle] = useState(false);

  const navigate = useNavigate();
  const storedOwnerInfo = getUserInfo();
  const ownerId = storedOwnerInfo?.id || storedOwnerInfo?.userId;

  const [type, setType] = useState();
  const [showTypeOptions, setShowTypeOptions] = useState(false);

  const [bigImageFile, setBigImageFile] = useState(null);
  const [bigImagePreview, setBigImagePreview] = useState(null);

  const [smallImageFiles, setSmallImageFiles] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [smallImagePreviews, setSmallImagePreviews] = useState([
    null,
    null,
    null,
    null,
  ]);

  const [loading, setLoading] = useState(false);

  // Format tiền VND có dấu phẩy
  const formatVND = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Xử lý giá tiền
  const handleChangePrice = (e) => {
    const formatted = formatVND(e.target.value);
    setPrice(formatted);
  };
  const handleBlurPrice = () => setEditing(false);
  const handleKeyDownPrice = (e) => e.key === "Enter" && setEditing(false);

  // Xử lý tên khu thể thao
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTitleBlur = () => {
    if (!title.trim()) setTitle("Khu thể thao mới"); // Nếu để trống thì reset về mặc định
    setEditingTitle(false);
  };
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!title.trim()) setTitle("Khu thể thao mới");
      setEditingTitle(false);
    }
  };

  // Khi click vào tên mặc định sẽ xoá để nhập mới
  const handleTitleFocus = () => {
    if (title === "Khu thể thao mới ") {
      setTitle("");
    }
    setEditingTitle(true);
  };

  // Xử lý ảnh lớn
  const handleBigImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBigImageFile(file);
      setBigImagePreview(URL.createObjectURL(file));
    }
  };

  // Xử lý ảnh nhỏ
  const handleSmallImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...smallImageFiles];
      newFiles[index] = file;
      setSmallImageFiles(newFiles);

      const newPreviews = [...smallImagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setSmallImagePreviews(newPreviews);
    }
  };

  const typeOptions = ["Bóng đá", "Cầu lông", "Pickleball"];
  const toggleTypeOptions = () => setShowTypeOptions((prev) => !prev);
  const selectType = (selectedType) => {
    setType(selectedType);
    setShowTypeOptions(false);
  };

  // Xử lý tạo khu thể thao gửi lên API
  const handleCreateSportsComplex = async () => {
    if (!title.trim() || title === "Khu thể thao mới") {
      toast.error("Tên khu thể thao không được để trống.");
      return;
    }
    if (!type) {
      toast.error("Loại khu thể thao không được để trống.");
      return;
    }
    if (!ownerId || isNaN(Number(ownerId))) {
      toast.error("Id của chủ sân không hợp lệ.");
      return;
    }
    if (!selectedPosition) {
      toast.error("Vui lòng chọn vị trí trên bản đồ.");
      return;
    }
    if (!bigImageFile && smallImageFiles.every((f) => !f)) {
      toast.error("Vui lòng tải lên ít nhất một hình ảnh.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("Type", type);
      formData.append("Name", title.trim());
      formData.append("Address", address || "Địa chỉ chưa xác định");
      formData.append("OwnerId", String(ownerId));
      formData.append("Latitude", selectedPosition.latitude.toString());
      formData.append("Longitude", selectedPosition.longitude.toString());

      if (bigImageFile) {
        formData.append("ImageUrls", bigImageFile);
      }
      smallImageFiles.forEach((file) => {
        if (file) {
          formData.append("ImageUrls", file);
        }
      });

      const response = await axios.post(
        "https://localhost:7286/api/sportscomplex/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.isSuccessed) {
        toast.success("Tạo khu thể thao thành công!");
        setTimeout(() => {
          navigate("/owner/sportscomplexes"); // Đường dẫn bạn muốn chuyển sau tạo thành công
        }, 1500);
      } else {
        toast.error(response.data.message || "Tạo khu thể thao thất bại");
      }
    } catch (err) {
      toast.error(
        err.response?.data || err.message || "Lỗi khi tạo khu thể thao"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-SportComplexe-container">
      {/* Header */}
      <div className="header">
        <div>
          {!editingTitle ? (
            <span
              className="title"
              onClick={handleTitleFocus}
              title="Nhấn để sửa tên"
              style={{
                cursor: "pointer",
                padding: "4px 8px",
                display: "inline-block",
                border: "1px dashed #aaa",
              }}
            >
              {title}
            </span>
          ) : (
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
              placeholder="Nhập Tên Khu Thể Thao"
            />
          )}
        </div>

        <div>
          {!editing ? (
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
          ) : (
            <input
              type="text"
              value={price}
              onChange={handleChangePrice}
              onBlur={handleBlurPrice}
              onKeyDown={handleKeyDownPrice}
              autoFocus
              style={{ width: "150px" }}
              placeholder="Nhập giá tiền"
            />
          )}
        </div>
      </div>

      {/* Image section */}
      <div className="image-section">
        <label
          className="big-image"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#6c63ff")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#bbb")}
        >
          {bigImagePreview ? (
            <img
              src={bigImagePreview}
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

        <div className="small-images">
          {smallImagePreviews.map((img, index) => (
            <label
              key={index}
              className="small-image"
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

      {/* Description
      <div className="description">
        <p>
          Lorem ipsum dolor sit amet consectetur. Gravida sapien facilisis
          consectetur vitae tellus...
        </p>
      </div> */}

      {/* Utilities & Type and Price */}
      <div className="utility-price">
        <div className="utility">
          <div className="title">Tiện ích</div>
          <div className="type-sport" style={{ position: "relative" }}>
            <span className="label">Loại sân: </span>
            <button
              className="add-btn"
              onClick={toggleTypeOptions}
              type="button"
              style={{ marginLeft: 8, cursor: "pointer" }}
            >
              +
            </button>

            {type && (
              <span
                className="selected-type"
                style={{ marginLeft: 8, fontWeight: "bold" }}
              >
                {type}
              </span>
            )}

            {showTypeOptions && (
              <ul
                className="options-list"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  width: 150,
                  padding: 0,
                  margin: "4px 0 0 0",
                  listStyle: "none",
                  zIndex: 100,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {typeOptions.map((opt, idx) => (
                  <li
                    key={idx}
                    onClick={() => selectType(opt)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="price-info">
          {price ? `${price} VND/giờ` : "Chưa nhập giá"}
          {/* <button className="btn-book" disabled>
            Đặt ngay
          </button> */}
        </div>
      </div>

      {/* Location & Map */}
      <div className="location-section">
        <Map
          selectable={true}
          onSelect={setSelectedPosition}
          onAddressChange={setAddress}
          address={address}
        />

        {selectedPosition && (
          <div className="location-desc">
            <i className="location-icon">📍</i>
            <span>
              Tọa độ: {selectedPosition.latitude.toFixed(6)},{" "}
              {selectedPosition.longitude.toFixed(6)}
            </span>
          </div>
        )}

        {address && (
          <div style={{ marginTop: 8, fontStyle: "italic" }}>
            <b>Địa chỉ:</b> {address}
          </div>
        )}
      </div>

      {/* Nút tạo khu thể thao */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          className="btn-create"
          onClick={handleCreateSportsComplex}
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo khu thể thao"}
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default memo(CreateSportsComplexes);
