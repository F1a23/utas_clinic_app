// ✅ Updated SummaryReport to ensure correct submission logic
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { saveUserMedication } from "../Features/MedicationSlice";
import axios from "axios";
import { SERVER_URL } from "../config";
import "../Styles/medication.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SummaryReport = () => {
  const user = useSelector((state) => state.users.user);
  const medicationState = useSelector((state) => state.medication);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const locationState = location.state || {};
  const savedMeds = localStorage.getItem("selectedMeds");
  const parsedMeds = savedMeds ? JSON.parse(savedMeds) : {};

  const selectedMedications =
    locationState.selectedMedications || Object.keys(parsedMeds);
  const quantities = locationState.quantities || parsedMeds;

  const [deliveryMethod] = useState(locationState.deliveryMethod || "");
  const [deliveryDetails] = useState(locationState.deliveryDetails || {});
  const [name] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [contactNo] = useState(user?.contactNo || "");
  const [allMeds, setAllMeds] = useState([]);
  const [previousOrder, setPreviousOrder] = useState(null);
  const [loadingPreviousCheck, setLoadingPreviousCheck] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    const fetchSelectedMeds = async () => {
      try {
        const res = await axios.post(`${SERVER_URL}/getSelectedMedicines`, {
          ids: selectedMedications,
        });
        setAllMeds(res.data.medicines);
      } catch (err) {
        toast.error("❌ Failed to fetch medication info from server.");
        scrollToTop();
      }
    };

    if (selectedMedications.length > 0) {
      fetchSelectedMeds();
    }
  }, [user, navigate, selectedMedications]);

  useEffect(() => {
    const fetchPreviousOrder = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/checkMedicationOrder`, {
          params: { email },
        });

        if (res.data.exists && res.data.order) {
          setPreviousOrder(res.data.order);
          localStorage.setItem("medicationSubmitted", "true");
        } else {
          localStorage.removeItem("medicationSubmitted");
        }
      } catch (err) {
        console.error("Error fetching previous order:", err);
      } finally {
        setLoadingPreviousCheck(false);
      }
    };

    if (email) {
      fetchPreviousOrder();
    }
  }, [email]);

  const selectedData = allMeds.filter((med) =>
    selectedMedications.includes(med._id)
  );

  const handleConfirm = async () => {
    if (loadingPreviousCheck) {
      toast.info("⏳ Please wait... verifying order status.");
      return;
    }

    if (
      previousOrder ||
      localStorage.getItem("medicationSubmitted") === "true"
    ) {
      toast.error("⚠️ You have already confirmed this medication request.");
      scrollToTop();
      return;
    }

    if (!name || !email || !contactNo) {
      toast.error("❌ Please ensure user information is complete.");
      scrollToTop();
      return;
    }

    if (!selectedMedications.length || !Object.keys(quantities).length) {
      toast.error(
        "❌ Please confirm your selected medications and quantities."
      );
      scrollToTop();
      return;
    }

    const medicationsData = selectedData.map((med) => ({
      id: med._id,
      name: med.name,
      quantity: quantities[med._id],
    }));

    const payload = {
      name,
      email,
      contactNo,
      selectedMedications: selectedMedications.map(String),
      medications: medicationsData,
      deliveryMethod,
      deliveryDetails: {
        buildingName: deliveryDetails.buildingName,
        buildingNumber: deliveryDetails.building,
        roomNumber: deliveryDetails.room,
      },
    };

    try {
      const response = await axios.post(
        `${SERVER_URL}/saveUserMedication`,
        payload
      );
      toast.success(response.data.msg || "✅ Order confirmed!");
      scrollToTop();
      localStorage.setItem("medicationSubmitted", "true");
      setPreviousOrder(payload);
    } catch (err) {
      toast.error(err?.response?.data?.error || "❌ Failed to save order.");
      scrollToTop();
    }
  };

  const handleBack = () => {
    navigate("/order", {
      state: {
        selectedMedications,
        quantities,
        deliveryMethod,
        deliveryDetails,
      },
    });
  };

  return (
    <Container className="summary-wrapper">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
        newestOnTop
        theme="colored"
        toastStyle={{ fontSize: "1.1rem", textAlign: "center" }}
      />
      <div className="summary-container">
        <h2 className="summary-title">Medication Summary Report</h2>

        {!loadingPreviousCheck && previousOrder && (
          <div className="summary-section previous-order">
            <h5>📌 You already submitted this order:</h5>
            <p>
              <strong>Name:</strong> {previousOrder.name}
            </p>
            <p>
              <strong>Email:</strong> {previousOrder.email}
            </p>
            <p>
              <strong>Phone:</strong> {previousOrder.contactNo}
            </p>
            <h6 className="mt-3">Medications:</h6>
            <ul>
              {previousOrder.medications.map((med, index) => (
                <li key={index}>
                  {med.name} - Quantity: {med.quantity}
                </li>
              ))}
            </ul>
            <p>
              <strong>Delivery Method:</strong> {previousOrder.deliveryMethod}
            </p>
            {previousOrder.deliveryDetails && (
              <>
                <p>
                  <strong>Building:</strong>{" "}
                  {previousOrder.deliveryDetails.buildingName}
                </p>
                <p>
                  <strong>Room:</strong>{" "}
                  {previousOrder.deliveryDetails.roomNumber}
                </p>
              </>
            )}
          </div>
        )}

        {!loadingPreviousCheck && !previousOrder && (
          <>
            <div className="summary-section">
              <h5>User Information</h5>
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Phone Number:</strong> {contactNo}
              </p>
            </div>
            <div className="summary-section">
              <h5>Selected Medications</h5>
              <Row>
                {selectedData.map((med) => (
                  <Col xs={12} sm={6} md={4} key={med._id}>
                    <div className="summary-med-item">
                      <p>
                        <strong>Name:</strong> {med.name}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {quantities[med._id]}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            <div className="summary-section">
              <h5>Delivery Method</h5>
              <p>{deliveryMethod === "delivery" ? "Delivery" : "Pickup"}</p>
              {deliveryMethod === "delivery" && (
                <>
                  <p>
                    <strong>Building Name:</strong>{" "}
                    {deliveryDetails?.buildingName}
                  </p>
                  <p>
                    <strong>Building Number:</strong>{" "}
                    {deliveryDetails?.building}
                  </p>
                  <p>
                    <strong>Room Number:</strong> {deliveryDetails?.room}
                  </p>
                </>
              )}
              {deliveryMethod === "pickup" && (
                <div className="pickup-summary">
                  <p>
                    You have chosen to pick up your medication from the
                    university clinic.
                  </p>
                  <p>
                    <strong>📍 Location:</strong> University Clinic, Main
                    Pharmacy Desk
                  </p>
                  <p>
                    <strong>🕒 Pick-Up Hours:</strong> Sunday - Thursday, 8:00
                    AM - 2:00 PM
                  </p>
                </div>
              )}
            </div>
            <div className="summary-btns-wrapper">
              <Button className="btn-bor1" onClick={handleBack}>
                Back
              </Button>
              <Button
                className="btn-bor2"
                onClick={handleConfirm}
                disabled={medicationState.loading}
              >
                {medicationState.loading ? "Saving..." : "Confirm"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default SummaryReport;
