import { useState } from "react";
import "./ActivityCard.scss";
import { formatPrice } from "../../../../utils/formatUtils";
import { formatDateTime } from "../../../../utils/timeUtils";
import roomJoinRequestService from "../../../../services/roomJoinRequestService";
import { getUserInfo } from "../../../../utils/auth";
import Swal from "sweetalert2";

const ActivityCard = ({ room }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const requesterId = getUserInfo().id;
      const response = await roomJoinRequestService.create(
        room.id,
        requesterId
      );
      if (response.isSuccessed) {
        Swal.fire({
          title: response.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: response.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: error.message || "Gửi yêu cầu tham gia thất bại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="activity-card">
      <div className="card-header">
        <div className="room-info">
          <div className="avatar">
            <img
              src={room.host.avatarUrl}
              alt={room.host.fullName}
              loading="lazy"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />{" "}
          </div>
          <div className="room-details">
            <h4>{room.name}</h4>
            <p>{room.court.sportsComplexModelView.address}</p>
            <p>{room.description}</p>
            <div className="room-meta">
              <span className="max-players">
                Tối đa {room.maxPlayers} người
              </span>
            </div>
          </div>
        </div>
        <div className="price">
          <span className="amount">{formatPrice(room.roomFee)} </span>
          <span className="currency">VND</span>
          <span className="per-person">/phòng</span>
        </div>
      </div>

      <div className="card-body">
        <div className="time-info">
          <span>{formatDateTime(room.scheduledTime)}</span>
        </div>

        <div className="card-actions">
          <button
            className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            ♡
          </button>
          <button
            className="join-btn"
            onClick={handleJoinRoom}
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Tham gia"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
