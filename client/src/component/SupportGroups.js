import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "../Styles/SupportGroups.css";

const SupportGroups = () => {
  return (
    <Container className="support-groups-container">
      <Row className="text-center support-groups-header mb-4">
        <Col>
          <h2>Support Groups</h2>
          <p className="text-muted">
            Join our support groups to connect with others who understand what
            you're going through. Our groups provide a sense of community and
            shared experience.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center support-groups-body">
        <Col md="8">
          <p>
            Whether you're dealing with stress, anxiety, depression, or life
            changes, our support groups are here to provide a space for you to
            share and listen. These groups are led by trained facilitators who
            ensure a safe and supportive environment for all members.
          </p>

          <p>
            Joining a group can help you feel less isolated and more connected
            with others who truly understand. Our groups meet regularly and
            focus on various themes like emotional resilience, stress
            management, and coping strategies.
          </p>

          <div className="text-center mt-4">
            <Button className="support-groups-btn">Join a Support Group</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SupportGroups;
