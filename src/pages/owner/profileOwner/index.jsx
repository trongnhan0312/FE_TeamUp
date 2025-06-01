import { memo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import FeedBackOwner from "./feedBackOwner/feedBackOwner";
import { fetchEmployeeById } from "../../../services/ownerService";
import userService from "../../../services/userService";
import { logout, getUserInfo } from "../../../utils/auth";
import { toast } from "react-toastify";

const ProfileOwnerPage = () => {
  const [owner, setOwner] = useState(() => getUserInfo());
  const fileInputRef = useRef(null);
  const [packageName, setPackageName] = useState("");
  const [editAge, setEditAge] = useState(false);
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
    if (owner?.package?.name) {
      setPackageName(owner.package.name);
    }
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
          if (data.package?.name) {
            setPackageName(data.package.name);
          }
          setEditAge(!data.age); // Nếu chưa có tuổi thì bật chế độ sửa luôn
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
        const previewURL = URL.createObjectURL(file);
        setOwner((prev) => ({
          ...prev,
          avatarUrl: previewURL,
        }));

        const formDataToUpload = new FormData();
        formDataToUpload.append("AvatarUrl", file);

        await userService.updateUserOwnerProfile(formDataToUpload);

        toast.success("Cập nhật ảnh đại diện thành công!");

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
      if (owner?.id) {
        const data = await fetchEmployeeById(owner.id);
        setOwner(data);
        setEditAge(!data.age);
      }
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setFormData({
      Id: owner.id,
      FullName: owner.fullName || "",
      Age: owner.age || "",
      Height: owner.height || "",
      Weight: owner.weight || "",
      AvatarUrl: "",
      PhoneNumber: owner.phoneNumber || "",
    });
    setEditAge(!owner.age);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profileOwner-container">
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
            <li>
              <Link
                to="/owner/package"
                state={{ currentPackage: packageName }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Gói:{" "}
                <span
                  className={
                    packageName === "Premium"
                      ? "package-badge premium"
                      : "package-badge"
                  }
                >
                  {packageName || "Chưa có gói"}
                </span>
              </Link>
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

        <FeedBackOwner revieweeId={owner?.id} />
      </main>
    </div>
  );
};

export default memo(ProfileOwnerPage);
