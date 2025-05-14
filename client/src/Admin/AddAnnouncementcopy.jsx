import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addAnnouncement,
  getAnnouncements,
} from "../Features/AnnouncementSlice";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { toast } from "react-toastify";
import { FaPlusCircle, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../Styles/AddAnnouncement.css";

function AddAnnouncement() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.image) {
      toast.error("⚠️ Please fill in all fields.");
      return;
    }

    const formPayload = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
    };

    dispatch(addAnnouncement(formPayload))
      .unwrap()
      .then(() => {
        dispatch(getAnnouncements());
        toast.success("✅ Announcement added successfully!");
        setFormData({ title: "", description: "", image: "" });
      })
      .catch((err) => {
        const errorMessage =
          typeof err === "string"
            ? err
            : err?.error || err?.message || "❌ Failed to add announcement.";
        toast.error(String(errorMessage));
      });
  };

  return (
    <Container fluid className="announcement-container ">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="announcement-card shadow p-4">
            <CardBody>
              <CardTitle
                tag="h3"
                className="announcement-title text-center mb-4 text-primary"
              >
                <FaPlusCircle className="me-2" />
                Add New Announcement
              </CardTitle>
              <hr className="announcement-divider" />
              <Form onSubmit={handleSubmit} className="announcement-form">
                <Row className="mb-3">
                  <Col md="6">
                    <FormGroup>
                      <Label for="title" className="announcement-label">
                        Title
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Enter title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="announcement-input"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="description" className="announcement-label">
                        Description
                      </Label>
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="announcement-input"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md="12">
                    <FormGroup>
                      <Label for="image" className="announcement-label">
                        Image URL
                      </Label>
                      <Input
                        type="url"
                        name="image"
                        id="image"
                        placeholder="Enter image URL"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="announcement-input"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="text-center">
                  <Button
                    color="primary"
                    size="lg"
                    type="submit"
                    className="announcement-submit-btn"
                  >
                    <FaPlusCircle className="me-2" />
                    Add Announcement
                  </Button>
                  <br />
                  <br />
                  <Link
                    to="/ViewAnnouncements"
                    className="announcement-view-btn btn btn-lg"
                  >
                    <FaEye className="me-2" />
                    View Announcements
                  </Link>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddAnnouncement;
