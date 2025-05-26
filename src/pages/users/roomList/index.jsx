import { useCallback, useState } from 'react';
import './style.scss';
import { formatDateForAPI } from '../../../utils/timeUtils';
import SportsTabs from './components/SportsTabs';
import Calendar from './components/Calendar';
import FilterSection from './components/FilterSection';
import MainContent from './components/MainContent';

export default function RoomList() {
  const [activeTab, setActiveTab] = useState("Bóng đá")
  const [filters, setFilters] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date)
  }, [])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
  }

  const combinedFilters = {
    ...filters,
    ...(selectedDate && { date: formatDateForAPI(selectedDate) }),
  }

  return (
    <div className="room-list">
      <header className="room-header">
        <SportsTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

      <div className="room-content">
        <aside className="sidebar">
          <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
          <div className="filter-title">
            <span>Bộ lọc</span>
          </div>
          <FilterSection onFiltersChange={handleFiltersChange} filters={filters} />
        </aside>

        <main className="room-main">
          <MainContent filters={combinedFilters} currentType={activeTab} />
        </main>
      </div>
    </div>
  )
}
