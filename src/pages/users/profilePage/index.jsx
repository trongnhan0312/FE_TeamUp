import { memo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import FeedBackUser from "./feedBackUser/feedBackUser";
import userService from "../../../services/userService";

import { logout, getUserInfo } from "../../../utils/auth";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Lấy user hiện tại 1 lần khi mount
  const [user, setUser] = useState(() => getUserInfo());
  const fileInputRef = useRef(null);

  // FormData để chỉnh sửa, tách biệt với user (user lấy info gốc)
  const [formData, setFormData] = useState({
    Id: "",
    FullName: "",
    Age: "",
    Height: "",
    Weight: "",
    AvatarUrl: "", // Lưu file ảnh
    PhoneNumber: "",
  });

  // Dùng state này để lưu preview ảnh (local url)
  const [previewAvatar, setPreviewAvatar] = useState("");

  // State bật/tắt chế độ sửa tuổi
  const [editAge, setEditAge] = useState(false);

  // Khi component mount hoặc user thay đổi (id)
  useEffect(() => {
    if (user?.id) {
      userService
        .getUserById(user.id)
        .then((response) => {
          const data = response.resultObj;
          setUser(data); // Cập nhật user mới
          setFormData({
            Id: data.id,
            FullName: data.fullName || "",
            Age: data.age || "",
            Height: data.height || "",
            Weight: data.weight || "",
            AvatarUrl: "", // reset file
            PhoneNumber: data.phoneNumber || "",
          });
          setPreviewAvatar(data.avatarUrl || data.avatar || ""); // ảnh hiện tại
          setEditAge(!data.age); // Nếu chưa có tuổi thì bật chế độ sửa luôn
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin user:", err);
          toast.error("Lỗi lấy thông tin user!");
        });
    }
  }, [user?.id]);

  // Xử lý input thay đổi text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi ảnh avatar
  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          AvatarUrl: file,
        }));
        const previewURL = URL.createObjectURL(file);
        setPreviewAvatar(previewURL);

        toast.success("Cập nhật ảnh đại diện thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      toast.error("Có lỗi xảy ra khi chọn ảnh. Vui lòng thử lại!");
    }
  };

  // Xử lý lưu hồ sơ
  const handleSave = async () => {
    try {
      await userService.updateUserOwnerProfile(formData);

      toast.success("Cập nhật hồ sơ thành công!");

      // Cập nhật lại user info mới
      if (user?.id) {
        const response = await userService.getUserById(user.id);
        setUser(response.resultObj);
        setEditAge(!response.resultObj.age); // cập nhật lại chế độ sửa tuổi
      }
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // Hủy không làm gì (reset formData)
  const handleCancel = () => {
    setFormData({
      Id: user.id,
      FullName: user.fullName || "",
      Age: user.age || "",
      Height: user.height || "",
      Weight: user.weight || "",
      AvatarUrl: "",
      PhoneNumber: user.phoneNumber || "",
    });
    setPreviewAvatar(user.avatarUrl || user.avatar || "");
    setEditAge(!user.age);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <div className="avatar-section">
          <img
            src={previewAvatar || "/default-avatar.png"}
            alt="Avatar"
            className="avatar"
          />
          <div className="Edit-avatar">
            <button
              className="edit-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Sửa
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="name">{user?.fullName}</div>
          <div className="stats">
            <div>
              {editAge ? (
                <input
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  placeholder="Tuổi"
                  style={{ width: "60px", fontWeight: "bold" }}
                />
              ) : (
                <span>
                  <strong>{formData.Age}</strong> Tuổi&nbsp;
                  <button
                    type="button"
                    onClick={() => setEditAge(true)}
                    style={{
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      color: "#7ac943",
                      border: "none",
                      background: "none",
                      padding: 0,
                    }}
                  >
                    Sửa
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="menu">
          <ul>
            <li onClick={() => navigate("/court-booking-history")}>
              Lịch sử đặt Sân
            </li>
            <li onClick={() => navigate("/coach-booking-history")}>
              Lịch sử đặt HLV
            </li>
            <li onClick={() => navigate("/room-create-history")}>
              Lịch sử tạo phòng
            </li>
            <li>Lịch sử trận đấu</li>
            <li>Phòng đã tạo</li>
            <li>Số dư</li>
            <li>Đánh giá người chơi</li>
            <li>Cài đặt</li>
            <li
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
              title="Logout"
            >
              Đăng xuất
            </li>
          </ul>
        </nav>
      </aside>

      <main className="profile-form">
        <section className="form-section">
          <h3>HỒ SƠ CỦA TÔI</h3>
          <div className="form-group">
            <input
              name="FullName"
              value={formData.FullName}
              onChange={handleChange}
              placeholder="Tên*"
            />
            <input
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />
          </div>
        </section>

        <section className="form-section">
          <h3>SỐ ĐO</h3>
          <div className="form-group">
            <input
              name="Height"
              value={formData.Height}
              onChange={handleChange}
              placeholder="Chiều Cao"
            />
            <input
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
              placeholder="Cân Nặng"
            />
          </div>
          <div className="buttons">
            <button className="save" type="button" onClick={handleSave}>
              Lưu
            </button>
            <button className="cancel" type="button" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </section>

        <FeedBackUser revieweeId={user?.id} />
      </main>
    </div>
  );
};

export default memo(ProfilePage);
