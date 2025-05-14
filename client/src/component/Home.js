import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import heroImage from "../component/images/hom.jpg";
import "../Styles/home.css";
import { useSelector } from "react-redux";
import Comments from "./Comments";

function Home() {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleWatchVideo = () => {
    setShowVideo(true);
  };

  return (
    <div className="home-page">
      {/* قسم الهيرو */}
      <div
        className="hero-section d-flex align-items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>
        <Container className="position-relative">
          <Row className="justify-content-center text-center">
            <Col md="10" lg="8">
              <div className="hero-content-box p-5">
                <h1 className="hero-title mb-4">
                  Caring for students' and Staffs' health to enhance daily
                  performance.
                </h1>
                <p className="hero-subtitle mb-4">
                  We are committed to providing comprehensive and diverse
                  medical services aimed at maintaining the health of students
                  and teachers. We believe that good health is the foundation of
                  excellent performance.
                </p>
               <div className="hero-btns-wrapper d-flex gap-3 justify-content-center mt-3">
  <Button
    className="hero-call-btn shadow-lg"
    onClick={() => window.location.href = "tel:+96891234567"}
  >
    📞 Call Now
  </Button>

  <Button
    className="hero-video-btn shadow-lg"
    onClick={handleWatchVideo}
  >
    🎥 Watch Video
  </Button>
</div>


              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* قسم الخدمات */}
      <Container>
        <div className="clinic-timeline-section ">
          <div className="clinic-section-title text-center mb-5">
            <h2>Our Services</h2>
            <p className="subtitle">
              Here are some of the essential services we provide.
            </p>
            <Button
              variant="primary"
              className="see-sevice"
              onClick={() => navigate("/services")}
            >
              Go to Services
            </Button>
          </div>
          <div className="clinic-timeline-wrapper">
            <div className="clinic-vertical-line"></div>

            <div className="clinic-card-container clinic-left">
              <div className="clinic-circle">1</div>
              <div className="clinic-card-content">
                <h4>Direct Health Services</h4>
                <p>
                  The clinic offers primary healthcare for students and staff,
                  treats minor emergencies, provides vaccination services
                  against infectious diseases, and more.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-right">
              <div className="clinic-circle">2</div>
              <div className="clinic-card-content">
                <h4>Appointment Scheduling</h4>
                <p>
                  Facilitating online appointment booking via the web app,
                  ensuring easy and convenient scheduling for routine check-ups
                  and consultations.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-left">
              <div className="clinic-circle">3</div>
              <div className="clinic-card-content">
                <h4>Communication & Support</h4>
                <p>
                  The clinic provides channels for communication between
                  patients and healthcare providers, ensuring feedback and
                  continuous improvement.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-right">
              <div className="clinic-circle">4</div>
              <div className="clinic-card-content">
                <h4>Health Education & Awareness</h4>
                <p>
                  Offering workshops, seminars, and resources to promote health
                  awareness among students and staff.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-left">
              <div className="clinic-circle">5</div>
              <div className="clinic-card-content">
                <h4>Mental Health Services</h4>
                <p>
                  Offering counseling services to support mental health, helping
                  students and staff manage stress and anxiety.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-right">
              <div className="clinic-circle">6</div>
              <div className="clinic-card-content">
                <h4>Medication Management</h4>
                <p>
                  Patients can request prescribed or common medications via the
                  app, with on-campus delivery services for requested
                  medications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* قسم التعليقات */}
      <Container className="services-section my-6">
        <Row className="justify-content-center">
          <Col md="8">
            <Comments />
          </Col>
        </Row>
      </Container>

      {/* عرض الفيديو عند الضغط */}
      {showVideo && (
        <div className="video-modal-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <video width="100%" height="auto" controls autoPlay>
              <source src="/videos/vid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Button color="danger" className="mt-3" onClick={() => setShowVideo(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
