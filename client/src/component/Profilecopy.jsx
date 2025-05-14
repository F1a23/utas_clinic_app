import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Collapse,
  CardBody,
} from "reactstrap";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClinicMedical,
  FaPills,
  FaFileMedical,
} from "react-icons/fa";
import "../Styles/profile.css";
import { SERVER_URL } from "../config"; // ✅ تم إضافته

const Profile = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [medicationData, setMedicationData] = useState([]);
  const [showMedications, setShowMedications] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptions, setShowPrescriptions] = useState(false);

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    } else {
      setUserData(user);
      fetchAppointmentData();
      fetchMedications();
      fetchPrescriptions();
    }
  }, [user]);

  const fetchAppointmentData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/getAppointment`, {
        params: { email: user.email },
      });
      const { appointments } = response.data;
      setAppointments(Array.isArray(appointments) ? appointments : []);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/getUserMedications`, {
        params: { email: user.email },
      });
      setMedicationData(response.data);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/getPrescriptions`);
      const userPrescriptions = res.data.prescriptions.filter(
        (p) => p.patientName === user.name
      );
      setPrescriptions(userPrescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const isPastDate = (date) => new Date(date) < new Date();

  return (
    <div className="ntrp-profile-wrapper">
      <h1 className="ntrp-profile-title">Profile</h1>
      <br />
      <Container className="ntrp-container">
        <Card className="ntrp-card">
          <Row className="ntrp-row">
            <Col md="4" className="ntrp-sidebar">
              <h3 className="ntrp-username">
                <br />
                <FaUser className="me-2" />
                <br />
                {userData?.name}
              </h3>
            </Col>

            <Col md="8" className="ntrp-info">
              <h4 className="ntrp-section-title">Personal Information</h4>
              <div className="ntrp-info-item">
                <span className="ntrp-label">
                  <FaEnvelope /> Email:
                </span>
                <span className="ntrp-value">{userData?.email}</span>
              </div>
              <div className="ntrp-info-item">
                <span className="ntrp-label">
                  <FaPhone /> Phone Number:
                </span>
                <span className="ntrp-value">{userData?.contactNo}</span>
              </div>
              <div className="ntrp-info-item">
                <span className="ntrp-label">
                  <FaCalendarAlt /> Birth Date:
                </span>
                <span className="ntrp-value">
                  {userData?.birthDate
                    ? new Date(userData.birthDate).toLocaleDateString()
                    : "Not available"}
                </span>
              </div>

              <hr className="ntrp-divider" />
              <h4 className="ntrp-section-title">Appointments</h4>
              <Button
                color="secondary"
                size="sm"
                onClick={() => setShowAppointments(!showAppointments)}
              >
                {showAppointments ? "Hide Appointments" : "Show Appointments"}
              </Button>
              <Collapse isOpen={showAppointments}>
                {appointments.map((a, idx) => (
                  <Card key={idx} body className="mt-2">
                    <p>
                      <FaClinicMedical /> <strong>Service:</strong>{" "}
                      {a.serviceType}
                    </p>
                    <p>
                      <FaCalendarAlt /> <strong>Date:</strong>{" "}
                      {formatDate(a.appointmentDate)}
                    </p>
                    <p>
                      <strong>Time:</strong> {a.appointmentTime}
                    </p>
                    <p className="text-muted">
                      Status:{" "}
                      {isPastDate(a.appointmentDate) ? "Ended" : "Active"}
                    </p>
                  </Card>
                ))}
              </Collapse>

              <hr className="ntrp-divider" />
              <h4 className="ntrp-section-title">Medication Requests</h4>
              <Button
                color="info"
                size="sm"
                className="mb-2"
                onClick={() => setShowMedications(!showMedications)}
              >
                <FaPills className="me-1" />
                {showMedications ? "Hide Medications" : "Show Medications"}
              </Button>
              <Collapse isOpen={showMedications}>
                {medicationData.length > 0 ? (
                  medicationData
                    .filter(
                      (med) =>
                        Array.isArray(med.medications) &&
                        med.medications.length > 0
                    )
                    .map((med, index) => (
                      <Card className="mt-2" key={index}>
                        <CardBody>
                          {med.medications.map((item, i) => (
                            <p key={i}>
                              <FaPills className="me-2" />{" "}
                              <strong>{item.name}</strong>: {item.quantity}
                            </p>
                          ))}
                        </CardBody>
                      </Card>
                    ))
                ) : (
                  <p>No medication records found.</p>
                )}
              </Collapse>

              <hr className="ntrp-divider" />
              <h4 className="ntrp-section-title">Prescriptions Records</h4>
              <Button
                color="warning"
                size="sm"
                className="mb-2"
                onClick={() => setShowPrescriptions(!showPrescriptions)}
              >
                <FaFileMedical className="me-1" />
                {showPrescriptions
                  ? "Hide Medical Records"
                  : "Show Medical Records"}
              </Button>
              <Collapse isOpen={showPrescriptions}>
                {prescriptions.length > 0 ? (
                  prescriptions.map((pres, index) => (
                    <Card className="mt-2" key={index}>
                      <CardBody>
                        <p>
                          <FaCalendarAlt className="me-2" /> Visit Date:{" "}
                          {formatDate(pres.visitDate)}
                        </p>
                        <p>
                          <strong>Time:</strong> {pres.visitTime}
                        </p>
                        <p>
                          <strong>Prescription:</strong> {pres.prescription}
                        </p>
                        <p>
                          <strong>Recommendations:</strong>{" "}
                          {pres.recommendations || "None"}
                        </p>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <p>No Prescriptions records found.</p>
                )}
              </Collapse>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
