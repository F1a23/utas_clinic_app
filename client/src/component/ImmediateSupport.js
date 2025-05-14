import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "../Styles/ImmediateSupport.css";

const ImmediateSupport = () => {
  return (
    <Container className="immediate-support-container text-center">
      <Row className="immediate-support-header mb-4">
        <Col>
          <h2 className="immediate-support-title">Need Immediate Support?</h2>
          <p className="immediate-support-text">
            If you're feeling overwhelmed or in need of urgent support, please
            don't hesitate to reach out to our team. We are here to listen,
            help, and guide you towards the resources you need.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md="6" className="immediate-support-contact-box">
          <p className="immediate-support-info">
            🔴 <strong>Emergency Contact:</strong> Call our 24/7 helpline at{" "}
            <strong>+968 99292300</strong>
          </p>
          <p className="immediate-support-info">
            📧 <strong>Email Support:</strong> clinic@university.edu
          </p>
          <p className="immediate-support-info">
            🕐 <strong>Walk-in Hours:</strong> Sunday–Thursday, 8 AM – 2 PM
          </p>
          <div className="mt-4">
            <Button color="danger" className="immediate-support-button">
              Talk to a Counselor Now
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ImmediateSupport;
