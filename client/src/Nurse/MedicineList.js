// ✅ Modified MedicineList to show all user medication requests in modal (with delete & done buttons)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMedicines,
  deleteMedicine,
  updateMedicine,
} from "../Features/AddmedicineSlice";
import "../Styles/MedicineList.css";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import axios from "axios";
import { SERVER_URL } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaClipboardList, FaTrashAlt, FaCheckCircle } from "react-icons/fa";

const MedicineList = () => {
  const dispatch = useDispatch();
  const { medicines } = useSelector((state) => state.addmedicine);

  const [editModal, setEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allRequests, setAllRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getMedicines());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await dispatch(deleteMedicine(id)).unwrap();
        await dispatch(getMedicines());
        toast.success("✅ Medicine deleted successfully!");
      } catch (err) {
        toast.error("❌ Error deleting medicine.");
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    try {
      await axios.delete(`${SERVER_URL}/deleteMedicationOrder/${id}`);
      toast.success("✅ Request deleted successfully");
      const updated = allRequests.filter((r) => r._id !== id);
      setAllRequests(updated);
      localStorage.setItem("deliveredMeds", JSON.stringify(updated));
    } catch (error) {
      toast.error("❌ Failed to delete request");
    }
  };

  const handleMarkDone = (id) => {
    toast.success("✔️ Marked as delivered.");
    const updated = allRequests.map((r) =>
      r._id === id ? { ...r, done: true } : r
    );
    setAllRequests(updated);
    localStorage.setItem("deliveredMeds", JSON.stringify(updated));
  };

  const openEditModal = (medicine) => {
    setCurrentEdit(medicine);
    setEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setCurrentEdit({ ...currentEdit, [field]: value });
  };

  const handleUpdate = async () => {
    if (
      !currentEdit.name ||
      !currentEdit.type ||
      !currentEdit.description ||
      currentEdit.quantity === ""
    ) {
      toast.error("❌ Please fill all fields.");
      return;
    }
    if (currentEdit.quantity < 0 || currentEdit.quantity > 50) {
      toast.error("❌ Quantity must be between 0 and 50.");
      return;
    }
    try {
      await dispatch(
        updateMedicine({ id: currentEdit._id, data: currentEdit })
      ).unwrap();
      await dispatch(getMedicines());
      setEditModal(false);
      toast.success("✅ Medicine updated successfully!");
    } catch (err) {
      toast.error("❌ Error updating medicine.");
    }
  };

  const handleFetchAllRequests = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/getAllMedicationRequests`);
      const saved = JSON.parse(localStorage.getItem("deliveredMeds") || "[]");
      const updatedRequests = res.data.map((r) => {
        const match = saved.find((s) => s._id === r._id);
        return match ? { ...r, done: match.done } : r;
      });
      setAllRequests(updatedRequests);
      setModalOpen(true);
    } catch (err) {
      toast.error("❌ Failed to fetch all medication requests.");
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="medicine-container position-relative">
      <h2 className="medicine-title">Medicine List</h2>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="🔍 Search by medicine name..."
        className="medicine-search-input"
      />
      <br />

      <ToastContainer position="top-center" autoClose={3000} />

      <Row>
        {filteredMedicines.map((m) => (
          <Col md="4" key={m._id} className="mb-4">
            <Card className="medicine-card">
              <CardBody>
                {m.image && (
                  <img src={m.image} alt={m.name} className="medicine-image" />
                )}
                <CardTitle tag="h5" className="medicine-card-title">
                  {m.name}
                </CardTitle>
                <CardText className="medicine-card-text">
                  Type: {m.type}
                </CardText>
                <CardText className="medicine-card-text">
                  Description: {m.description}
                </CardText>
                <CardText className="medicine-card-text">
                  Quantity: {m.quantity}
                </CardText>
                <div className="medicine-card-buttons">
                  <Button color="warning" onClick={() => openEditModal(m)}>
                    Edit
                  </Button>
                  <Button color="danger" onClick={() => handleDelete(m._id)}>
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Button
        color="dark"
        style={{
          position: "fixed",
          top: "200px",
          right: "20px",
          fontSize: "1.1rem",
          padding: "6px 10px",
          width: "10%",
        }}
        onClick={handleFetchAllRequests}
        title="View All Requests"
      >
        View All Requests <FaClipboardList />
      </Button>

      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        size="xl"
      >
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          All Medication Requests
        </ModalHeader>
        <ModalBody>
          {allRequests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <Row>
              {allRequests.map((req, idx) => (
                <Col xl="6" lg="6" md="12" sm="12" key={idx} className="mb-3">
                  <Card style={{ height: "100%" }}>
                    <CardBody>
                      <h6 className="fw-bold mb-2">{req.name}</h6>
                      <p className="mb-1">
                        <strong>Email:</strong> {req.email}
                      </p>
                      <p className="mb-1">
                        <strong>Date:</strong>{" "}
                        {new Date(req.createdAt).toLocaleString()}
                      </p>
                      <p className="mb-1">
                        <strong>Medications:</strong>
                      </p>
                      <ul className="mb-2">
                        {req.medications.map((m, i) => (
                          <li key={i}>
                            {m.name} - Qty: {m.quantity}
                          </li>
                        ))}
                      </ul>
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleMarkDone(req._id)}
                          disabled={req.done}
                        >
                          <FaCheckCircle /> {req.done ? "Delivered" : "Done"}
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteRequest(req._id)}
                        >
                          <FaTrashAlt /> Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>
          Edit Medicine
        </ModalHeader>
        {currentEdit && (
          <ModalBody>
            <Input
              className="medicine-modal-input"
              value={currentEdit.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
              placeholder="Name"
            />
            <Input
              className="medicine-modal-input"
              value={currentEdit.type}
              onChange={(e) => handleEditChange("type", e.target.value)}
              placeholder="Type"
            />
            <Input
              className="medicine-modal-input"
              value={currentEdit.description}
              onChange={(e) => handleEditChange("description", e.target.value)}
              placeholder="Description"
            />
            <Input
              className="medicine-modal-input"
              type="number"
              min="0"
              max="50"
              value={currentEdit.quantity}
              onChange={(e) => handleEditChange("quantity", e.target.value)}
              placeholder="Quantity"
            />
            <Input
              className="medicine-modal-input"
              value={currentEdit.image}
              onChange={(e) => handleEditChange("image", e.target.value)}
              placeholder="Image URL"
            />
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
    </Container>
  );
};

export default MedicineList;
