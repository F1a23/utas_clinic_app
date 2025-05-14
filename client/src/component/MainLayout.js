import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <>
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
