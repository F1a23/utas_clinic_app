import React from "react";
import "../Styles/ClinicExtras.css";

const HealthTips = () => {
  return (
    <div className="clinic-extras-container">
      <div className="clinic-extras-card tips-card">
        <h1 className="clinic-extras-title text-green">
          Health Tips & Resources
        </h1>
        <p className="clinic-extras-description">
          Access a wide variety of health tips and resources covering topics
          such as <strong>nutrition</strong>, <strong>fitness</strong>,{" "}
          <strong>sleep</strong>, and <strong>mental well-being</strong>.
        </p>
      </div>
    </div>
  );
};

export default HealthTips;
