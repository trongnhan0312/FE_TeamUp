import { useEffect, useState, useRef, useCallback } from "react";
import ActivityCard from "./ActivityCard";
import "./MainContent.scss";
import roomService from "../../../../services/roomService";

const MainContent = ({ filters, currentType }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const prevFiltersRef = useRef(filters);
  const prevTypeRef = useRef(currentType);

  // Bọc fetchRooms trong useCallback
  const fetchRooms = useCallback(
    async (customPage = 1, customFilters = filters) => {
      setLoading(true);
      try {
        const apiFilters = {
          ...customFilters,
          type: currentType,
          pageNumber: customPage,
          pageSize: pagination.pageSize,
        };

        const response = await roomService.getRooms(apiFilters);

        setRooms(response.resultObj.items || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.resultObj.currentPage || customPage,
          totalItems: response.resultObj.totalItems || 0,
          totalPages: response.resultObj.totalPages || 0,
          hasPreviousPage: response.resultObj.hasPreviousPage || false,
          hasNextPage: response.resultObj.hasNextPage || false,
        }));
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    },
    [currentType, filters, pagination.pageSize]
  );

  // Gọi API lần đầu mount, hoặc khi filters / currentType thay đổi
  useEffect(() => {
    const isFilterChanged =
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    const isTabChanged = prevTypeRef.current !== currentType;

    if (isFilterChanged || isTabChanged) {
      prevFiltersRef.current = filters;
      prevTypeRef.current = currentType;
      setPagination((prev) => ({ ...prev, currentPage: 1 })); // reset page về 1
      fetchRooms(1, filters);
    } else if (rooms.length === 0) {
      // Lần đầu load trang chưa có dữ liệu
      fetchRooms(pagination.currentPage, filters);
    }
  }, [filters, currentType, fetchRooms]);

  // Gọi API khi đổi trang, trừ trang 1 đã được xử lý ở trên
  useEffect(() => {
    if (
      pagination.currentPage !== 1 &&
      JSON.stringify(prevFiltersRef.current) === JSON.stringify(filters) &&
      prevTypeRef.current === currentType
    ) {
      fetchRooms(pagination.currentPage, filters);
    }
  }, [pagination.currentPage, filters, currentType, fetchRooms]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="main-content">
      <div className="content-header">
        <h2>Danh sách phòng {currentType}</h2>
        <div className="results-info">
          {loading ? (
            <span>Đang tải...</span>
          ) : (
            <span>Tìm thấy {pagination.totalItems} phòng</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="rooms-list">
            {rooms.length > 0 ? (
              rooms.map((room) => <ActivityCard key={room.id} room={room} />)
            ) : (
              <div className="no-results">
                <p>Không tìm thấy phòng nào phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="page-btn"
              >
                ‹ Trước
              </button>

              <div className="page-numbers">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`page-btn ${
                        pagination.currentPage === page ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="page-btn"
              >
                Sau ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MainContent;
