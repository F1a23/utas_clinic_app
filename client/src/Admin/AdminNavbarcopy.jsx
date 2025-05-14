import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../Styles/styles.css";

const AdminNavbar = ({ userType }) => {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);

  const translations = {
    en: {
      brand: "Admin Dashboard",
      dashboard: "Dashboard",
      manageUsers: "Manage Users",
      addAnnouncement: "Add Announcement",
      viewFeedback: "View Feedback",
      logout: "Logout",
      toggleLang: "عربي",
    },
    ar: {
      brand: "لوحة تحكم المشرف",
      dashboard: "لوحة التحكم",
      manageUsers: "إدارة المستخدمين",
      addAnnouncement: "إضافة إعلان",
      viewFeedback: "عرض الملاحظات",
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
        <span className="navbar-brand">{translations[language].brand}</span>
        <img src="logo.png" alt="logo" className="logo" />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarAdminContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarAdminContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/AdminDashboard">
                {translations[language].dashboard}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ManageUsers">
                {translations[language].manageUsers}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AddAnnouncement">
                {translations[language].addAnnouncement}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ViewFeedback">
                {translations[language].viewFeedback}
              </Link>
            </li>

            {userType === "Admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/Register">
                  Register New User
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/logout">
                {translations[language].logout}
              </Link>
            </li>
          </ul>

          <button className="btn theme-toggle ms-2" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className="btn btn-primary ms-2" onClick={toggleLanguage}>
            {translations[language].toggleLang}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
