// CounselingTherapy.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "../Styles/CounselingTherapy.css"; // رابط ملف التنسيق

const CounselingTherapy = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your session request has been submitted.");
    setFormData({ name: "", email: "", date: "", message: "" });
  };

  return (
    <div className="ct-page-wrapper  text-center">
      <Container>
        <h1 className="ct-title mb-4">Counseling & Therapy</h1>
        <p className="ct-subtitle lead text-muted mb-5">
          Our licensed counselors are available for individual and group therapy
          sessions to help you manage stress, anxiety, depression, and other
          mental health concerns.
        </p>

        <Row className="mb-5">
          <Col md="6">
            <div className="ct-section-box">
              <h3 className="ct-section-title">Individual Therapy</h3>
              <p>
                One-on-one sessions with a licensed professional to explore your
                thoughts, feelings, and coping strategies.
              </p>
            </div>
          </Col>
          <Col md="6">
            <div className="ct-section-box">
              <h3 className="ct-section-title">Group Therapy</h3>
              <p>
                Join others in a safe, supportive environment to share
                experiences and receive guidance from a professional
                facilitator.
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <h4 className="ct-form-title mb-3">Book a Session</h4>
            <Form className="ct-form" onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name" className="ct-label">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  className="ct-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="email" className="ct-label">
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  className="ct-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="date" className="ct-label">
                  Preferred Date
                </Label>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  className="ct-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="message" className="ct-label">
                  Additional Notes
                </Label>
                <Input
                  type="textarea"
                  name="message"
                  id="message"
                  className="ct-input"
                  placeholder="Describe your concerns (optional)"
                  value={formData.message}
                  onChange={handleChange}
                />
              </FormGroup>

              <Button type="submit" color="primary" className="ct-submit-btn">
                Submit Request
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CounselingTherapy;
