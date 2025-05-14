import React from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "../Admin/AdminNavbar";
import NurseNavbar from "../Nurse/NurseNavbar";
import Header from "./Header";

const DynamicNavbar = () => {
  const userType = useSelector((state) => state.users.user?.userType);

  if (userType === "Admin") return <AdminNavbar />;
  if (userType === "Nurse") return <NurseNavbar />;
  return <Header />;
};

export default DynamicNavbar;
