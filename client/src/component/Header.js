import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import "../Styles/styles.css";

const Header = ({ userType }) => {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
const [searchTerm, setSearchTerm] = useState("");

  const translations = {
    en: {
      brand: "University Clinic",
      home: "Home",
      about: "About Us",
      feedback: "Feedback & Reviews",
      services: "Services",
      directHealth: "Direct Health Services",
      appointment: "Appointment Scheduling",
      education: "Health Education & Awareness",
      communication: "Communication & Support",
      mentalHealth: "Mental Health Services",
      medication: "Medication Management",
      contact: "Contact Us",
      Register: "Register",
      logout: "Logout",
      search: "Search",
      toggleLang: "عربي",
    },
    ar: {
      brand: "العيادة الجامعية",
      home: "الرئيسية",
      about: "معلومات عنا",
      feedback: "التقييمات والمراجعات",
      services: "الخدمات",
      directHealth: "الخدمات الصحية المباشرة",
      appointment: "جدولة المواعيد",
      education: "التثقيف والتوعية الصحية",
      communication: "التواصل والدعم",
      mentalHealth: "خدمات الصحة النفسية",
      medication: "إدارة الأدوية",
      contact: "اتصل بنا",
      Register: "تسجيل مستخدم جديد",
      logout: "تسجيل الخروج",
      search: "بحث",
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
const highlightText = () => {
  const keyword = searchTerm.trim();
  if (!keyword) return;

  // أزل أي تمييز سابق
  const existing = document.querySelectorAll(".highlighted-text");
  existing.forEach((el) => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });

  // البحث داخل محتوى الموقع
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (
          node.parentNode &&
          !["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.parentNode.nodeName) &&
          node.nodeValue.toLowerCase().includes(keyword.toLowerCase())
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    },
    false
  );

  const keywordLower = keyword.toLowerCase();

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const index = textNode.nodeValue.toLowerCase().indexOf(keywordLower);
    if (index >= 0) {
      const span = document.createElement("span");
      span.className = "highlighted-text";
      span.textContent = textNode.nodeValue.substr(index, keyword.length);

      const after = textNode.splitText(index);
      after.nodeValue = after.nodeValue.substring(keyword.length);
      textNode.parentNode.insertBefore(span, after);
    }
  }
};

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
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/Home">
                {translations[language].home}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                {translations[language].about}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/feedback">
                {translations[language].feedback}
              </Link>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/services"
                role="button"
                data-bs-toggle="dropdown"
              >
                {translations[language].services}
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/direct">
                    {translations[language].directHealth}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/appointment">
                    {translations[language].appointment}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/education">
                    {translations[language].education}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/communication">
                    {translations[language].communication}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/mental">
                    {translations[language].mentalHealth}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/medication">
                    {translations[language].medication}
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                {translations[language].contact}
              </Link>
            </li>

            {userType === "Admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/Register">
                  {translations[language].Register}
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/logout">
                {translations[language].logout}
              </Link>
            </li>
          </ul>
<div className="header-right-group">
  <div className="nav-search-wrapper">
<input
  type="text"
  className="nav-search-input"
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>


    <span className="nav-search-icon" onClick={highlightText}>
  <FaSearch />
</span>

  </div>

  <button className="header-btn" onClick={toggleDarkMode}>
    {darkMode ? <FaSun /> : <FaMoon />}
  </button>

  <button className="header-btn lang-btn" onClick={toggleLanguage}>
    {translations[language].toggleLang}
  </button>

  <Link to="/profile" className="header-btn profile-btn">
    <FaUserCircle size={20} />
  </Link>
</div>


        </div>
      </div>
    </nav>
  );
};

export default Header;
