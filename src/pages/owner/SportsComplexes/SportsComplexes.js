import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import { fetchSportsComplexesByOwner } from "../../../services/ownerService";
import { BsFillPlusCircleFill } from "react-icons/bs";
import "./style.scss";

const SportsComplexes = () => {
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(false);
  const storedOwnerId = localStorage.getItem("ownerId");

  useEffect(() => {
    if (!storedOwnerId) {
      console.warn("Không tìm thấy ownerId trong localStorage");
      return;
    }
    setLoading(true);
    fetchSportsComplexesByOwner(storedOwnerId)
      .then((data) => setComplexes(data))
      .catch((err) => {
        console.error("Lỗi khi lấy khu thể thao:", err);
        setComplexes([]);
      })
      .finally(() => setLoading(false));
  }, [storedOwnerId]);

  if (loading)
    return (
      <div style={{ color: "red", fontSize: 20 }}>Đang tải dữ liệu...</div>
    );

  if (!complexes.length) return <div>Không có dữ liệu khu thể thao.</div>;

  return (
    <div className="sports-complexes">
      <h2>Danh sách Khu Thể Thao</h2>
      <div className="header-with-add">
        <button className="btn-add" title="Tạo khu thể thao mới">
          <BsFillPlusCircleFill size={28} />
        </button>
      </div>
      <div className="complex-list">
        {complexes.map(({ id, name, type, imageUrls }) => (
          <Link
            style={{ textDecoration: "none" }} // Để bỏ gạch chân
            key={id}
            to={`/owner/sportscomplexes/${id}`} // Trùng chính xác với route trên
            className="complex-card"
          >
            <img
              src={imageUrls?.[0] || ""}
              alt={name}
              className="complex-image"
            />
            <div className="complex-info">
              <h3 className="complex-name">{name}</h3>
              <p className="complex-type">{type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default memo(SportsComplexes);
