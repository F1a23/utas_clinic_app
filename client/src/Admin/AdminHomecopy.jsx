import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Row,
  Col,
} from "reactstrap";
import {
  FaBullhorn,
  FaUsers,
  FaComments,
  FaClipboardList,
  FaUserShield,
} from "react-icons/fa";
import AdminNavbar from "./AdminNavbarcopy";
const AdminHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Users",
      text: "View, add, or update user accounts, assign roles, and maintain access control.",
      icon: <FaUsers size={40} />,
      link: "/admin/manage-users",
    },
    {
      title: "Add Announcement",
      text: "Publish important updates, announcements, or news for all users.",
      icon: <FaBullhorn size={40} />,
      link: "/admin/add-announcement",
    },
    {
      title: "View Feedback",
      text: "Read and respond to feedback submitted by users to improve services.",
      icon: <FaComments size={40} />,
      link: "/admin/view-feedback",
    },
    {
      title: "Reports & Analytics",
      text: "View system reports and user analytics to track performance and improvements.",
      icon: <FaClipboardList size={40} />,
      link: "/admin/reports",
    },
    {
      title: "Admin Settings",
      text: "Update admin profile, manage permissions, and configure system settings.",
      icon: <FaUserShield size={40} />,
      link: "/admin/settings",
    },
  ];

  return (
    <div>
      <AdminNavbar />

      <Container className="py-5">
        <h2 className="text-center mb-4">Admin Home</h2>
        <p className="text-center mb-5">
          Manage key administrative tasks easily from this central dashboard.
        </p>

        <Row>
          {cards.map((card, index) => (
            <Col md={4} sm={6} xs={12} className="mb-4" key={index}>
              <Card className="h-100 text-center shadow-sm">
                <CardBody>
                  <div className="mb-3 text-primary">{card.icon}</div>
                  <CardTitle tag="h5">{card.title}</CardTitle>
                  <CardText>{card.text}</CardText>
                  <Button color="primary" onClick={() => navigate(card.link)}>
                    Go
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminHome;
