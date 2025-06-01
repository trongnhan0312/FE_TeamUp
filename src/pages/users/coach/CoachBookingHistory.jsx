import { memo, useState, useEffect } from "react";
import "../courts/court_history/CourtHistory.scss";
import Swal from "sweetalert2";
import { getUserInfo } from "../../../utils/auth";
import coachBookingService from "../../../services/coachBookingService";
import ratingService from "../../../services/ratingService";
import { statusColors } from "../../../data";

const formatDateDMY = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatTimeHM = (dateStr) => {
  const date = new Date(dateStr);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const groupSlotsByDate = (slots) => {
  const groups = {};

  slots.forEach(({ startTime, endTime }) => {
    const day = formatDateDMY(startTime);
    const timeRange = `${formatTimeHM(startTime)} - ${formatTimeHM(endTime)}`;
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(timeRange);
  });

  return groups;
};

const CoachBookingHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Tuần");
  const [bookingHistory, setBookingHistory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRatings, setUserRatings] = useState({}); // Store user's ratings for coaches
  const pageSize = 10;

  const fetchData = async () => {
    const response = await coachBookingService.getAllByUserId(
      getUserInfo().id,
      currentPage,
      pageSize
    );
    const result = response.resultObj;
    setBookingHistory(result);
    
    // Fetch user's ratings for all coaches in the booking history
    if (result?.items) {
      await fetchUserRatings(result.items);
    }
  };

  const fetchUserRatings = async (bookingItems) => {
    const userId = getUserInfo().id;
    const ratings = {};
    
    // Get unique coach IDs from completed bookings
    const coachIds = [...new Set(
      bookingItems
        .filter(item => item.status === "Completed" && item.coach?.id)
        .map(item => item.coach.id)
    )];

    // Fetch ratings for each coach
    await Promise.all(
      coachIds.map(async (coachId) => {
        try {
          const response = await ratingService.getValueRating(userId, coachId);
          if (response.isSuccessed && response.resultObj?.items?.length > 0) {
            const rating = response.resultObj.items[0];
            ratings[coachId] = {
              ratingValue: rating.ratingValue,
              comment: rating.comment,
              hasRated: rating.ratingValue > 0
            };
          } else {
            ratings[coachId] = { hasRated: false };
          }
        } catch (error) {
          console.error(`Error fetching rating for coach ${coachId}:`, error);
          ratings[coachId] = { hasRated: false };
        }
      })
    );

    setUserRatings(ratings);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData = bookingHistory?.items
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
        await coachBookingService.updateStatus(id, "Completed");
        Swal.fire("Thành công", "Đơn đã được đánh dấu hoàn thành", "success");
        await fetchData();
      } catch (error) {
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
        await coachBookingService.updateStatus(id, "CancelledByUser");
        Swal.fire("Đã hủy", "Đơn đặt sân đã được hủy", "success");
        await fetchData();
      } catch (error) {
        Swal.fire("Lỗi", "Không thể hủy đơn", "error");
      }
    }
  };

  const handleRating = async (coachId, coachName) => {
    const { value: formValues } = await Swal.fire({
      title: `Đánh giá HLV ${coachName}`,
      html: `
        <div style="text-align: left; margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Đánh giá:</label>
          <div style="display: flex; justify-content: center; margin-bottom: 15px;">
            <div class="rating-stars">
              ${[1, 2, 3, 4, 5].map(star => 
                `<span class="star" data-rating="${star}" style="font-size: 24px; color: #ddd; cursor: pointer; margin: 0 2px;">★</span>`
              ).join('')}
            </div>
          </div>
          <input type="hidden" id="rating-value" value="0">
        </div>
        <div style="text-align: left;">
          <label for="comment" style="display: block; margin-bottom: 5px; font-weight: bold;">Nhận xét:</label>
          <textarea 
            id="comment" 
            placeholder="Chia sẻ trải nghiệm của bạn với HLV..."
            style="width: 100%; height: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Gửi đánh giá",
      cancelButtonText: "Hủy",
      preConfirm: () => {
        const rating = document.getElementById('rating-value').value;
        const comment = document.getElementById('comment').value.trim();
        
        if (rating === "0") {
          Swal.showValidationMessage('Vui lòng chọn số sao đánh giá');
          return false;
        }
        
        return {
          rating: parseInt(rating),
          comment: comment
        };
      },
      didOpen: () => {
        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('rating-value');
        
        stars.forEach((star, index) => {
          star.addEventListener('click', () => {
            const rating = index + 1;
            ratingInput.value = rating;
            
            // Update star colors
            stars.forEach((s, i) => {
              if (i < rating) {
                s.style.color = '#ffc107';
              } else {
                s.style.color = '#ddd';
              }
            });
          });
          
          // Hover effect
          star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
              if (i <= index) {
                s.style.color = '#ffc107';
              } else {
                s.style.color = '#ddd';
              }
            });
          });
        });
        
        document.querySelector('.rating-stars').addEventListener('mouseleave', () => {
          const currentRating = parseInt(ratingInput.value);
          stars.forEach((s, i) => {
            if (i < currentRating) {
              s.style.color = '#ffc107';
            } else {
              s.style.color = '#ddd';
            }
          });
        });
      }
    });

    if (formValues) {
      try {
        await ratingService.create(getUserInfo().id, coachId, formValues.rating, formValues.comment);
        
        Swal.fire({
          title: "Cảm ơn!",
          text: "Đánh giá của bạn đã được gửi thành công",
          icon: "success"
        });
        
        await fetchData(); // This will also refresh the ratings
      } catch (error) {
        Swal.fire("Lỗi", "Không thể gửi đánh giá", "error");
      }
    }
  };

  const renderRatingSection = (item) => {
    const coachId = item.coach?.id;
    const coachName = item.coach?.fullName;
    const userRating = userRatings[coachId];

    if (userRating?.hasRated) {
      // Show existing rating
      return (
        <div className="existing-rating">
          <div className="rating-display">
            <span className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star}
                  style={{ 
                    color: star <= userRating.ratingValue ? '#ffc107' : '#ddd',
                    fontSize: '16px'
                  }}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="rating-value">({userRating.ratingValue}/5)</span>
          </div>
          {userRating.comment && (
            <div className="rating-comment" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              "{userRating.comment}"
            </div>
          )}
        </div>
      );
    } else {
      // Show rating button
      return (
        <button
          className="action-button rating-btn"
          onClick={() => handleRating(coachId, coachName)}
          aria-label={`Đánh giá HLV ${coachName}`}
        >
          Đánh giá
        </button>
      );
    }
  };

  return (
    <div className="pitchHistory">
      <div className="historySection">
        <div className="header">
          <h2>Lịch sử đặt HLV</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="searchInput"
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
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th>Tên HLV</th>
                <th>Mã đơn</th>
                <th>Khung giờ</th>
                <th>Sân</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => {
                const groupedSlots = groupSlotsByDate(item.slots || []);

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">
                      {item.coach?.fullName}
                    </td>
                    <td className="border border-gray-300 p-2">{item.id}</td>
                    <td className="border border-gray-300 p-2">
                      {Object.entries(groupedSlots).map(([date, times]) => (
                        <div key={date}>
                          {date}: {times.join(", ")}
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.court?.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      style={{ color: statusColors[item.status] || "gray" }}
                    >
                      {item.status}
                    </td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      {item.status === "Completed" ? (
                        renderRatingSection(item)
                      ) : (
                        <>
                          {item.status === "Confirmed" && (
                            <button
                              className="action-button complete"
                              onClick={() => handleComplete(item.id)}
                              aria-label={`Hoàn thành booking ${item.id}`}
                            >
                              Hoàn thành
                            </button>
                          )}
                          {item.status === "Pending" && (
                            <button
                              className="action-button cancel"
                              onClick={() => handleCancel(item.id)}
                              aria-label={`Hủy booking ${item.id}`}
                            >
                              Hủy
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {bookingHistory?.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={bookingHistory?.hasPreviousPage === false}
              aria-label="Trang trước"
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
              disabled={bookingHistory?.hasNextPage === false}
              aria-label="Trang sau"
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CoachBookingHistory);