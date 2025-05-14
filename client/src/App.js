import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import ScrollToTop from "./component/ScrollToTop";
import Footer from "./component/Footer";
import Header from "./component/Header";
import AdminNavbar from "./Admin/AdminNavbar";
import NurseNavbar from "./Nurse/NurseNavbar";

// Layouts
import MainLayout from "./component/MainLayout";
import AdminLayout from "./Admin/AdminLayout";
import NurseLayout from "./Nurse/NurseLayout";

// User Pages
import Home from "./component/Home";
import AboutUs from "./component/AboutUs";
import Feedback from "./component/Feedback";
import Services from "./component/Services";
import Contact from "./component/Contact";
import Logout from "./component/Logout";
import Login from "./component/Login";
import ForgotPassword from "./component/ForgotPassword";
import Appointment from "./component/Appointment";
import Education from "./component/Education";
import DirectHealth from "./component/DirectHealth";
import Communication from "./component/Communication";
import MentalHealthServices from "./component/MentalHealthServices";
import RequestYourMedication from "./component/RequestYourMedication";
import DeliveryOrPickUp from "./component/DeliveryOrPickUp";
import PickUpOption from "./component/PickUpOption";
import DeliveryOption from "./component/DeliveryOption";
import MedicationPreparation from "./component/MedicationPreparation";
import Medication from "./component/Medication";
import OrderDelivery from "./component/OrderDelivery";
import Profile from "./component/Profile";
import MedicationSummary from "./component/Medicationlist";
import Order from "./component/Medicationlist";
import Workshops from "./component/Workshops";
import HealthTips from "./component/HealthTips";
import AwarenessCampaigns from "./component/AwarenessCampaigns";
import HealthWebinar from "./component/HealthWebinar";
import CounselingTherapy from "./component/CounselingTherapy";
import EmotionalSupport from "./component/EmotionalSupport";
import SupportGroups from "./component/SupportGroups";
import ResourcesWorkshops from "./component/ResourcesWorkshops";
import ImmediateSupport from "./component/ImmediateSupport";
import SummaryReport from "./component/SummaryReport";

// Admin Pages
import Register from "./Admin/Register";
import AddAnnouncement from "./Admin/AddAnnouncement";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageUsers from "./Admin/ManageUsers";
import ViewFeedback from "./Admin/ViewFeedback";
import ViewAnnouncements from "./Admin/ViewAnnouncements";

// Nurse Pages
import AddMedicine from "./Nurse/AddMedicine";
import AppointmentsManagement from "./Nurse/AppointmentsManagement";
import CommentsReplies from "./Nurse/CommentsReplies";
import MedicinesManagement from "./Nurse/MedicinesManagement";
import NurseDashboard from "./Nurse/NurseDashboard";
import MedicineList from "./Nurse/MedicineList";
import Prescriptions from "./Nurse/Prescriptions";
import ViewPrescriptions from "./Nurse/ViewPrescriptions";
import SessionTimeout from "./component/SessionTimeout";

const App = () => {
  const user = useSelector((state) => state.users.user);
  const isLoggedIn = !!user?.email;
  const userType = user?.userType;

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      {/* Show only ONE navbar based on user type */}
      {isLoggedIn && (
        <>
          {userType === "User" && <Header />}
          {userType === "Admin" && <AdminNavbar />}
          {userType === "Nurse" && <NurseNavbar />}
          <SessionTimeout />
        </>
      )}

      <ScrollToTop />

      <Routes>
        {/* Redirect to login by default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/*  Protected User Routes */}
        <Route
          element={
            <ProtectedRoute>
              {userType === "User" ? <MainLayout /> : <Navigate to="/login" />}
            </ProtectedRoute>
          }
        >
          <Route path="/Home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/services" element={<Services />} />
          <Route path="/direct" element={<DirectHealth />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/education" element={<Education />} />
          <Route path="/mental" element={<MentalHealthServices />} />
          <Route path="/medication" element={<RequestYourMedication />} />
          <Route
            path="/medication-preparation"
            element={<MedicationPreparation />}
          />
          <Route path="/request-medication" element={<Medication />} />
          <Route path="/delivery-or-pick-up" element={<DeliveryOrPickUp />} />
          <Route path="/pick-up-option" element={<PickUpOption />} />
          <Route path="/delivery-option" element={<DeliveryOption />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/medication-summary" element={<MedicationSummary />} />
          <Route path="/order" element={<Order />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orderdelivery" element={<OrderDelivery />} />
          <Route path="/summaryReport" element={<SummaryReport />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/health-tips" element={<HealthTips />} />
          <Route path="/awareness-campaigns" element={<AwarenessCampaigns />} />
          <Route path="/webinar" element={<HealthWebinar />} />
          <Route path="/counseling-therapy" element={<CounselingTherapy />} />
          <Route path="/emotional-support" element={<EmotionalSupport />} />
          <Route path="/support-groups" element={<SupportGroups />} />
          <Route path="/resources-workshops" element={<ResourcesWorkshops />} />
          <Route path="/immediate-support" element={<ImmediateSupport />} />
        </Route>

        {/*  Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              {userType === "Admin" ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" />
              )}
            </ProtectedRoute>
          }
        >
          <Route path="/AddAnnouncement" element={<AddAnnouncement />} />
          <Route path="/ViewAnnouncements" element={<ViewAnnouncements />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/ManageUsers" element={<ManageUsers />} />
          <Route path="/ViewFeedback" element={<ViewFeedback />} />
          <Route path="/Register" element={<Register />} />
        </Route>

        {/*  Protected Nurse Routes */}
        <Route
          element={
            <ProtectedRoute>
              {userType === "Nurse" ? (
                <NurseLayout />
              ) : (
                <Navigate to="/login" />
              )}
            </ProtectedRoute>
          }
        >
          <Route path="/AddMedicine" element={<AddMedicine />} />
          <Route path="/MedicineList" element={<MedicineList />} />
          <Route
            path="/AppointmentsManagement"
            element={<AppointmentsManagement />}
          />
          <Route path="/CommentsReplies" element={<CommentsReplies />} />
          <Route
            path="/MedicinesManagement"
            element={<MedicinesManagement />}
          />
          <Route path="/NurseDashboard" element={<NurseDashboard />} />
          <Route path="/Prescriptions" element={<Prescriptions />} />
          <Route path="/ViewPrescriptions" element={<ViewPrescriptions />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
