import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";
import { FaCalendarAlt, FaCapsules, FaCommentDots } from "react-icons/fa";
import "../Styles/NurseDashboard.css";
import nurseImage from "../component/images/nurse1.png";

const cards = [
  {
    icon: <FaCalendarAlt className="icon" />,
    title: "Today's Appointments",
    details: "12 scheduled appointments today.",
    link: "/AppointmentsManagement",
    color: "flip-blue",
  },
  {
    icon: <FaCapsules className="icon" />,
    title: "Available Medicines",
    details: "34 medicines currently in stock.",
    link: "/MedicineList",
    color: "flip-green",
  },
  {
    icon: <FaCommentDots className="icon" />,
    title: "New Comments",
    details: "5 pending replies to user comments.",
    link: "/CommentsReplies",
    color: "flip-yellow",
  },
];

const NurseDashboard = () => {
  const { user } = useSelector((state) => state.users);
  return (
    <div className="nurse-dashboard main-layout">
      <img
        src={nurseImage}
        alt="Nurse Decorative"
        className="background-nurse"
      />

      <Container className="dashboard-container">
        <div className="nurse-welcome-section">
          <h2 className="nurse-welcome-text">
            Welcome back, Nurse:
            <span className="nursename"> {user?.name} 👩‍⚕️!</span>
          </h2>

          <p className="nurse-motivation-text">
            You're making a real difference today — one patient at a time.
          </p>
        </div>

        <div className="summary-section">
          <h3 className="summary-title">Today's Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Current Users:</h4>
              <p>18</p>
            </div>
            <div className="summary-card">
              <h4>Medications Given</h4>
              <p>25</p>
            </div>
            <div className="summary-card">
              <h4>New Feedbacks</h4>
              <p>7</p>
            </div>
          </div>
        </div>

        <h1 className="dashboard-title">Nurse Dashboard</h1>

        <Row className="flip-card-grid">
          {cards.map((card, index) => (
            <Col md="4" key={index} className="flip-card-col">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className={"flip-card-front " + card.color}>
                    {card.icon}
                    <h5>{card.title}</h5>
                  </div>
                  <div className="flip-card-back">
                    <p>{card.details}</p>
                    <Button href={card.link} color="primary">
                      Go
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div className="resources-section">
          <h3 className="resources-title">Helpful Resources</h3>
          <div className="resources-grid">
            <a
              href="https://www.cdc.gov/cpr/whatwedo/guide.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card"
            >
              <span className="resource-icon">🆘</span>
              <h4>CDC Emergency Guide</h4>
            </a>
            <a
              href="https://www.who.int/publications/i/item/9789241549950"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card"
            >
              <span className="resource-icon">💉</span>
              <h4>WHO Medication Manual</h4>
            </a>
            <a
              href="https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card"
            >
              <span className="resource-icon">📖</span>
              <h4>ANA Code of Ethics</h4>
            </a>
            <a
              href="https://openwho.org/courses"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card"
            >
              <span className="resource-icon">📚</span>
              <h4>Free WHO Courses</h4>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NurseDashboard;
