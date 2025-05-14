import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSun, FaMoon, FaUserNurse } from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../Styles/styles.css";

const NurseNavbar = () => {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);

  const translations = {
    en: {
      brand: "Nurse Dashboard",
      dashboard: "Dashboard",
      appointments: "Manage Appointments",
      medicines: "View Medicines",
      addMedicine: "Add Medicine",
      prescriptions: "Prescriptions",
      allPrescriptions: "All Prescriptions",
      comments: "Comments & Replies",
      logout: "Logout",
      toggleLang: "عربي",
    },
    ar: {
      brand: "لوحة تحكم الممرضة",
      dashboard: "لوحة التحكم",
      appointments: "إدارة المواعيد",
      medicines: "عرض الأدوية",
      addMedicine: "إضافة دواء",
      prescriptions: "الوصفات الطبية",
      allPrescriptions: "عرض جميع الوصفات",
      comments: "التعليقات والردود",
      logout: "تسجيل الخروج",
      toggleLang: "English",
    },
  };

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-white", darkMode);
  }, [darkMode]);

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "bg-body-tertiary"
      }`}
    >
      <div className="container-fluid">
        <span className="navbar-brand">
          <FaUserNurse className="me-2" />
          {translations[language].brand}
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNurseContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNurseContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/NurseDashboard">
                {translations[language].dashboard}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AppointmentsManagement">
                {translations[language].appointments}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/MedicineList">
                {translations[language].medicines}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AddMedicine">
                {translations[language].addMedicine}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Prescriptions">
                {translations[language].prescriptions}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ViewPrescriptions">
                {translations[language].allPrescriptions}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/CommentsReplies">
                {translations[language].comments}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/logout">
                {translations[language].logout}
              </Link>
            </li>
          </ul>

          <button className="btn adbtm" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className="btn adbtm" onClick={toggleLanguage}>
            {translations[language].toggleLang}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NurseNavbar;
