import { memo, useState, useEffect } from "react";
import axios from "axios";
import "./style.scss";
import Map from "../../../../../component/map";
import { getUserInfo } from "../../../../../utils/auth";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CreateCourt = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(false);
  const { sportsComplexId } = useParams(); // Lấy param sportsComplexId
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet consectetur. Gravida sapien facilisis consectetur vitae tellus..."
  );

  const [title, setTitle] = useState("Sân Mới - Chưa đặt tên");
  const [editingTitle, setEditingTitle] = useState(false);

  const navigate = useNavigate();
  const storedOwnerInfo = getUserInfo();
  const ownerId = storedOwnerInfo?.id || storedOwnerInfo?.userId;

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

  useEffect(() => {
    // Log sportsComplexId mỗi khi thay đổi
    console.log("sportsComplexId từ URL params:", sportsComplexId);
  }, [sportsComplexId]);

  const formatVND = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChangePrice = (e) => {
    const formatted = formatVND(e.target.value);
    setPrice(formatted);
  };
  const handleBlurPrice = () => setEditing(false);
  const handleKeyDownPrice = (e) => e.key === "Enter" && setEditing(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTitleBlur = () => {
    if (!title.trim()) setTitle("Sân Mới - Chưa đặt tên");
    setEditingTitle(false);
  };
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!title.trim()) setTitle("Sân Mới - Chưa đặt tên");
      setEditingTitle(false);
    }
  };
  const handleTitleFocus = () => {
    if (title === "Sân Mới - Chưa đặt tên") {
      setTitle("");
    }
    setEditingTitle(true);
  };

  const handleBigImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBigImageFile(file);
      setBigImagePreview(URL.createObjectURL(file));
    }
  };

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

  const handleCreateCourt = async () => {
    if (!sportsComplexId) {
      toast.error("Không tìm thấy ID khu thể thao.");
      return;
    }
    if (!title.trim() || title === "Sân Mới - Chưa đặt tên") {
      toast.error("Tên sân không được để trống.");
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
    if (!price) {
      toast.error("Vui lòng nhập giá tiền.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("SportsComplexId", sportsComplexId.toString());
      formData.append("Name", title.trim());
      formData.append("Description", description.trim());
      formData.append("PricePerHour", price.replace(/,/g, ""));

      if (bigImageFile) formData.append("ImageUrls", bigImageFile);
      smallImageFiles.forEach((file) => {
        if (file) formData.append("ImageUrls", file);
      });

      const response = await axios.post(
        "https://localhost:7286/api/court/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.isSuccessed) {
        toast.success("Tạo sân thành công!");
        setTimeout(() => {
          navigate(`/owner/sportscomplexes/${sportsComplexId}`);
        }, 1500);
      } else {
        toast.error(response.data.message || "Tạo sân thất bại");
      }
    } catch (err) {
      toast.error(err.response?.data || err.message || "Lỗi khi tạo sân");
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
              placeholder="Nhập tên sân"
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
      {/* Image Section */}
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
      {/* Description */}
      <div className="description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả sân..."
          rows={4}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>
      {/* Map Section */}
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
      {/* Button Create */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          className="btn-create"
          onClick={handleCreateCourt}
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo sân"}
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default memo(CreateCourt);
