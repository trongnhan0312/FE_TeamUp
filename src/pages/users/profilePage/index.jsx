import { memo, useState, useEffect } from "react";
import "./style.scss";
import FeedBackUser from "./feedBackUser/feedBackUser";
import userService from "../../../services/userService";
import { getUserInfo } from "../../../utils/auth";

const ProfilePage = () => {
  const [user, setUser] = useState(() => getUserInfo());

  useEffect(() => {
    if (user?.id) {
      userService
        .getUserById(user.id)
        .then((response) => {
          console.log("Fresh user info from API:", response);
          setUser(response.resultObj);
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin user:", err);
        });
    }
  }, [user?.id]);

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
            <button className="edit-button">Sửa</button>
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
            <li>Lịch sử trận đấu</li>
            <li>Phòng đã tạo</li>
            <li>Số dư</li>
            <li>Đánh giá người chơi</li>
            <li>Cài đặt</li>
            <li>Đăng xuất</li>
          </ul>
        </nav>
      </aside>

      <main className="profile-form">
        <section className="form-section">
          <h3>HỒ SƠ CỦA TÔI</h3>
          <div className="form-group">
            <input name="name" value={user?.fullName} placeholder="Tên*" />
            <input name="email" value={user?.email} placeholder="Email*" />
          </div>
          <div className="buttons">
            <button className="save">Lưu</button>
            <button className="cancel">Hủy</button>
          </div>
        </section>

        <section className="form-section">
          <h3>SỐ ĐO</h3>
          <div className="form-group">
            <input name="city" value={user?.height} placeholder="Chiều Cao" />
            <input name="city" value={user?.weight} placeholder="Cân Nặng" />
          </div>
          <div className="buttons">
            <button className="save">Lưu</button>
            <button className="cancel">Hủy</button>
          </div>
        </section>
        <FeedBackUser revieweeId={user?.id} />
      </main>
    </div>
  );
};

export default memo(ProfilePage);
