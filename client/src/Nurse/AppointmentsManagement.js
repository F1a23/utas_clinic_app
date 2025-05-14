import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { SERVER_URL } from "../config";

import {
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  FaTrash,
  FaExclamationTriangle,
  FaPrescriptionBottleAlt,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointments,
  deleteAppointment,
  updateAppointment,
} from "../Features/AppointmentSlics";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/AppointmentsManagement.css";

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`custom-arrow ${className}`}
      style={{ ...style, left: "-25px" }}
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`custom-arrow ${className}`}
      style={{ ...style, right: "-25px" }}
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );
};

const AppointmentsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments, status, error } = useSelector(
    (state) => state.appointments
  );

  const [editModal, setEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [prescriptionExistsModal, setPrescriptionExistsModal] = useState(false);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const openEditModal = (appointment) => {
    setCurrentEdit(appointment);
    setEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setCurrentEdit({ ...currentEdit, [field]: value });
  };

  const handleUpdate = async () => {
    await dispatch(
      updateAppointment({ id: currentEdit._id, updatedData: currentEdit })
    );
    setEditModal(false);
  };

  const openConfirmModal = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    await dispatch(deleteAppointment(deleteId));
    setConfirmModal(false);
    setDeleteId(null);
  };

  const handlePrescription = async (appointment) => {
    try {
      const formattedDate = new Date(appointment.appointmentDate)
        .toISOString()
        .split("T")[0];

      const res = await axios.get(`${SERVER_URL}/checkPrescription`, {
        params: {
          name: appointment.name,
          date: formattedDate,
          time: appointment.appointmentTime,
        },
      });

      if (res.data.exists) {
        setPrescriptionExistsModal(true); // ✅ افتح البوكس
      } else {
        navigate("/Prescriptions", {
          state: {
            name: appointment.name,
            email: appointment.email,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
          },
        });
      }
    } catch (err) {
      console.error("Failed to check prescription:", err);
      toast.error("⚠️ Error checking prescription. Please try again.");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    rows: 3,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          rows: 1,
        },
      },
    ],
  };

  // ✅ التصفية حسب اسم المريض
  const filteredAppointments = appointments.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container fluid className="appointments-page">
      <h1 className="appointments-title text-center mb-4">
        Appointments Management
      </h1>

      {/* ✅ خانة البحث */}
      <div className="d-flex justify-content-center mb-4">
        <Input
          type="text"
          placeholder="🔍 Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            maxWidth: "400px",
            borderRadius: "8px",
            padding: "10px 15px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {status === "loading" && <p className="text-center">Loading...</p>}
      {status === "failed" && (
        <p className="text-center text-danger">Error: {error}</p>
      )}

      <Slider {...settings} className="appointments-slider">
        {filteredAppointments.map((app) => (
          <div key={app._id} className="appointment-card-wrapper px-2 py-3">
            <Card className="appointment-card shadow-sm">
              <CardBody>
                <CardTitle tag="h5" className="fw-bold text-primary">
                  {app.name}
                </CardTitle>
                <CardText className="text-muted small">
                  <strong>Email:</strong> {app.email} <br />
                  <strong>Contact:</strong> {app.contactNo} <br />
                  <strong>Date:</strong>{" "}
                  {new Date(app.appointmentDate).toLocaleDateString()} <br />
                  <strong>Time:</strong> {app.appointmentTime} <br />
                  <strong>Service:</strong> {app.serviceType}
                </CardText>
                <div className="appointment-buttons">
                  <Button color="info" onClick={() => handlePrescription(app)}>
                    <FaPrescriptionBottleAlt className="me-1" /> Prescription
                  </Button>
                  <Button color="warning" onClick={() => openEditModal(app)}>
                    <FaEdit className="me-1" /> Edit
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => openConfirmModal(app._id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </Slider>

      {/*  Modal: Prescription Already Exists */}
      <Modal
        isOpen={prescriptionExistsModal}
        toggle={() => setPrescriptionExistsModal(false)}
      >
        <ModalHeader toggle={() => setPrescriptionExistsModal(false)}>
          <FaExclamationTriangle className="text-warning me-2" />
          Prescription Already Exists
        </ModalHeader>
        <ModalBody className="text-center">
          A prescription has already been entered for this appointment.
          <br />
          You cannot submit another one.
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => setPrescriptionExistsModal(false)}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>

      {/* نافذة التأكيد */}
      <Modal
        isOpen={confirmModal}
        toggle={() => setConfirmModal(!confirmModal)}
      >
        <ModalHeader toggle={() => setConfirmModal(!confirmModal)}>
          <FaExclamationTriangle className="text-warning me-2" /> Confirm Delete
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this appointment? This action cannot
          be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteConfirmed}>
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AppointmentsManagement;
