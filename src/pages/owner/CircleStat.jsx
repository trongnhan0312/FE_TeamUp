import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircleStat = ({ title, value, percentage }) => {
  return (
    <div className="card flex justify-between items-center gap-4">
      <div>
        <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div style={{ width: "100px", height: "100px" }}>
        <CircularProgressbar
          value={percentage}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: "#A3E635",
            trailColor: "#fdecea",
            strokeLinecap: "round",
          })}
        />
      </div>
    </div>
  );
};

export default CircleStat;
