import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../config";
import "../Styles/Order.css";

const Medicationlist = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state || {};
  const savedMeds = localStorage.getItem("selectedMeds");
  const parsedMeds = savedMeds ? JSON.parse(savedMeds) : {};

  const selectedMedications =
    locationState.selectedMedications || Object.keys(parsedMeds);
  const quantities = locationState.quantities || parsedMeds;

  const savedDelivery = localStorage.getItem("deliveryData");
  const parsedDelivery = savedDelivery ? JSON.parse(savedDelivery) : {};

  const [deliveryMethod, setDeliveryMethod] = useState(
    locationState.deliveryMethod || parsedDelivery.deliveryMethod || ""
  );

  const [deliveryDetails, setDeliveryDetails] = useState({
    building:
      locationState.deliveryDetails?.building ||
      parsedDelivery.deliveryDetails?.building ||
      "",
    buildingName:
      locationState.deliveryDetails?.buildingName ||
      parsedDelivery.deliveryDetails?.buildingName ||
      "",
    room:
      locationState.deliveryDetails?.room ||
      parsedDelivery.deliveryDetails?.room ||
      "",
  });

  const [allMeds, setAllMeds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/getMedicines`);
      setAllMeds(res.data.medicines);
    } catch {
      setError("❌ Failed to load medications");
    }
  };

  const selectedData = allMeds.filter((m) =>
    selectedMedications.includes(m._id)
  );

  const handleDeliveryChange = (e) => {
    setDeliveryMethod(e.target.value);
  };

  const handleNextClick = () => {
    setError("");

    if (!deliveryMethod) {
      setError("⚠️ Please select a delivery method.");
      return;
    }

    if (
      deliveryMethod === "delivery" &&
      (!deliveryDetails.building ||
        !deliveryDetails.buildingName ||
        !deliveryDetails.room)
    ) {
      setError("⚠️ Please fill in all delivery details.");
      return;
    }

    localStorage.setItem(
      "deliveryData",
      JSON.stringify({ deliveryMethod, deliveryDetails })
    );

    navigate("/summaryReport", {
      state: {
        selectedMedications,
        quantities,
        deliveryMethod,
        deliveryDetails,
      },
    });
  };

  const handleBackClick = () => {
    navigate("/medication");
  };

  return (
    <div className="medlist-wrapper">
      <Container className="medlist-container">
        <h2 className="medlist-title">📝 Confirm Your Order</h2>
        {error && <Alert color="danger">{error}</Alert>}

        <Row>
          {selectedData.map((med) => (
            <Col md={4} key={med._id} className="mb-4">
              <Card className="medlist-card">
                <CardImg
                  top
                  src={med.image}
                  alt={med.name}
                  className="medlist-image"
                />
                <CardBody>
                  <CardTitle tag="h5">{med.name}</CardTitle>
                  <CardText>
                    Quantity: <strong>{quantities[med._id]}</strong>
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="delivery-section mt-4">
          <h5>Choose Delivery Option</h5>
          <div>
            <Input
              type="radio"
              id="delivery"
              name="deliveryMethod"
              value="delivery"
              checked={deliveryMethod === "delivery"}
              onChange={handleDeliveryChange}
            />
            <label htmlFor="delivery" className="ms-2">
              Delivery
            </label>
          </div>
          <div className="mt-2">
            <Input
              type="radio"
              id="pickup"
              name="deliveryMethod"
              value="pickup"
              checked={deliveryMethod === "pickup"}
              onChange={handleDeliveryChange}
            />
            <label htmlFor="pickup" className="ms-2">
              Pickup from Clinic
            </label>
          </div>
        </div>

        {deliveryMethod === "delivery" && (
          <div className="delivery-details mt-3">
            <h5>Enter Delivery Details</h5>
            <Input
              type="text"
              placeholder="Building Number"
              value={deliveryDetails.building}
              onChange={(e) =>
                setDeliveryDetails({ ...deliveryDetails, building: e.target.value })
              }
              className="medlist-input"
            />
            <Input
              type="text"
              placeholder="Building Name"
              value={deliveryDetails.buildingName}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  buildingName: e.target.value,
                })
              }
              className="medlist-input mt-2"
            />
            <Input
              type="text"
              placeholder="Room Number"
              value={deliveryDetails.room}
              onChange={(e) =>
                setDeliveryDetails({ ...deliveryDetails, room: e.target.value })
              }
              className="medlist-input mt-2"
            />
          </div>
        )}

        {deliveryMethod === "pickup" && (
          <div className="pickup-info mt-4">
            <h5>Pickup Information</h5>
            <p>
              📍 University Clinic, Main Pharmacy Desk <br />
              🕒 Sunday - Thursday, 8:00 AM - 2:00 PM
            </p>
          </div>
        )}

<div className="btns-wrapper">
  <Button className="btn-bor2" onClick={handleNextClick}>
  OK
</Button>
        <Button className="btn-bor1" onClick={handleBackClick}>
  Back
</Button>



        </div>
      </Container>
    </div>
  );
};

export default Medicationlist;
