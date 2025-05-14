import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <div className="admin-content">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
