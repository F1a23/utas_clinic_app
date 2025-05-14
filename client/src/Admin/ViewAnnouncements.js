import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAnnouncements,
  deleteAnnouncement,
} from "../Features/AnnouncementSlice";
import axios from "axios";
import * as ENV from "../config";
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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";

const ViewAnnouncements = () => {
  const dispatch = useDispatch();
  const { announcements, status, error } = useSelector(
    (state) => state.announcements
  );

  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    dispatch(getAnnouncements());
  }, [dispatch]);

  const toggleModal = () => setModal(!modal);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      dispatch(deleteAnnouncement(id))
        .unwrap()
        .then(() => toast.success("✅ Announcement deleted successfully!"))
        .catch(() => toast.error("❌ Failed to delete the announcement."));
    }
  };

  const handleEditClick = (ann) => {
    setEditData(ann);
    setModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${ENV.SERVER_URL}/updateAnnouncement/${editData._id}`, {
        title: editData.title,
        description: editData.description,
        image: editData.image,
      });
      toast.success("✅ Announcement updated!");
      dispatch(getAnnouncements());
      setModal(false);
    } catch (err) {
      toast.error("❌ Failed to update announcement.");
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">All Announcements</h2>

      {status === "loading" && <p>Loading announcements...</p>}

      {/* ✅ عرض الخطأ فقط إذا لم يكن "Network Error" */}
      {status === "failed" &&
        error &&
        error !== "Network Error" &&
        typeof error === "string" && (
          <p className="text-danger">Error: {error}</p>
        )}

      <Row>
        {announcements.length === 0 ? (
          <p className="text-center">No announcements available.</p>
        ) : (
          announcements.map((ann) => (
            <Col md="4" sm="6" xs="12" key={ann._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <img
                  src={ann.image}
                  alt={ann.title}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <CardBody>
                  <CardTitle tag="h5" className="text-primary">
                    {ann.title}
                  </CardTitle>
                  <CardText>{ann.description}</CardText>
                  <div className="d-flex justify-content-between">
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => handleEditClick(ann)}
                    >
                      <FaEdit className="me-1" /> Update
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(ann._id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* ✅ نموذج التعديل العائم */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update Announcement</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleUpdateSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={editData.title}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                value={editData.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="image">Image URL</Label>
              <Input
                type="url"
                name="image"
                id="image"
                value={editData.image}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <ModalFooter>
              <Button color="primary" type="submit">
                Save Changes
              </Button>{" "}
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default ViewAnnouncements;
