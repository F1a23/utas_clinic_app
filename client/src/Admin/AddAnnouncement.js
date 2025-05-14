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
import { toast, ToastContainer } from "react-toastify";
import { FaPlusCircle, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
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

    const fieldNames = {
      title: "Title",
      description: "Description",
      image: "Image URL",
    };

    // تحقق من جميع الحقول دفعة واحدة
    const emptyFields = Object.entries(formData).filter(
      ([key, value]) => !value || value.trim() === ""
    );

    if (emptyFields.length === 3) {
      toast.error("⚠️ All fields are required. Please fill in the form.");
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }

    if (emptyFields.length > 0) {
      const firstEmpty = emptyFields[0][0];
      toast.error(`⚠️ Please fill in the "${fieldNames[firstEmpty]}" field.`);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }

    // ✅ إذا تم التحقق من كل شيء
    const formPayload = { ...formData };

    dispatch(addAnnouncement(formPayload))
      .unwrap()
      .then(() => {
        dispatch(getAnnouncements());
        toast.success("✅ Announcement added successfully!");
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        setFormData({ title: "", description: "", image: "" });
      })
      .catch((err) => {
        const errorMessage =
          typeof err === "string"
            ? err
            : err?.error || err?.message || "❌ Failed to add announcement.";
        toast.error(String(errorMessage));
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
  };

  return (
    <Container fluid className="announcement-container">
      {/* ✅ Toast Container */}
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
