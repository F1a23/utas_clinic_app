import React, { useState, useEffect, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { addPrescription } from "../Features/PrescriptionSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import { SERVER_URL } from "../config";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Prescriptions.css";
import {
  FaUser,
  FaVenusMars,
  FaCalendarCheck,
  FaClock,
  FaFilePrescription,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";

const Prescriptions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.prescriptions);

  const [formData, setFormData] = useState({
    patientName: "",
    gender: "",
    birthDate: "",
    age: "",
    visitDate: null,
    visitTime: null,
    prescription: "",
    recommendations: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const visitDateRef = useRef(null);
  const visitTimeRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      const { name, email, appointmentDate, appointmentTime } = location.state;

      setFormData((prev) => ({
        ...prev,
        patientName: name || "",
        visitDate: appointmentDate ? new Date(appointmentDate) : null,
        visitTime: appointmentTime
          ? new Date(`1970-01-01T${appointmentTime}:00`)
          : null,
      }));

      if (email) {
        axios
          .get(`${SERVER_URL}/getUserByEmail?email=${email}`)
          .then((res) => {
            const { birthDate, gender } = res.data;
            setFormData((prev) => ({
              ...prev,
              birthDate: birthDate
                ? new Date(birthDate).toISOString().slice(0, 10)
                : "",
              gender: gender || "",
            }));
          })
          .catch((err) => {
            console.error("Failed to load user info:", err);
          });
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.birthDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const day = formData.visitDate?.getDay();
    const hour = formData.visitTime?.getHours();
    const minute = formData.visitTime?.getMinutes();

    if (!formData.visitDate || !formData.visitTime) {
      return toast.error(
        "❌ Please select both a date and a time for the visit."
      );
    }

    if (day === 5 || day === 6) {
      return toast.error(
        "❌ Visits are not allowed on Friday or Saturday. Please choose a weekday."
      );
    }

    if (hour < 8 || hour > 14 || (hour === 14 && minute > 0)) {
      return toast.error(
        "❌ Visit time must be between 08:00 and 14:00. Please choose a valid time within this range."
      );
    }

    if (!formData.prescription || formData.prescription.trim() === "") {
      return toast.error("❌ You must enter a prescription before submitting.");
    }

    const visitDateStr = formData.visitDate.toISOString().split("T")[0];
    const visitTimeStr = formData.visitTime.toTimeString().slice(0, 5);

    try {
      const checkRes = await axios.get(
        `${SERVER_URL}/checkPrescriptionAppointment`,
        {
          params: {
            name: formData.patientName,
            date: visitDateStr,
            time: visitTimeStr,
          },
        }
      );

      if (checkRes.data.exists) {
        return toast.warning(
          "⚠️ A prescription already exists for this appointment."
        );
      }
    } catch (err) {
      console.error("Error checking prescription duplication", err);
      return toast.error("❌ Failed to check for duplicate prescription.");
    }

    const payload = {
      ...formData,
      visitDate: visitDateStr,
      visitTime: visitTimeStr,
    };

    dispatch(addPrescription(payload));
    toast.success("✅ Prescription submitted successfully.");
  };

  return (
    <Container fluid className="prescription-wrapper">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeButton={false}
        toastStyle={{
          fontSize: "1.2rem",
          minWidth: "300px",
          textAlign: "center",
        }}
      />
      <div className="prescription-box">
        <div className="prescription-side-blue"></div>
        <div className="prescription-form-white">
          <h2 className="prescription-title">Write a Prescription</h2>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <FaUser className="me-2" />
                Patient Name
              </Label>
              <Input
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaVenusMars className="me-2" />
                Gender
              </Label>
              <Input
                type="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>
                <FaCalendarAlt className="me-2" />
                Birth Date
              </Label>
              <Input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Age</Label>
              <Input value={formData.age || ""} disabled />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaCalendarCheck className="me-2" />
                Visit Date
              </Label>
              <DatePicker
                selected={formData.visitDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, visitDate: date }))
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="Select visit date"
                className="custom-datepicker"
                ref={visitDateRef}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaClock className="me-2" />
                Visit Time
              </Label>
              <DatePicker
                selected={formData.visitTime}
                onChange={(time) =>
                  setFormData((prev) => ({ ...prev, visitTime: time }))
                }
                showTimeSelect
                showTimeSelectOnly
                timeCaption="Time"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                placeholderText="Select time (24-hour)"
                className="custom-datepicker"
                ref={visitTimeRef}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaFilePrescription className="me-2" />
                Prescription
              </Label>
              <Input
                type="textarea"
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                rows={3}
                placeholder="Write the prescription details..."
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaClipboardList className="me-2" />
                Recommendations
              </Label>
              <Input
                type="textarea"
                name="recommendations"
                value={formData.recommendations}
                onChange={handleChange}
                rows={2}
                placeholder="Any special recommendations"
              />
            </FormGroup>

            <Button type="submit" className="prescription-submit-btn">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default Prescriptions;
