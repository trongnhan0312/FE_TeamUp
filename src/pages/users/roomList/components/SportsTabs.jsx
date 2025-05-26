import "./SportsTabs.scss"

const SportsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "Pickleball", label: "Pickleball" },
    { id: "Bóng đá", label: "Bóng đá" },
    { id: "Cầu lông", label: "Cầu lông" },
  ]

  return (
    <div className="sports-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SportsTabs
