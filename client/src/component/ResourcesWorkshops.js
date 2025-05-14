import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "../Styles/ResourcesWorkshopsAlt.css";

const ResourcesWorkshops = () => {
  return (
    <Container className="rw-container">
      <Row className="text-center rw-header mb-4">
        <Col>
          <h2>Resources & Workshops</h2>
          <p>
            We offer workshops on stress, mindfulness, coping strategies & more.
            Explore upcoming events and downloadable tools for emotional
            wellness.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center rw-content">
        <Col md="8">
          <p className="rw-intro">
            Our university clinic provides a wide range of helpful resources
            including:
          </p>
          <ul className="rw-list">
            <li>📘 Guides on stress reduction techniques</li>
            <li>🧘‍♀️ Mindfulness and meditation sessions</li>
            <li>📅 Weekly workshops with professionals</li>
            <li>📄 Downloadable self-help resources</li>
          </ul>

          <div className="text-center mt-4">
            <Button className="rw-button">View Upcoming Events</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResourcesWorkshops;
