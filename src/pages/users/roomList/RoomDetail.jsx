import { memo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaTag,
  FaCheck,
  FaTimes,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaComments,
  FaTrash,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import "./RoomDetail.scss";
import roomService from "../../../services/roomService";
import roomJoinRequestService from "../../../services/roomJoinRequestService";
import roomPlayerService from "../../../services/roomPlayerService";
import userService from "../../../services/userService";
import { getUserInfo } from "../../../utils/auth";
import Swal from "sweetalert2";
import ratingService from "../../../services/ratingService";

const RoomDetail = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const userId = getUserInfo().id;

  const [waitingList, setWaitingList] = useState([]);
  const [waitingListPagination, setWaitingListPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 5,
  });
  const [waitingListLoading, setWaitingListLoading] = useState(false);

  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [joinedPlayersLoading, setJoinedPlayersLoading] = useState(false);
  const [joinedPlayersPagination, setJoinedPlayersPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 5,
  });

  // State để lưu trữ rating values đã load
  const [loadedRatings, setLoadedRatings] = useState({});
  const [ratingsLoading, setRatingsLoading] = useState(false);
  // State để track xem player nào đã được đánh giá
  const [hasRated, setHasRated] = useState({});

  // Kiểm tra vai trò người dùng
  const isHost = roomData?.hostId === userId;
  const isPlayerInRoom = joinedPlayers.some((player) => player.id === userId);

  // Fetch room data on component mount
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) {
        setError("Room ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await roomService.getById(roomId);

        const transformedData = {
          id: response?.resultObj.id,
          name: response?.resultObj.name,
          date: new Date(response?.resultObj.scheduledTime).toLocaleDateString(
            "vi-VN"
          ),
          time: new Date(response?.resultObj.scheduledTime).toLocaleTimeString(
            "vi-VN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          location: response?.resultObj.court?.name,
          address: response?.resultObj.court?.address,
          skill: response?.resultObj.skillLevel,
          fee: `${response?.resultObj.roomFee?.toLocaleString("vi-VN")}VND`,
          hostName: response?.resultObj.host?.name,
          hostAvatar: response?.resultObj.host?.avatar,
          hostId: response?.resultObj.host?.id,
          maxPlayers: response?.resultObj.maxPlayers,
          currentPlayers: response?.resultObj.currentPlayers,
          description: response?.resultObj.description,
          status: response?.resultObj.status,
        };

        setRoomData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching room data:", err);
        setError(err.message || "Failed to fetch room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  // Fetch joined players list
  const fetchJoinedPlayers = async (pageNumber = 1) => {
    if (!roomId) return;

    try {
      setJoinedPlayersLoading(true);
      const response = await roomPlayerService.getAllByRoomId(
        roomId,
        pageNumber,
        joinedPlayersPagination.pageSize
      );

      if (response?.resultObj) {
        const transformedJoinedPlayers =
          response.resultObj.items?.map((playerData) => ({
            id: playerData.player?.id,
            name: playerData.player?.fullName,
            avatar: playerData.player?.avatarUrl,
            joinedAt: playerData.joinedAt,
            isHost: roomData?.hostId === playerData.player?.id,
          })) || [];

        setJoinedPlayers(transformedJoinedPlayers);
        setJoinedPlayersPagination((prev) => ({
          ...prev,
          currentPage: response.resultObj.pageNumber || pageNumber,
          totalPages: response.resultObj.totalPages || 0,
          totalItems: response.resultObj.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching joined players:", err);
    } finally {
      setJoinedPlayersLoading(false);
    }
  };

  // Fetch waiting list with pagination
  const fetchWaitingList = async (pageNumber = 1) => {
    if (!roomId) return;

    try {
      setWaitingListLoading(true);
      const response = await roomJoinRequestService.getAll(
        roomId,
        "Pending",
        pageNumber,
        waitingListPagination.pageSize
      );

      if (response?.resultObj) {
        const transformedWaitingList =
          response.resultObj.items?.map((request) => ({
            requestId: request.id,
            playerId: request.requester?.id,
            name: request.requester?.fullName,
            avatar: request.requester?.avatarUrl,
            joinTime: new Date(request.requestedAt).toLocaleTimeString(
              "vi-VN",  
              {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          })) || [];

        setWaitingList(transformedWaitingList);
        setWaitingListPagination((prev) => ({
          ...prev,
          currentPage: response.resultObj.pageNumber || pageNumber,
          totalPages: response.resultObj.totalPages || 0,
          totalItems: response.resultObj.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching waiting list:", err);
    } finally {
      setWaitingListLoading(false);
    }
  };

  // Function để load rating values cho tất cả players
  const loadPlayerRatings = async (players) => {
    if (!players || players.length === 0) return;

    try {
      setRatingsLoading(true);
      const ratingPromises = players
        .filter((p) => !p.isHost && p.id !== userId)
        .map(async (player) => {
          try {
            const value = await ratingService.getValueRating(userId, player.id);
            const ratingValue = value?.resultObj?.items?.[0]?.ratingValue || 0;
            return {
              playerId: player.id,
              rating: ratingValue,
              hasRated: ratingValue > 0, // Nếu có rating value > 0 thì đã đánh giá
            };
          } catch (error) {
            console.log(`Error loading rating for player ${player.id}:`, error);
            return {
              playerId: player.id,
              rating: 0,
              hasRated: false,
            };
          }
        });

      const ratingResults = await Promise.all(ratingPromises);

      const newLoadedRatings = {};
      const newHasRated = {};

      ratingResults.forEach(({ playerId, rating, hasRated }) => {
        newLoadedRatings[playerId] = rating;
        newHasRated[playerId] = hasRated;
      });

      setLoadedRatings(newLoadedRatings);
      setHasRated(newHasRated);
    } catch (error) {
      console.error("Error loading player ratings:", error);
    } finally {
      setRatingsLoading(false);
    }
  };

  // Fetch both waiting list and joined players when room data is loaded
  useEffect(() => {
    if (roomData) {
      fetchWaitingList(1);
      fetchJoinedPlayers(1);
    }
  }, [roomData]);

  // Load ratings when joined players change
  useEffect(() => {
    if (joinedPlayers.length > 0 && isPlayerInRoom) {
      loadPlayerRatings(joinedPlayers);
    }
  }, [joinedPlayers, isPlayerInRoom]);

  // Host functions
  const handleAcceptPlayer = async (requestId) => {
    try {
      await roomJoinRequestService.updateStatus(requestId, "Accepted");
      fetchWaitingList(waitingListPagination.currentPage);
      fetchJoinedPlayers(joinedPlayersPagination.currentPage);
    } catch (err) {
      console.error("Error accepting player:", err);
    }
  };

  const handleRejectPlayer = async (requestId) => {
    try {
      await roomJoinRequestService.updateStatus(requestId, "Rejected");
      fetchWaitingList(waitingListPagination.currentPage);
    } catch (err) {
      console.error("Error rejecting player:", err);
    }
  };

  // const handleKickPlayer = async (playerId) => {
  //   try {
  //     console.log(`Kicking player: ${playerId}`);
  //     fetchJoinedPlayers(joinedPlayersPagination.currentPage);
  //   } catch (err) {
  //     console.error("Error kicking player:", err);
  //   }
  // };

  const navigate = useNavigate();

  const handleDeleteRoom = async () => {
    try {
      const confirm = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa phòng này không?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "red",
      });

      if (confirm.isConfirmed) {
        await roomService.updateStatus(roomId, "Cancelled");
        navigate("/home");
      }
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  // Player functions
  const handleJoinRoom = async () => {
    try {
      const response = await roomJoinRequestService.create(roomId, userId);
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
    }
  };

  // const handleLeaveRoom = async () => {
  //   try {
  //     console.log("Leaving room");
  //     // await roomPlayerService.leaveRoom(roomId, userId);
  //     fetchJoinedPlayers(joinedPlayersPagination.currentPage);
  //   } catch (err) {
  //     console.error("Error leaving room:", err);
  //   }
  // };

  const handleChatWithPlayer = (playerId) => {
    navigate(`/chat`, { state: { userId: playerId, role: "User" } });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= waitingListPagination.totalPages) {
      fetchWaitingList(newPage);
    }
  };

  const handleJoinedPlayersPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= joinedPlayersPagination.totalPages) {
      fetchJoinedPlayers(newPage);
    }
  };

  const handlePlayerRating = async (playerId, rating) => {
    // Kiểm tra xem đã đánh giá chưa
    if (hasRated[playerId]) {
      Swal.fire({
        title: "Thông báo",
        text: "Bạn đã đánh giá người chơi này rồi!",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Call API to save rating first
      await ratingService.create(userId, playerId, rating);

      // Update local state after successful API call
      setLoadedRatings((prev) => ({
        ...prev,
        [playerId]: rating,
      }));

      // Mark as rated
      setHasRated((prev) => ({
        ...prev,
        [playerId]: true,
      }));

      Swal.fire({
        title: "Thành công",
        text: "Đánh giá của bạn đã được ghi nhận!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });

      console.log(`Rating submitted for player ${playerId}: ${rating}`);
    } catch (error) {
      console.error("Error submitting rating:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể gửi đánh giá. Vui lòng thử lại!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    readOnly = false,
    isRated = false,
  }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const renderStar = (index) => {
      const starValue = index + 1;
      const currentRating = hoverRating || rating;

      if (currentRating >= starValue) {
        return <FaStar className="star filled" />;
      } else if (currentRating >= starValue - 0.5) {
        return <FaStarHalfAlt className="star half-filled" />;
      } else {
        return <FaRegStar className="star empty" />;
      }
    };

    return (
      <div className={`star-rating ${isRated ? "rated" : ""}`}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star-wrapper ${readOnly || isRated ? "readonly" : ""}`}
            onClick={() =>
              !readOnly &&
              !isRated &&
              onRatingChange &&
              onRatingChange(index + 1)
            }
            onMouseEnter={() =>
              !readOnly && !isRated && setHoverRating(index + 1)
            }
            onMouseLeave={() => !readOnly && !isRated && setHoverRating(0)}
            style={{
              cursor: readOnly || isRated ? "default" : "pointer",
              opacity: isRated ? 0.7 : 1,
            }}
          >
            {renderStar(index)}
          </span>
        ))}
      </div>
    );
  };

  // Thêm function này vào component
  const handleViewProfile = async (userId) => {
    try {
      setProfileLoading(true);
      setShowProfilePopup(true);
      const response = await userService.getUserById(userId);
      setSelectedProfile(response?.resultObj || response);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể tải thông tin người dùng",
        icon: "error",
        confirmButtonText: "OK",
      });
      setShowProfilePopup(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfilePopup = () => {
    setShowProfilePopup(false);
    setSelectedProfile(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="room-detail">
        <div className="loading-container">
          <div className="loading-spinner">Đang tải...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="room-detail">
        <div className="error-container">
          <div className="error-message">
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button onClick={() => navigate("/home")}>Về trang chủ</button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!roomData) {
    return (
      <div className="room-detail">
        <div className="error-container">
          <div className="error-message">
            <h3>Không tìm thấy phòng</h3>
            <p>Phòng này có thể đã bị xóa hoặc không tồn tại.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room-detail">
      <div className="room-detail-container">
        {/* Main Room Info */}
        <div className="room-info-card">
          <div className="room-info-content">
            <div className="info-row">
              <FaCalendar className="info-icon" />
              <span className="info-label">Thời gian</span>
              <span className="info-value">
                {roomData.date} lúc {roomData.time}
              </span>
            </div>

            <div className="info-row">
              <FaMapMarkerAlt className="info-icon" />
              <span className="info-label">Địa điểm</span>
              <div className="location-info">
                <div className="location-name">{roomData.location}</div>
                <div className="location-address">{roomData.address}</div>
              </div>
            </div>

            <div className="info-row">
              <FaTag className="info-icon" />
              <span className="info-label">Mỗi người</span>
              <span className="info-value">{roomData.fee}</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="room-sidebar">
          {/* Court Image and Action Buttons */}
          <div className="court-section">
            <div className="court-image">
              <div className="court-name">{roomData.name}</div>
              <p>{roomData.description}</p>
            </div>

            {/* Action buttons based on user role */}
            <div className="action-buttons-section">
              {isHost ? (
                // Host buttons
                <div className="host-actions">
                  {roomData.status === "Waiting" && (
                    <button
                      className="delete-room-btn"
                      onClick={handleDeleteRoom}
                    >
                      <FaTrash /> Xóa phòng
                    </button>
                  )}
                </div>
              ) : (
                // Player buttons
                <div className="player-actions">
                  {isPlayerInRoom ? (
                    <>
                      {/* <button
                      className="leave-room-btn"
                      onClick={handleLeaveRoom}
                    >
                      <FaSignOutAlt /> Rời phòng
                    </button> */}
                    </>
                  ) : (
                    <button className="join-button" onClick={handleJoinRoom}>
                      Tham gia
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Waiting List - Only visible to host */}
          {isHost && (
            <div className="waiting-section">
              <div className="waiting-header">
                <h3>Hàng chờ ({waitingListPagination.totalItems})</h3>
                {waitingListLoading && (
                  <span className="loading-indicator">Đang tải...</span>
                )}
              </div>

              {waitingList.length > 0 ? (
                <>
                  <div className="waiting-table">
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Người chơi</th>
                          <th>Thời gian</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waitingList.map((player) => (
                          <tr key={player.requestId}>
                            <td>
                              <div className="player-info">
                                <img
                                  src={player?.avatar}
                                  alt={player.name}
                                  className="player-avatar"
                                />
                              </div>
                            </td>
                            <td className="player-name">{player.name}</td>
                            <td>{player.joinTime}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="accept-btn"
                                  onClick={() =>
                                    handleAcceptPlayer(player.requestId)
                                  }
                                  disabled={
                                    joinedPlayersPagination.totalItems >=
                                    roomData.maxPlayers
                                  }
                                  title="Chấp nhận"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  className="reject-btn"
                                  onClick={() =>
                                    handleRejectPlayer(player.requestId)
                                  }
                                  title="Từ chối"
                                >
                                  <FaTimes />
                                </button>
                                <button
                                  className="chat-btn"
                                  onClick={() =>
                                    handleChatWithPlayer(player.playerId)
                                  }
                                  title="Chat"
                                >
                                  <FaComments />
                                </button>

                                <button
                                  className="profile-btn"
                                  onClick={() =>
                                    handleViewProfile(player.playerId)
                                  }
                                  title="Xem profile"
                                >
                                  <FaUser />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {waitingListPagination.totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        className="pagination-btn"
                        onClick={() =>
                          handlePageChange(
                            waitingListPagination.currentPage - 1
                          )
                        }
                        disabled={waitingListPagination.currentPage === 1}
                      >
                        <FaChevronLeft />
                      </button>

                      <span className="pagination-info">
                        Trang {waitingListPagination.currentPage} /{" "}
                        {waitingListPagination.totalPages}
                      </span>

                      <button
                        className="pagination-btn"
                        onClick={() =>
                          handlePageChange(
                            waitingListPagination.currentPage + 1
                          )
                        }
                        disabled={
                          waitingListPagination.currentPage ===
                          waitingListPagination.totalPages
                        }
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-waiting">
                  {waitingListLoading ? "Đang tải..." : "Không có người chờ"}
                </div>
              )}
            </div>
          )}

          {/* Joined Players List */}
          <div className="players-section">
            <div className="players-header">
              <h3>
                Người chơi đã tham gia ({joinedPlayersPagination.totalItems}/
                {roomData.maxPlayers})
              </h3>
              {joinedPlayersLoading && (
                <span className="loading-indicator">Đang tải...</span>
              )}
            </div>

            {joinedPlayers.length > 0 ? (
              <>
                <div className="players-list">
                  {joinedPlayers.map((player) => (
                    <div key={player.id} className="player-card">
                      <div className="player-info">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="player-avatar"
                        />
                        <div className="player-details">
                          <span className="player-name">
                            {player.name}
                            {/* {player.isHost && (
                              <span className="host-badge">Host</span>
                            )} */}
                          </span>
                        </div>
                      </div>

                      {/* Player actions based on role */}
                      <div className="player-actions">
                        {/* Chat button for all users */}
                        {player.id !== userId && (
                          <button
                            className="chat-btn"
                            onClick={() => handleChatWithPlayer(player.id)}
                            title="Chat"
                          >
                            <FaComments />
                          </button>
                        )}

                        {player.id !== userId && (
                          <button
                            className="profile-btn"
                            onClick={() => handleViewProfile(player.id)}
                            title="Xem profile"
                          >
                            <FaUser />
                          </button>
                        )}

                        {/* Kick button only for host and not for themselves */}
                        {/* {isHost && player.id !== userId && !player.isHost && (
                          <button
                            className="kick-btn"
                            onClick={() => handleKickPlayer(player.id)}
                            title="Kick khỏi phòng"
                          >
                            <FaTimes />
                          </button>
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination cho joined players */}
                {joinedPlayersPagination.totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      onClick={() =>
                        handleJoinedPlayersPageChange(
                          joinedPlayersPagination.currentPage - 1
                        )
                      }
                      disabled={joinedPlayersPagination.currentPage === 1}
                    >
                      <FaChevronLeft />
                    </button>

                    <span className="pagination-info">
                      Trang {joinedPlayersPagination.currentPage} /{" "}
                      {joinedPlayersPagination.totalPages}
                    </span>

                    <button
                      className="pagination-btn"
                      onClick={() =>
                        handleJoinedPlayersPageChange(
                          joinedPlayersPagination.currentPage + 1
                        )
                      }
                      disabled={
                        joinedPlayersPagination.currentPage ===
                        joinedPlayersPagination.totalPages
                      }
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-players">
                {joinedPlayersLoading
                  ? "Đang tải..."
                  : "Chưa có người chơi tham gia"}
              </div>
            )}
          </div>

          {/* Rating Section - Only show for players in room */}
          {isPlayerInRoom && (
            <div className="rating-section">
              <h3>Đánh giá</h3>

              {/* Players Rating */}
              <div className="rating-group">
                <h4>Đánh giá người chơi</h4>

                {ratingsLoading && (
                  <div className="ratings-loading">Đang tải đánh giá...</div>
                )}

                {joinedPlayers
                  .filter((p) => !p.isHost && p.id !== userId)
                  .map((player) => (
                    <div key={player.id} className="rating-item">
                      <div className="rating-info">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="rating-avatar"
                        />
                        <span className="rating-name">{player.name}</span>
                      </div>
                      <StarRating
                        rating={loadedRatings[player.id] || 0}
                        onRatingChange={(rating) =>
                          handlePlayerRating(player.id, rating)
                        }
                        isRated={hasRated[player.id] || false}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div className="profile-popup-overlay" onClick={closeProfilePopup}>
          <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
            <div className="profile-popup-header">
              <h3>Thông tin người chơi</h3>
              <button className="close-btn" onClick={closeProfilePopup}>
                <FaTimes />
              </button>
            </div>

            <div className="profile-popup-content">
              {profileLoading ? (
                <div className="profile-loading">Đang tải thông tin...</div>
              ) : selectedProfile ? (
                <div className="profile-details">
                  <div className="profile-avatar-section">
                    <img
                      src={selectedProfile.avatarUrl || selectedProfile.avatar}
                      alt={selectedProfile.fullName || selectedProfile.name}
                      className="profile-popup-avatar"
                    />
                  </div>

                  <div className="profile-info-section">
                    <div className="profile-info-item">
                      <strong>Tên:</strong>{" "}
                      {selectedProfile.fullName || selectedProfile.name}
                    </div>

                    {selectedProfile.phoneNumber && (
                      <div className="profile-info-item">
                        <strong>Số điện thoại:</strong>{" "}
                        {selectedProfile.phoneNumber}
                      </div>
                    )}

                    {selectedProfile.age && (
                      <div className="profile-info-item">
                        <strong>Tuổi:</strong> {selectedProfile.age}
                      </div>
                    )}

                    {selectedProfile.height && (
                      <div className="profile-info-item">
                        <strong>Chiều cao:</strong> {selectedProfile.height} cm
                      </div>
                    )}

                    {selectedProfile.weight && (
                      <div className="profile-info-item">
                        <strong>Cân nặng:</strong> {selectedProfile.weight} kg
                      </div>
                    )}

                    {selectedProfile.email && (
                      <div className="profile-info-item">
                        <strong>Email:</strong> {selectedProfile.email}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="profile-error">
                  Không thể tải thông tin người dùng
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RoomDetail);
