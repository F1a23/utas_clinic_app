import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "../config";
import {
  Button,
  Input,
  FormGroup,
  Label,
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
  const pageTopRef = useRef(null);

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
    const { appointmentDate, appointmentTime } = currentEdit;
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      toast.error("❌ Please choose a date after today.");
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      toast.error("❌ Cannot book appointments on Friday or Saturday.");
      return;
    }

    const [hour, minute] = appointmentTime.split(":").map(Number);
    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 8 ||
      hour > 14 ||
      (hour === 14 && minute > 0)
    ) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      toast.error("❌ Appointment time must be between 08:00 and 14:00.");
      return;
    }

    try {
      const availabilityRes = await axios.get(
        `${SERVER_URL}/checkAppointment`,
        {
          params: { date: appointmentDate, time: appointmentTime },
        }
      );

      if (availabilityRes.data.isTimeTaken) {
        pageTopRef.current.scrollIntoView({ behavior: "smooth" });
        toast.warning("⚠️ This time slot is already booked.");
        return;
      }

      await axios.put(
        `${SERVER_URL}/updateAppointment/${currentEdit._id}`,
        currentEdit
      );
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      toast.success("✅ Appointment updated successfully.");
      dispatch(getAppointments());
      setEditModal(false);
    } catch (error) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      toast.error(
        error.response?.data?.error || "❌ Failed to update appointment."
      );
    }
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
      const res = await axios.get(`${SERVER_URL}/checkPrescription`, {
        params: {
          name: appointment.name, // ✅ استخدم name
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
        },
      });

      if (res.data.exists) {
        pageTopRef.current.scrollIntoView({ behavior: "smooth" });
        toast.warning("⚠️ A prescription already exists for this appointment.");
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
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      toast.error("❌ Error checking prescription. Please try again.");
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
    <Container fluid className="appointments-page" ref={pageTopRef}>
      <ToastContainer position="top-center" autoClose={3000} />{" "}
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
      {/* ✅ نافذة التعديل */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>
          Edit Appointment
        </ModalHeader>
        {currentEdit && (
          <ModalBody>
            <FormGroup>
              <Label>Name</Label>
              <Input
                value={currentEdit.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                value={currentEdit.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Contact No</Label>
              <Input
                value={currentEdit.contactNo}
                onChange={(e) => handleEditChange("contactNo", e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Date</Label>
              <Input
                type="date"
                value={currentEdit.appointmentDate?.slice(0, 10)}
                onChange={(e) =>
                  handleEditChange("appointmentDate", e.target.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Time</Label>
              <Input
                type="time"
                value={currentEdit.appointmentTime}
                onChange={(e) =>
                  handleEditChange("appointmentTime", e.target.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Service Type</Label>
              <Input
                type="select"
                value={currentEdit.serviceType}
                onChange={(e) =>
                  handleEditChange("serviceType", e.target.value)
                }
              >
                <option value="Primary Healthcare">Primary Healthcare</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Chronic Disease Management">
                  Chronic Disease Management
                </option>
              </Input>
            </FormGroup>
          </ModalBody>
        )}
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {/* ✅ نافذة التأكيد */}
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

