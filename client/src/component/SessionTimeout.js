import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import "../Styles/SessionTimeout.css";

const SessionTimeout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const warningTimeout = useRef(null);
  const logoutTimeout = useRef(null);

  const warningTime = 60 * 60 * 1000; // 1 دقيقة
  const logoutDelay = 30 * 1000; // بعد 30 ثانية

  const resetTimer = () => {
    clearTimeout(warningTimeout.current);
    clearTimeout(logoutTimeout.current);

    warningTimeout.current = setTimeout(() => {
      setShowModal(true);
      logoutTimeout.current = setTimeout(() => {
        handleLogout();
      }, logoutDelay);
    }, warningTime);
  };

  const handleLogout = () => {
    setShowModal(false);
    dispatch(logout());
    navigate("/login");
  };

  const handleContinue = () => {
    setShowModal(false);
    resetTimer();
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      clearTimeout(warningTimeout.current);
      clearTimeout(logoutTimeout.current);
    };
  }, []);

  return (
    showModal && (
      <div className="custom-modal-overlay">
        <div className="custom-modal-box">
          <h2 className="custom-modal-title">⚠️ Session Expiring</h2>
          <p className="custom-modal-message">
            Your session is about to expire due to inactivity.
          </p>
          <div className="custom-button-container">
            <button
              onClick={handleContinue}
              className="custom-modal-continue-button"
            >
              Stay Logged In
            </button>
            <button
              onClick={handleLogout}
              className="custom-modal-logout-button"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SessionTimeout;
