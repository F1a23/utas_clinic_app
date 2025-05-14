import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import "../Styles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-wrapper">
      <Container fluid className="admin-dashboard-container">
        <h1 className="admin-dashboard-title text-center mb-4">
          Admin Dashboard
        </h1>

        <p className="admin-dashboard-subtitle text-center mb-5">
          Welcome back, Admin! Use the tools below to manage users, monitor
          feedback, and send announcements.
        </p>
        <br></br>
        <br></br>
        <Row className="gx-5 gy-4">
          <Col md="4">
            <Card className="admin-dashboard-card">
              <CardBody>
                <CardTitle tag="h5" className="admin-card-title">
                  Manage Users
                </CardTitle>
                <CardText className="admin-card-text">
                  View, edit, or delete user accounts and their associated
                  roles.
                </CardText>
                <div className="admin-btn-wrapper">
                  <Button color="primary" href="/ManageUsers">
                    Go
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="admin-dashboard-card">
              <CardBody>
                <CardTitle tag="h5" className="admin-card-title">
                  Add Announcement
                </CardTitle>
                <CardText className="admin-card-text">
                  Post new updates or important announcements for all users to
                  see.
                </CardText>
                <div className="admin-btn-wrapper">
                  <Button color="primary" href="/AddAnnouncement">
                    Go
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="admin-dashboard-card">
              <CardBody>
                <CardTitle tag="h5" className="admin-card-title">
                  View Feedback
                </CardTitle>
                <CardText className="admin-card-text">
                  Review feedback from users to improve the system and services.
                </CardText>
                <div className="admin-btn-wrapper">
                  <Button color="primary" href="/ViewFeedback">
                    Go
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br></br>
        <br></br>
        <br></br>
        <div className="admin-extra-info mt-5">
          <h4>Quick Tips:</h4>
          <ul>
            <li>Check feedback regularly to improve user satisfaction.</li>
            <li>Announcements can include policy changes or urgent updates.</li>
            <li>
              Keep user data accurate and up to date through the Manage Users
              section.
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
