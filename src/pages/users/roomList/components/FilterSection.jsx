import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./FilterSection.scss";
import { minutesToTime, timeToMinutes } from "../../../../utils/timeUtils";

const FilterSection = ({ onFiltersChange, filters }) => {
  const [localFilters, setLocalFilters] = useState({
    name: filters?.name || "",
    maxPlayers: filters?.maxPlayers || "",
    maxRoomFee: filters?.maxRoomFee || "",
    status: "Waiting",
    startTime: filters?.startTime || "00:00",
    endTime: filters?.endTime || "23:59",
    ...filters,
  });

  const [timeRange, setTimeRange] = useState([
    timeToMinutes(localFilters.startTime),
    timeToMinutes(localFilters.endTime),
  ]);

  useEffect(() => {
    setTimeRange([
      timeToMinutes(localFilters.startTime),
      timeToMinutes(localFilters.endTime),
    ]);
  }, [localFilters.startTime, localFilters.endTime]);

  const updateFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const apiFilters = { ...localFilters };
    Object.keys(apiFilters).forEach((key) => {
      if (
        apiFilters[key] === "" ||
        apiFilters[key] === null ||
        apiFilters[key] === undefined
      ) {
        delete apiFilters[key];
      }
    });
    onFiltersChange(apiFilters);
  }, [localFilters]);

  const resetFilters = () => {
    const reset = {
      name: "",
      maxPlayers: "",
      maxRoomFee: "",
      status: "Waiting",
      startTime: "00:00",
      endTime: "23:59",
    };
    setLocalFilters(reset);
    setTimeRange([0, 1439]);
    onFiltersChange({});
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    updateFilter("startTime", minutesToTime(range[0]));
    updateFilter("endTime", minutesToTime(range[1]));
  };

  return (
    <div className="filter-section">
      {/* Tên phòng */}
      <div className="filter-group">
        <h3>Tên phòng</h3>
        <input
          type="text"
          placeholder="Tên phòng..."
          value={localFilters.name}
          onChange={(e) => updateFilter("name", e.target.value)}
          className="search-input"
        />
      </div>

      {/* Số người tối đa */}
      <div className="filter-group">
        <h3>Số người tối đa</h3>
        <input
          type="number"
          placeholder="Số người..."
          value={localFilters.maxPlayers}
          onChange={(e) =>
            updateFilter(
              "maxPlayers",
              e.target.value ? Number.parseInt(e.target.value) : ""
            )
          }
          className="number-input"
          min="1"
        />
      </div>

      {/* Giá tối đa */}
      <div className="filter-group">
        <h3>Giá tối đa (VNĐ)</h3>
        <div className="price-input">
          <input
            type="number"
            placeholder="Giá tối đa..."
            value={localFilters.maxRoomFee}
            step={1000}
            onChange={(e) =>
              updateFilter(
                "maxRoomFee",
                e.target.value ? Number.parseInt(e.target.value) : ""
              )
            }
            className="number-input"
            min="0"
          />
        </div>
      </div>

      {/* Giờ chơi */}
      <div className="filter-group">
        <h3>Giờ chơi</h3>
        <div className="time-labels">
          <span>{minutesToTime(timeRange[0])}</span>
          <span>{minutesToTime(timeRange[1])}</span>
        </div>
        <Slider
          range
          min={0}
          max={1439}
          step={15}
          allowCross={false}
          value={timeRange}
          onChange={handleTimeRangeChange}
        />
      </div>

      <button className="reset-filters-btn" onClick={resetFilters}>
        Đặt lại bộ lọc
      </button>
    </div>
  );
};

export default FilterSection;
