import { Outlet } from "react-router-dom";
import NurseNavbar from "./NurseNavbar";

const NurseLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default NurseLayout;
