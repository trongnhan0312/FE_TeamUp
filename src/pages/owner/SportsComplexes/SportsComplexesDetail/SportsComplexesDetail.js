import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCourtsBySportsComplexId } from "../../../../services/ownerService"; // hoặc services tương ứng
import { BsFillPlusCircleFill } from "react-icons/bs";
import "./style.scss";
import { ROUTER } from "../../../../utils/router";

const SportsComplexDetail = () => {
  const { id } = useParams(); // Lấy param id từ url
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchCourtsBySportsComplexId(id)
      .then((data) => setCourts(data))
      .catch(() => setCourts([]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Đang tải sân thuộc khu thể thao...</div>;

  if (!courts.length)
    return <div>Không có sân nào thuộc khu thể thao này.</div>;

  // Hàm xử lý sự kiện khi bấm vào sân
  const handleCourtClick = (courtId) => {
    navigate(ROUTER.OWNER.CourtDetailOwner.replace(":courtId", courtId));
  };

  return (
    <div className="sports-complex-detail">
      <h2>Chi tiết sân thuộc khu thể thao</h2>
      <div className="header-with-add">
        <button className="btn-add" title="Tạo Sân Mới">
          <BsFillPlusCircleFill size={28} />
        </button>
      </div>
      <div className="court-list">
        {courts.map(({ id, name, pricePerHour, imageUrls }) => (
          <div
            key={id}
            className="court-card"
            onClick={() => handleCourtClick(id)} // Bắt sự kiện bấm vào sân
          >
            <img
              src={imageUrls?.[0] || ""}
              alt={name}
              className="court-image"
            />
            <div>
              <h3>{name}</h3>
              <p>Giá giờ: {pricePerHour.toLocaleString("vi-VN")} VND</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsComplexDetail;
