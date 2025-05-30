import { memo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import FeedBackUser from "./feedBackUser/feedBackUser";
import userService from "../../../services/userService";

import { logout, getUserInfo } from "../../../utils/auth";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [user, setUser] = useState(() => getUserInfo());
  const fileInputRef = useRef(null); // 👈 thêm ref để trigger upload ảnh

  const [formData, setFormData] = useState({
    Id: "",
    FullName: "",
    Age: "",
    Height: "",
    Weight: "",
    AvatarUrl: "", // File
    PhoneNumber: "",
  });


import { getUserInfo } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(() => getUserInfo());
const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      userService
        .getUserById(user.id)
        .then((response) => {
          const data = response.resultObj;
          setUser(data);
          setFormData({
            Id: data.id,
            FullName: data.fullName || "",
            Age: data.age || "",
            Height: data.height || "",
            Weight: data.weight || "",
            AvatarUrl: "", // Không cần gán avatarUrl string
            PhoneNumber: data.phoneNumber || "",
          });
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin user:", err);
        });
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          AvatarUrl: file,
        }));

        // Hiển thị preview ngay
        const previewURL = URL.createObjectURL(file);
        setUser((prev) => ({
          ...prev,
          avatarUrl: previewURL,
        }));
      }
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      toast.error("Có lỗi xảy ra khi chọn ảnh. Vui lòng thử lại!");
    }
  };

  const handleSave = async () => {
    try {
      await userService.updateUserOwnerProfile(formData);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="profile-container">
      <aside className="sidebar">
        <div className="avatar-section">
          <img
            src={user?.avatarUrl || user?.avatar}
            alt="Avatar"
            className="avatar"
          />
          <div className="Edit-avatar">
            <button
              className="edit-button"
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
              <strong>{user?.age}</strong> Tuổi
            </div>
          </div>
        </div>

        <nav className="menu">
          <ul>
            <li onClick={() => navigate("/court-booking-history")}>Lịch sử đặt Sân</li>
            <li onClick={() => navigate("/coach-booking-history")}>Lịch sử đặt HLV</li>
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
          <div className="buttons">
            <button className="save" onClick={handleSave}>
              Lưu
            </button>
            <button className="cancel">Hủy</button>
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
            <button className="save" onClick={handleSave}>
              Lưu
            </button>
            <button className="cancel">Hủy</button>
          </div>
        </section>
        <FeedBackUser revieweeId={user?.id} />
      </main>
    </div>
  );
};

export default memo(ProfilePage);
