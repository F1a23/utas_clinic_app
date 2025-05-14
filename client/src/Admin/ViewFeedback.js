import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedbacks, deleteFeedback } from "../Features/FeedbackSlice";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
} from "reactstrap";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Styles/ViewFeedback.css";

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        borderRadius: "50%",
        width: "45px",
        height: "45px",
        zIndex: 10,
        left: "-20px",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        transition: "background-color 0.3s ease, transform 0.3s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#b30000";
        e.currentTarget.style.transform = "scale(1.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#007bff";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <FaChevronLeft style={{ color: "#ffffff", fontSize: "20px" }} />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        borderRadius: "50%",
        width: "45px",
        height: "45px",
        zIndex: 10,
        right: "-20px",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        transition: "background-color 0.3s ease, transform 0.3s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#b30000";
        e.currentTarget.style.transform = "scale(1.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#007bff";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <FaChevronRight style={{ color: "#ffffff", fontSize: "20px" }} />
    </div>
  );
};

const ViewFeedback = () => {
  const dispatch = useDispatch();
  const feedbacks = useSelector((state) => state.feedbacks.feedbacks);
  const status = useSelector((state) => state.feedbacks.status);
  const error = useSelector((state) => state.feedbacks.error);

  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(id));
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    rows: 2,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          rows: 1,
        },
      },
    ],
  };

  return (
    <Container fluid className="feedback-page-container">
      <h2 className="feedback-title">User Feedback</h2>

      {status === "loading" && <p>Loading feedbacks...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && feedbacks.length === 0 && (
        <p>No feedback yet.</p>
      )}

      {status === "succeeded" && (
        <Slider {...settings} className="feedback-slider">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="feedback-card-wrapper px-2 py-3">
              <Card className="feedback-card shadow-sm">
                <CardBody>
                  <CardTitle tag="h5" className="feedback-card-title">
                    {fb.name || "Anonymous"}
                  </CardTitle>
                  <CardText className="feedback-card-text">
                    <strong>Email:</strong> {fb.email || "N/A"}
                    <br />
                    <strong>Rating:</strong> {fb.rating} / 5
                    <br />
                    <strong>Feedback:</strong> {fb.feedbackMsg}
                  </CardText>
                  <Button
                    className="feedback-delete-btn"
                    onClick={() => handleDelete(fb._id)}
                  >
                    Delete
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
        </Slider>
      )}
    </Container>
  );
};

export default ViewFeedback;
