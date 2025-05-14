import React from "react";
import "../Styles/ClinicExtras.css";

const Workshops = () => {
  return (
    <div className="clinic-extras-container">
      <div className="clinic-extras-card workshop-card">
        <h1 className="clinic-extras-title text-blue">Workshops & Seminars</h1>
        <p className="clinic-extras-description">
          We conduct regular workshops and seminars on topics such as{" "}
          <strong>healthy living</strong>, <strong>mental health</strong>, and{" "}
          <strong>stress management</strong>. Join us to learn valuable tips and
          strategies for a healthier lifestyle.
        </p>
      </div>
    </div>
  );
};

export default Workshops;
