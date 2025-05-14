import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Features/UserSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Logout.css";

const Logout = () => {
  const { user } = useSelector((state) => state.users);
  const [localUserType, setLocalUserType] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
    } else {
      // ✅ Save userType locally before logout
      setLocalUserType(user.userType);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.clear(); // ✅ Clear localStorage if used
    navigate("/login");
  };

  const handleGoHome = () => {
    if (localUserType === "Admin") {
      navigate("/AdminDashboard");
    } else if (localUserType === "Nurse") {
      navigate("/NurseDashboard");
    } else {
      navigate("/Home");
    }
  };

  return (
    <div className="logout-container text-center">
      <h2>You Have Successfully Logged Out.</h2>
      <p>We Hope To See You Again Soon!</p>

      <div className="clinic-info mt-4">
        <h3>The Salalah Branch Clinic Is Pleased To Welcome You</h3>
        <p>
          Where we prioritize the health and well-being of our students,
          faculty, and staff...
        </p>
      </div>

      <div className="logout-buttons mt-4 d-flex justify-content-center gap-3 flex-wrap">
        <button className="btn btn-danger" onClick={handleLogout}>
          Log Out
        </button>
        <button className="btn btn-secondary" onClick={handleGoHome}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Logout;
