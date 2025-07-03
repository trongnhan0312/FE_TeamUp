import { memo, useState, useEffect } from "react";
import "./CourtHistory.scss";
import courtBookingService from "../../../../services/courtBookingService";
import ratingService from "../../../../services/ratingService";
import { getUserInfo } from "../../../../utils/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { statusColors } from "../../../../data";
import { ROUTER } from "../../../../utils/router";
const CourtHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Tuần");
  const [bookingHistory, setBookingHistory] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRatings, setUserRatings] = useState({});
  const pageSize = 10;

  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await courtBookingService.getCourtBookingList(
      getUserInfo().id,
      currentPage,
      pageSize
    );
    const result = response.resultObj;
    setBookingHistory(result);
    setData(result.items);

    if (result?.items) {
      await fetchUserRatings(result.items);
    }
  };

  const fetchUserRatings = async (bookingItems) => {
    const userId = getUserInfo().id;
    const ratings = {};

    const ownerIds = [
      ...new Set(
        bookingItems
          .filter(
            (item) =>
              item.status === "Completed" &&
              item.court?.sportsComplexModelView?.owner?.id
          )
          .map((item) => item.court.sportsComplexModelView.owner.id)
      ),
    ];

    await Promise.all(
      ownerIds.map(async (ownerId) => {
        try {
          const response = await ratingService.getValueRating(userId, ownerId);
          if (response.isSuccessed && response.resultObj?.items?.length > 0) {
            const rating = response.resultObj.items[0];
            ratings[ownerId] = {
              ratingValue: rating.ratingValue,
              comment: rating.comment,
              hasRated: rating.ratingValue > 0,
            };
          } else {
            ratings[ownerId] = { hasRated: false };
          }
        } catch {
          ratings[ownerId] = { hasRated: false };
        }
      })
    );

    setUserRatings(ratings);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const formatDate = (datetimeStr) =>
    new Date(datetimeStr).toLocaleDateString("vi-VN");

  const formatTime = (start, end) => {
    const s = new Date(start).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const e = new Date(end).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${s} - ${e}`;
  };

  const isStartTimeInFuture = (startTime) => {
    const now = new Date();
    return new Date(startTime) > now;
  };

  const handleCreateRoom = (id, startTime) => {
    navigate("/room-create", {
      state: { courtId: id, scheduledTime: startTime },
    });
  };

  const handleComplete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận hoàn thành?",
      text: "Bạn có chắc muốn đánh dấu đơn này là đã hoàn thành?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Hoàn thành",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await courtBookingService.updateStatus(id, "Completed");
        Swal.fire("Thành công", "Đơn đã hoàn thành", "success");
        await fetchData();
      } catch {
        Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
      }
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận hủy?",
      text: "Bạn có chắc muốn hủy đơn đặt sân này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Quay lại",
    });

    if (result.isConfirmed) {
      try {
        await courtBookingService.updateStatus(id, "CancelledByUser");
        Swal.fire("Đã hủy", "Đơn đặt sân đã được hủy", "success");
        await fetchData();
      } catch {
        Swal.fire("Lỗi", "Không thể hủy đơn", "error");
      }
    }
  };

  const handleViewDetail = (id) => {
    navigate(ROUTER.USER.COURT_BOOKING_DETAIL.replace(":bookingId", id));
  };

  const renderRatingSection = (item) => {
    const ownerId = item.court?.sportsComplexModelView?.owner?.id;
    const ownerName = item.court?.sportsComplexModelView?.owner?.fullName;
    const userRating = userRatings[ownerId];

    if (!ownerId) return null;

    if (userRating?.hasRated) {
      return (
        <div>
          <span style={{ color: "#ffc107" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {star <= userRating.ratingValue ? "★" : "☆"}
              </span>
            ))}
          </span>
          {userRating.comment && (
            <div style={{ fontSize: "12px", color: "#666" }}>
              "{userRating.comment}"
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        className="action-button rating-btn"
        onClick={() => handleRating(ownerId, ownerName)}
      >
        Đánh giá chủ sân
      </button>
    );
  };

  const handleRating = async (ownerId, ownerName) => {
    const { value: formValues } = await Swal.fire({
      title: `Đánh giá chủ sân ${ownerName}`,
      html: `
        <input type="range" min="1" max="5" value="3" id="rating"/>
        <textarea id="comment" class="swal2-textarea" placeholder="Nhận xét..."></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          rating: document.getElementById("rating").value,
          comment: document.getElementById("comment").value,
        };
      },
    });

    if (formValues) {
      try {
        await ratingService.create(
          getUserInfo().id,
          ownerId,
          formValues.rating,
          formValues.comment
        );
        Swal.fire("Thành công", "Cảm ơn đánh giá của bạn!", "success");
        fetchData();
      } catch {
        Swal.fire("Lỗi", "Không thể gửi đánh giá", "error");
      }
    }
  };

  const filteredData = data
    .filter((item) => {
      if (filter === "Xác nhận") {
        return ["Confirmed", "Completed"].includes(item.status);
      }
      return true;
    })
    .filter((item) => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        item.user?.fullName?.toLowerCase().includes(lowerSearch) ||
        item.court?.name?.toLowerCase().includes(lowerSearch)
      );
    });

  return (
    <div className="CourtHistory">
      <div className="historySection">
        <div className="header">
          <h2>Lịch sử đặt sân</h2>
          <div className="filters">
            <input
              type="text"
              className="searchInput"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="statusFilter"
            >
              <option value="Mới nhất">Mới nhất</option>
              <option value="Cũ nhất">Cũ nhất</option>
              <option value="Xác nhận">Xác nhận</option>
            </select>
          </div>
          <div className="timeFilter">
            {["Tuần", "Tháng", "Năm"].map((label) => (
              <button
                key={label}
                className={timeFilter === label ? "active" : ""}
                onClick={() => setTimeFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày</th>
                <th>Thời gian</th>
                <th>Sân</th>
                <th>Tổng giá</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{formatDate(item.startTime)}</td>
                  <td>{formatTime(item.startTime, item.endTime)}</td>
                  <td>{item.court?.name}</td>
                  <td>
                    {item.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>
                    <span
                      style={{ color: statusColors[item.status] || "gray" }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-button detail-btn"
                      onClick={() => handleViewDetail(item.id)}
                    >
                      Chi tiết
                    </button>

                    {item.status === "Completed" ? (
                      renderRatingSection(item)
                    ) : (
                      <>
                        {(item.status === "Pending" ||
                          item.status === "Confirmed") &&
                          isStartTimeInFuture(item.startTime) && (
                            <button
                              className="action-button create-room"
                              onClick={() =>
                                handleCreateRoom(
                                  item?.court.id,
                                  item?.startTime
                                )
                              }
                            >
                              Tạo phòng chơi
                            </button>
                          )}

                        {item.status === "Confirmed" && (
                          <button
                            className="action-button complete"
                            onClick={() => handleComplete(item.id)}
                          >
                            Hoàn thành
                          </button>
                        )}
                        {item.status === "Pending" && (
                          <button
                            className="action-button cancel"
                            onClick={() => handleCancel(item.id)}
                          >
                            Hủy
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookingHistory?.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!bookingHistory?.hasPreviousPage}
            >
              &#8592;
            </button>
            <span className="pagination-info">
              {bookingHistory.currentPage} / {bookingHistory.totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() =>
                setCurrentPage((prev) =>
                  bookingHistory?.hasNextPage ? prev + 1 : prev
                )
              }
              disabled={!bookingHistory?.hasNextPage}
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CourtHistory);
