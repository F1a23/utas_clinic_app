import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import { SERVER_URL } from "../config";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "../Styles/Feedback.css"; // ✅ نستخدم نفس التنسيق
import feedbackImage from "../component/images/app.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock, faStethoscope, faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";


const Appointment = () => {
  const user = useSelector((state) => state.users?.user);
  const navigate = useNavigate();

  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [serviceType, setServiceType] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contactNo, setContactNo] = useState(user?.contactNo || "");
  const [isLoading, setIsLoading] = useState(false);

  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const isWeekend = (date) => {
    const day = date?.getDay();
    return day === 5 || day === 6;
  };

  const isValidTime = (time) => {
    if (!time) return false;
    const hour = time.getHours();
    const minute = time.getMinutes();
    return hour >= 8 && (hour < 14 || (hour === 14 && minute === 0));
  };

  const checkTimeAvailability = async (date, time) => {
    try {
      const dateStr = date.toISOString().split("T")[0];
      const timeStr = time.toTimeString().slice(0, 5);
      const response = await axios.get(`${SERVER_URL}/checkAppointment`, {
        params: { date: dateStr, time: timeStr },
      });
      return !response.data.isTimeTaken;
    } catch {
      toast.error("❌ Failed to check availability.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!appointmentDate || !appointmentTime || !serviceType) {
      toast.error("⚠️ Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate <= today) {
      toast.error("❌ Please choose a date after today.");
      setIsLoading(false);
      return;
    }

    if (isWeekend(appointmentDate)) {
      toast.error("❌ Cannot book on Friday or Saturday.");
      setIsLoading(false);
      return;
    }

    if (!isValidTime(appointmentTime)) {
      toast.error("❌ Time must be between 08:00 and 14:00.");
      setIsLoading(false);
      return;
    }

    const dateStr = appointmentDate.toISOString().split("T")[0];
    const timeStr = appointmentTime.toTimeString().slice(0, 5);

    const isAvailable = await checkTimeAvailability(appointmentDate, appointmentTime);
    if (!isAvailable) {
      toast.warning("⚠️ This time is already booked.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/saveAppointment`, {
        name,
        email,
        contactNo,
        appointmentDate: dateStr,
        appointmentTime: timeStr,
        serviceType,
      });

      toast.success("✅ Appointment scheduled successfully.");
      setAppointmentDate(null);
      setAppointmentTime(null);
      setServiceType("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "❌ Failed to schedule appointment.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fb-dashboard main-layout">
       <img src={feedbackImage} alt="Feedback Visual" className="dashboard-background-img" />
       
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="fb-container">
        <div className="fb-header">
          <h2 className="fb-title">Appointment Scheduling</h2>
          <p>Fill in your details to book a convenient time.</p>
        </div>

        <div className="fb-form-wrapper">
          <Form onSubmit={handleSubmit} className="fb-form">
            <FormGroup>
  <Label for="name">Full Name</Label>
  <div className="input-icon-wrapper">
    <FontAwesomeIcon icon={faUser} className="input-icon" />
    <Input type="text" id="name" value={name} readOnly />
  </div>
</FormGroup>

<FormGroup>
  <Label for="email">Email Address</Label>
  <div className="input-icon-wrapper">
    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
    <Input type="email" id="email" value={email} readOnly />
  </div>
</FormGroup>

<FormGroup>
  <Label for="phone">Phone Number</Label>
  <div className="input-icon-wrapper">
    <FontAwesomeIcon icon={faPhone} className="input-icon" />
    <Input type="text" id="phone" value={contactNo} readOnly />
  </div>
</FormGroup>

<FormGroup>
  <Label for="appointmentDate">Appointment Date</Label>
  <div className="input-icon-wrapper">
    <DatePicker
      id="appointmentDate"
      selected={appointmentDate}
      onChange={(date) => setAppointmentDate(date)}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select appointment date"
      className="form-control"
      ref={dateInputRef}
    /><span role="img" aria-label="calendar"  className="label-icon">📅</span> 
  </div>
</FormGroup>

<FormGroup>
  <Label for="appointmentTime">Appointment Time</Label>
  <div className="input-icon-wrapper">
   
    <DatePicker
      id="appointmentTime"
      selected={appointmentTime}
      onChange={(time) => setAppointmentTime(time)}
      showTimeSelect
      showTimeSelectOnly
      timeCaption="Time"
      dateFormat="HH:mm"
      timeFormat="HH:mm"
      placeholderText="Select time (24-hour)"
      className="form-control"
      ref={timeInputRef}
    /><span role="img" aria-label="clock"  className="label-icon">⏰</span>

  </div>
</FormGroup>

<FormGroup>
  <Label for="serviceType">Service Type</Label>
  <div className="input-icon-wrapper">
 
    <Input
      type="select"
      id="serviceType"
      value={serviceType}
      onChange={(e) => setServiceType(e.target.value)}
      required
    >
      <option value=""> Select Service</option>
      <option value="primary-healthcare">Primary Healthcare</option>
      <option value="mental-health">Mental Health</option>
      <option value="vaccination">Vaccination</option>
      <option value="chronic-disease">Chronic Disease Management</option>
    </Input>
  </div>
</FormGroup>

            <button type="submit" className="btn fb-submit-btn" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Appointment"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
