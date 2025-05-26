import { useState } from "react";
import "./FilterSection.scss";
import { timeToTimeSpan } from "../../../../utils/timeUtils";

const FilterSection = ({ onFiltersChange, filters }) => {
  const [localFilters, setLocalFilters] = useState({
    name: filters?.name || "",
    maxPlayers: filters?.maxPlayers || "",
    maxRoomFee: filters?.maxRoomFee || "",
    // startTime: { hours: 5, minutes: 0 },
    // endTime: { hours: 18, minutes: 0 },
    status: "Waiting",
    ...filters,
  });

  const updateFilter = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    // Convert to API format
    const apiFilters = { ...newFilters };

    // Convert time to TimeSpan format
    if (newFilters.startTime) {
      apiFilters.startTime = timeToTimeSpan(
        newFilters.startTime.hours,
        newFilters.startTime.minutes
      );
    }
    if (newFilters.endTime) {
      apiFilters.endTime = timeToTimeSpan(
        newFilters.endTime.hours,
        newFilters.endTime.minutes
      );
    }

    // Remove empty values
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
  };

  const resetFilters = () => {
    const resetFilters = {
      name: "",
      maxPlayers: "",
      maxRoomFee: "",
    //   startTime: { hours: 5, minutes: 0 },
    //   endTime: { hours: 18, minutes: 0 },
      status: "Waiting",
    };
    setLocalFilters(resetFilters);
    onFiltersChange({});
  };

  return (
    <div className="filter-section">
      {/* Search by name */}
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

      {/* Max Players filter */}
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

      {/* Max Room Fee filter */}
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

      {/* Time Range filter */}
      {/* <div className="filter-group">
        <h3>Giờ chơi</h3>
        <div className="time-range">
          <div className="time-display">
            {formatTimeDisplay(
              localFilters.startTime.hours,
              localFilters.startTime.minutes
            )}{" "}
            -{" "}
            {formatTimeDisplay(
              localFilters.endTime.hours,
              localFilters.endTime.minutes
            )}
          </div>

          <div className="time-inputs">
            <div className="time-input-group">
              <label>Từ</label>
              <div className="time-input">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={localFilters.startTime.hours}
                  onChange={(e) =>
                    updateFilter("startTime", {
                      ...localFilters.startTime,
                      hours: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={localFilters.startTime.minutes}
                  onChange={(e) =>
                    updateFilter("startTime", {
                      ...localFilters.startTime,
                      minutes: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="time-input-group">
              <label>Đến</label>
              <div className="time-input">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={localFilters.endTime.hours}
                  onChange={(e) =>
                    updateFilter("endTime", {
                      ...localFilters.endTime,
                      hours: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={localFilters.endTime.minutes}
                  onChange={(e) =>
                    updateFilter("endTime", {
                      ...localFilters.endTime,
                      minutes: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <button className="reset-filters-btn" onClick={resetFilters}>
        Đặt lại bộ lọc
      </button>
    </div>
  );
};

export default FilterSection;
