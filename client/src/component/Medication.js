import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Input,
  Button,
} from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import "../Styles/medication.css";

const Medication = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [medications, setMedications] = useState([]);
  const [selected, setSelected] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("az");

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    const fetchAndRestore = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/getMedicines`);
        const meds = res.data.medicines;
        setMedications(meds);

        const saved = localStorage.getItem("selectedMeds");
        if (saved) {
          const parsed = JSON.parse(saved);
          const validIds = meds.map((m) => m._id);
          const filtered = {};
          for (const id in parsed) {
            if (validIds.includes(id)) {
              filtered[id] = 1;
            }
          }
          setSelected(filtered);
        }

        sessionStorage.setItem("lastPage", location.pathname);
      } catch {
        toast.error("\u274C Failed to load medications.", {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
        });
      }
    };

    fetchAndRestore();
  }, [location]);

  useEffect(() => {
    localStorage.setItem("selectedMeds", JSON.stringify(selected));
  }, [selected]);

  const handleCheckboxChange = (id) => {
    setSelected((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id];
      } else {
        updated[id] = 1;
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    const selectedIds = Object.keys(selected);
    if (selectedIds.length === 0) {
      toast.error("\u274C Please select at least one medication.", {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
      return;
    }

    try {
      const res = await axios.post(`${SERVER_URL}/checkUserMedicationLimit`, {
        email: user.email,
        selectedMedications: selectedIds,
      });

      if (!res.data.allowed) {
        toast.error(`\uD83D\uDEAB ${res.data.message}`, {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
          autoClose: 5000,
        });
        return;
      }

      navigate("/order", {
        state: {
          selectedMedications: selectedIds,
          quantities: selected,
        },
      });
    } catch (error) {
      toast.error("\u274C Could not validate your request. Please try again.", {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
    }
  };

  const handleClearSelection = () => {
    if (Object.keys(selected).length === 0) {
      toast.info("\u2139\uFE0F No medications to clear.");
      return;
    }

    setSelected({});
    localStorage.removeItem("selectedMeds");

    toast.success(
      "\uD83D\uDDD1\uFE0F All selected medications have been cleared.",
      {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      }
    );
  };

  const filteredAndSorted = medications
    .filter((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "az") return a.name.localeCompare(b.name);
      if (sortOrder === "za") return b.name.localeCompare(a.name);
      if (sortOrder === "stock") return b.quantity - a.quantity;
      return 0;
    });

  return (
    <div className="medicine-full-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="med-cart-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="med-cart-icon-wrapper position-relative">
            <FaShoppingCart size={28} className="med-cart-icon" />
            {Object.keys(selected).length > 0 && (
              <span className="med-cart-badge pulse">
                {Object.keys(selected).length}
              </span>
            )}
          </div>
          <FaTrashAlt
            size={24}
            className="med-trash-icon"
            title="Clear Selection"
            onClick={handleClearSelection}
          />
        </div>

        <div className="d-flex gap-3 align-items-center flex-wrap">
          <Input
            type="text"
            placeholder="\uD83D\uDD0D Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="med-search-input"
          />
          <Input
            type="select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="med-sort-select"
          >
            <option value="az">Sort: A → Z</option>
            <option value="za">Sort: Z → A</option>
            <option value="stock">Sort by Stock</option>
          </Input>
        </div>
      </div>

      <h2 className="medicine-title animated-underline">
        Request Your Medication
      </h2>
      <Row>
        {filteredAndSorted.map((med) => (
          <Col md={4} key={med._id} className="mb-4">
            <Card className="medicine-card">
              <CardImg
                top
                src={med.image}
                alt={med.name}
                className="medicine-image"
              />
              <CardBody>
                <div className="d-flex align-items-center">
                  <Input
                    type="checkbox"
                    checked={!!selected[med._id]}
                    onChange={() => handleCheckboxChange(med._id)}
                    disabled={med.quantity === 0}
                    style={{ marginRight: "10px" }}
                  />
                  <CardTitle tag="h5" className="medicine-card-title">
                    {med.name}
                  </CardTitle>
                </div>
                <p className="medicine-card-text">
                  <strong>Type:</strong> {med.type}
                </p>
                <p className="medicine-card-text">
                  <strong>In Stock:</strong>{" "}
                  {med.quantity === 0 ? "Out of Stock" : med.quantity}
                </p>
                <p className="medicine-card-text">{med.description}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-3">
        <Button className="medicine-submit-btn" onClick={handleSubmit}>
          Continue to Order
        </Button>
      </div>
    </div>
  );
};

export default Medication;
