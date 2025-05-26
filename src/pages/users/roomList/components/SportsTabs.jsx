import "./SportsTabs.scss"

const SportsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "Pickleball", label: "Pickleball", className: "pickleball-tab" },
    { id: "Bóng đá", label: "Bóng đá", className: "soccer-tab" },
    { id: "Cầu lông", label: "Cầu lông", className: "badminton-tab" },
  ];

  return (
    <div className="sport-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${tab.className} ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SportsTabs;
