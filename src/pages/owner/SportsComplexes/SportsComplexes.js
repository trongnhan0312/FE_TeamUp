import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchSportsComplexesByOwner } from "../../../services/ownerService";
import { BsFillPlusCircleFill } from "react-icons/bs";
import "./style.scss";

const SportsComplexes = () => {
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(false);
  const storedOwnerId = localStorage.getItem("ownerId");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/owner/CreateSportsComplexes");
  };

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

  if (!complexes.length)
    return (
      <div className="sports-complexes empty">
        <div className="header-with-add">
          <h2>Không có dữ liệu khu thể thao.</h2>
          <button
            className="btn-add"
            title="Tạo khu thể thao mới"
            onClick={handleClick}
            type="button"
          >
            <BsFillPlusCircleFill size={20} />
            <span>Tạo mới</span>
          </button>
        </div>
      </div>
    );

  return (
    <div className="sports-complexes">
      <h2>Danh sách Khu Thể Thao</h2>
      <div className="header-with-add">
        <button
          className="btn-add"
          title="Tạo khu thể thao mới"
          onClick={handleClick}
          type="button"
        >
          <BsFillPlusCircleFill size={28} />
        </button>
      </div>
      <div className="complex-list">
        {complexes.map(({ id, name, type, imageUrls }) => (
          <Link
            style={{ textDecoration: "none" }}
            key={id}
            to={`/owner/sportscomplexes/${id}`}
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
