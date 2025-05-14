import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "../Styles/EmotionalSupport.css";

const EmotionalSupport = () => {
  return (
    <Container className="emotional-support-container">
      <Row className="text-center emotional-support-header mb-4">
        <Col>
          <h2>Emotional Support</h2>
          <p className="text-muted">
            We provide a safe space for students and staff to discuss their
            emotional challenges and receive support from compassionate
            professionals.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center emotional-support-body">
        <Col md="8">
          <p>
            Whether you're dealing with academic stress, personal relationships,
            or life changes, our emotional support services are here for you.
            You don't have to face your feelings alone— we're here to listen and
            help guide you through.
          </p>

          <p>
            Sessions are available with trained professionals who offer
            guidance, empathy, and strategies for coping and healing. This
            service is confidential and available to all members of the
            university community.
          </p>

          <div className="text-center mt-4">
            <Button className="emotional-support-btn">
              Talk to a Counselor
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EmotionalSupport;
