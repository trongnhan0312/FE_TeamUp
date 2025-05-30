import { useEffect, useState } from "react";
import "./style.scss";
import userService from "../../../services/userService";
import { getUserInfo } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "profile") {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await userService.getUserById(getUserInfo().id);
      setProfile(response.resultObj);
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await userService.updateProfile(
        profile.id,
        profile.fullName,
        profile.phoneNumber
      );

      if (response.isSuccessed) {
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsEditingProfile(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: response.message || "Cập nhật thất bại.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống",
        text: error.message || "Có lỗi xảy ra khi cập nhật.",
      });
    }
  };

  return (
    <div className="profile-page">
      <aside className="sidebar">
        <img className="avatar" src={profile?.avatarUrl} alt="avatar" />
        <h2 className="name">{profile?.fullName}</h2>
        <div className="stats">
          <span>{profile?.age ?? 0} Tuổi</span>
          <span>{profile?.weight ?? 0} Cân nặng</span>
          <span>{profile?.height ?? 0} Chiều cao</span>
        </div>
        <ul className="menu">
          <li onClick={() => navigate("/court-booking-history")}>Lịch sử đặt sân</li>
          <li onClick={() => navigate("/coach-booking-history")}>Lịch sử đặt HLV</li>
          <li>Lịch sử tạo phòng</li>
          <li>Số dư</li>
          <li>Đánh giá người chơi</li>
          <li>Cài đặt</li>
          <li>Đăng xuất</li>
        </ul>
      </aside>

      <section className="main-content">
        <div className="section">
          <div className="section-header">
            <h3>HỒ SƠ CỦA TÔI</h3>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="edit-icon"
            >
              ✏️
            </button>
          </div>
          <div className="section-body">
            <label>
              Tên*
              <input
                name="fullName"
                value={profile?.fullName || ""}
                onChange={(e) => handleInputChange(e, "profile")}
                disabled={!isEditingProfile}
              />
            </label>
            <label>
              Email*
              <input
                name="email"
                value={profile?.email || ""}
                disabled // Email thường không cho sửa ở đây
              />
            </label>
            <label>
              Số điện thoại
              <input
                name="phoneNumber"
                value={profile?.phoneNumber || ""}
                onChange={(e) => handleInputChange(e, "profile")}
                disabled={!isEditingProfile}
              />
            </label>
          </div>
          {isEditingProfile && (
            <div className="actions">
              <button className="save" onClick={handleUpdateProfile}>Lưu</button>
              <button
                className="cancel"
                onClick={() => setIsEditingProfile(false)}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
