import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Alert,
  Input,
} from "reactstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SERVER_URL } from "../config";
import "../Styles/ViewPrescriptions.css";

const ViewPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        borderRadius: "50%",
        width: "45px",
        height: "45px",
        zIndex: 10,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.3s ease",
        left: "-30px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <FaChevronLeft color="#fff" size={20} />
    </div>
  );
};

const ViewNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        borderRadius: "50%",
        width: "45px",
        height: "45px",
        zIndex: 10,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.3s ease",
        right: "-30px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <FaChevronRight color="#fff" size={20} />
    </div>
  );
};

const ViewPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/getPrescriptions`)
      .then((res) => {
        setPrescriptions(res.data.prescriptions);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load prescriptions");
        setLoading(false);
      });
  }, []);

  const grouped = prescriptions.reduce((acc, item) => {
    if (!acc[item.patientName]) acc[item.patientName] = [];
    acc[item.patientName].push(item);
    return acc;
  }, {});

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <ViewNextArrow />,
    prevArrow: <ViewPrevArrow />,
  };

  const filteredGroups = Object.entries(grouped).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container fluid className="prescriptions-page">
      <h2 className="text-center mb-4 text-primary fw-bold">
        All Prescriptions by Patient
      </h2>
      <div className="mb-4 d-flex justify-content-center">
        <Input
          type="text"
          placeholder="🔍 Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            maxWidth: "400px",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <Alert color="danger">{error}</Alert>}

      {filteredGroups.length === 0 && !loading ? (
        <p className="text-center">No prescriptions available.</p>
      ) : (
        <Slider {...sliderSettings}>
          {filteredGroups.map(([patientName, list]) => (
            <div key={patientName} className="p-3">
              <Card className="shadow p-4">
                <CardTitle tag="h4" className="text-primary mb-4 text-center">
                  {patientName}
                </CardTitle>
                <CardBody>
                  {list.map((presc, index) => (
                    <div key={presc._id} className="mb-4">
                      <CardTitle tag="h6" className="mb-2">
                        Visit {index + 1} – {presc.visitDate?.slice(0, 10)}
                      </CardTitle>
                      <CardText className="mb-2">
                        <strong>Gender:</strong> {presc.gender} <br />
                        <strong>Age:</strong> {presc.age} <br />
                        <strong>Visit Time:</strong> {presc.visitTime} <br />
                        <strong>Prescription:</strong> {presc.prescription}{" "}
                        <br />
                        <strong>Recommendations:</strong>{" "}
                        {presc.recommendations || "-"}
                      </CardText>
                      <hr />
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>
          ))}
        </Slider>
      )}
    </Container>
  );
};

export default ViewPrescriptions;
