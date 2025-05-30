import { memo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import FeedBackCoach from "./feedBackCoach/feedBackCoach";
import { fetchEmployeeById } from "../../../services/ownerService";
import userService from "../../../services/userService";
import { logout, getUserInfo } from "../../../utils/auth";
import { toast } from "react-toastify";

const ProfileCoachPage = () => {
  const [owner, setOwner] = useState(() => getUserInfo());
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    Id: "",
    FullName: "",
    Age: "",
    Height: "",
    Weight: "",
    AvatarUrl: "",
    PhoneNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (owner?.id) {
      fetchEmployeeById(owner.id)
        .then((data) => {
          setOwner(data);
          setFormData({
            Id: data.id,
            FullName: data.fullName || "",
            Age: data.age || "",
            Height: data.height || "",
            Weight: data.weight || "",
            AvatarUrl: "", // File mới chưa chọn
            PhoneNumber: data.phoneNumber || "",
          });
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin owner:", err);
        });
    }
  }, [owner?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        // Cập nhật local preview ảnh
        const previewURL = URL.createObjectURL(file);
        setOwner((prev) => ({
          ...prev,
          avatarUrl: previewURL,
        }));

        // Tạo FormData chỉ để gửi ảnh avatar
        const formDataToUpload = new FormData();
        formDataToUpload.append("AvatarUrl", file);

        // Gọi API update ảnh ngay
        await userService.updateUserOwnerProfile(formDataToUpload);

        toast.success("Cập nhật ảnh đại diện thành công!");

        // Đồng thời cập nhật state formData để giữ đồng bộ nếu cần
        setFormData((prev) => ({
          ...prev,
          AvatarUrl: file,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh:", error);
      toast.error("Có lỗi xảy ra khi cập nhật ảnh. Vui lòng thử lại!");
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

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profileCoach-container">
      <aside className="sidebar">
        <div className="avatar-section">
          <img
            src={owner?.avatarUrl || owner?.avatar || "/default-avatar.png"}
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
          <div className="name">{owner?.fullName}</div>
          <div className="stats">
            <div>
              <strong>{owner?.age}</strong> Tuổi
            </div>
          </div>
        </div>

        <nav className="menu">
          <ul>
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
            <button className="save" type="button" onClick={handleSave}>
              Lưu
            </button>
            <button className="cancel" type="button">
              Hủy
            </button>
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
            <button className="cancel" type="button">
              Hủy
            </button>
          </div>
        </section>
        <FeedBackCoach revieweeId={owner?.id} />
      </main>
    </div>
  );
};

export default memo(ProfileCoachPage);
