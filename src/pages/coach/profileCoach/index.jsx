import { memo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import FeedBackCoach from "./feedBackCoach/feedBackCoach";
import coachService from "../../../services/coachService";
import { logout, getUserInfo } from "../../../utils/auth";
import { toast } from "react-toastify";

const ProfileCoachPage = () => {
  const userInfo = getUserInfo();
  const userId = userInfo?.id || userInfo?.userId;

  const [coach, setCoach] = useState(null);
  const [packageName, setPackageName] = useState("");
  const [editAge, setEditAge] = useState(false);
  const [formData, setFormData] = useState({
    Id: "",
    FullName: "",
    Age: "",
    Height: "",
    Weight: "",
    AvatarUrl: null,
    Certificate: null,
    PhoneNumber: "",
    PricePerSession: "",
    WorkingAddress: "",
    Experience: "",
    TargetObject: "",
    Type: "",
    Specialty: "",
    WorkingDate: "",
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      console.log("Lấy CoachID:", userId);
      coachService
        .getCoachProfile(userId)
        .then((res) => {
          if (res.isSuccessed && res.resultObj) {
            const data = res.resultObj;
            setCoach(data);
            // Format PricePerSession khi lấy về nếu là số (ví dụ 1000000 thành "1,000,000")
            const formattedPrice =
              data.pricePerSession !== undefined &&
              data.pricePerSession !== null
                ? formatVND(data.pricePerSession.toString())
                : "";

            setFormData({
              Id: data.id ?? "",
              FullName: data.fullName ?? "",
              Age: data.age ?? "",
              Height: data.height ?? "",
              Weight: data.weight ?? "",
              AvatarUrl: data.avatarUrl ?? null,
              Certificate: data.certificate ?? null,
              PhoneNumber: data.phoneNumber ?? "",
              PricePerSession: formattedPrice,
              WorkingAddress: data.workingAddress ?? "",
              Experience: data.experience ?? "",
              TargetObject: data.targetObject ?? "",
              Type: data.type ?? "",
              Specialty: data.specialty ?? "",
              WorkingDate: data.workingDate ?? "",
            });
            setEditAge(!data.age); // nếu chưa có tuổi bật chế độ sửa
          } else {
            toast.error("Lấy dữ liệu thất bại");
          }
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin coach:", err);
          toast.error("Lỗi lấy thông tin hồ sơ");
        });
    }
  }, [userId]);

  useEffect(() => {
    if (coach?.package?.name) {
      setPackageName(coach.package.name);
    } else {
      setPackageName("");
    }
  }, [coach]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e) => {
    const input = e.target.value;
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = input.replace(/\D/g, "");
    if (!numericValue) {
      setFormData((prev) => ({ ...prev, PricePerSession: "" }));
      return;
    }
    // Thêm dấu phân cách hàng nghìn
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setFormData((prev) => ({
      ...prev,
      PricePerSession: formatted,
    }));
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setCoach((prev) => ({
          ...prev,
          avatarUrl: previewURL,
        }));

        setFormData((prev) => ({
          ...prev,
          AvatarUrl: file,
        }));

        await coachService.updateCoachProfile({
          ...formData,
          AvatarUrl: file,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh:", error);
      toast.error("Có lỗi xảy ra khi cập nhật ảnh. Vui lòng thử lại!");
    }
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        Certificate: file,
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Chuyển giá tiền thành số nguyên (bỏ dấu phẩy) trước khi gửi
      const priceRaw = formData.PricePerSession
        ? formData.PricePerSession.replace(/,/g, "")
        : "";

      await coachService.updateCoachProfile({
        ...formData,
        PricePerSession: priceRaw,
      });
      toast.success("Cập nhật hồ sơ thành công!");
      if (formData.Age) setEditAge(false);
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Hàm định dạng số thành dạng VNĐ có dấu phẩy
  const formatVND = (value) => {
    if (!value) return "";
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/\D/g, "");
    // Thêm dấu phân cách hàng nghìn
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="profileCoach-container">
      <aside className="sidebar">
        <div className="avatar-section">
          <img
            src={
              typeof formData.AvatarUrl === "string" && formData.AvatarUrl
                ? formData.AvatarUrl
                : coach?.avatarUrl || "/default-avatar.png"
            }
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
          <div className="name">{coach?.fullName}</div>
          <div className="stats">
            <div>
              {editAge ? (
                <input
                  name="Age"
                  value={formData.Age || ""}
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
                to="/coach/package"
                state={{ currentPackage: packageName }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Gói:{" "}
                <span
                  className={
                    packageName === "Basic"
                      ? "package-badge premium"
                      : "package-badge"
                  }
                >
                  {packageName || "Chưa có gói"}
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/coach/CoachHistory"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Lịch sử trận đấu
              </Link>
            </li>
            <li>Lịch sử thanh toán</li>

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
              value={formData.FullName || ""}
              onChange={handleChange}
              placeholder="Tên*"
            />
            <input
              name="PhoneNumber"
              value={formData.PhoneNumber || ""}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />
          </div>
          <div className="form-group">
            <input
              name="Height"
              value={formData.Height || ""}
              onChange={handleChange}
              placeholder="Chiều Cao"
            />
            <input
              name="Weight"
              value={formData.Weight || ""}
              onChange={handleChange}
              placeholder="Cân Nặng"
            />
          </div>
        </section>

        <section className="form-section">
          <h3>THÔNG TIN CÔNG VIỆC</h3>
          <div className="form-group">
            <input
              name="PricePerSession"
              value={formData.PricePerSession || ""}
              onChange={handlePriceChange}
              placeholder="Giá mỗi buổi (VNĐ)"
            />
            <input
              name="WorkingAddress"
              value={formData.WorkingAddress || ""}
              onChange={handleChange}
              placeholder="Địa chỉ làm việc"
            />
          </div>
          <div className="form-group">
            <input
              name="Experience"
              value={formData.Experience || ""}
              onChange={handleChange}
              placeholder="Kinh nghiệm"
            />
            <input
              name="TargetObject"
              value={formData.TargetObject || ""}
              onChange={handleChange}
              placeholder="Đối tượng hướng tới"
            />
          </div>
          <div className="form-group">
            <input
              name="Type"
              value={formData.Type || ""}
              onChange={handleChange}
              placeholder="Loại"
            />
            <input
              name="Specialty"
              value={formData.Specialty || ""}
              onChange={handleChange}
              placeholder="Chuyên môn"
            />
          </div>
          <div className="form-group">
            <input
              name="WorkingDate"
              type="text"
              value={formData.WorkingDate || ""}
              onChange={handleChange}
              placeholder="Ngày bắt đầu làm việc"
            />
          </div>
        </section>

        <section className="form-section">
          <h3>HỒ SƠ VÀ CHỨNG CHỈ</h3>

          {(formData.Certificate || coach?.certificate) && (
            <>
              {coach?.certificate && !formData.Certificate && (
                <div style={{ marginBottom: "8px", fontStyle: "italic" }}>
                  Chứng chỉ hiện tại: {coach.certificate}
                </div>
              )}

              <div className="form-group">
                <label>Chứng chỉ</label>
                <input
                  name="Certificate"
                  value={formData.Certificate || ""}
                  onChange={handleChange}
                  placeholder="Chứng Chỉ"
                />
              </div>
            </>
          )}
        </section>

        <div className="buttons">
          <button className="save" type="button" onClick={handleSave}>
            Lưu
          </button>
          <button className="cancel" type="button">
            Hủy
          </button>
        </div>

        <FeedBackCoach revieweeId={coach?.id} />
      </main>
    </div>
  );
};

export default memo(ProfileCoachPage);
