import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Alert,
} from "reactstrap";
import { FaChevronLeft, FaChevronRight, FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUserMsgs, replyToMsg } from "../Features/MessageSlice";
import "../Styles/CommentsReplies.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const formatDateTime = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

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

const CommentsReplies = () => {
  const dispatch = useDispatch();
  const { userMessages, status, error } = useSelector(
    (state) => state.userMessages
  );

  const [replies, setReplies] = useState({});
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");

  useEffect(() => {
    dispatch(getUserMsgs());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }));
  };

  const sendReply = async (id) => {
    const replyText = replies[id];
    if (!replyText || replyText.trim() === "") {
      setMessage("Reply cannot be empty.");
      setAlertColor("danger");
      return;
    }

    try {
      await dispatch(replyToMsg({ id, reply: replyText })).unwrap();
      setMessage("✅ Reply sent successfully.");
      setAlertColor("success");
      setReplies((prev) => ({ ...prev, [id]: "" }));
      dispatch(getUserMsgs());
    } catch (err) {
      setMessage("❌ Failed to send reply.");
      setAlertColor("danger");
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
    <Container fluid className="comments-page ">
      <h1 className="comments-title text-center mb-4">
        User Comments & Replies
      </h1>
      {message && <Alert color={alertColor}>{message}</Alert>}
      {status === "loading" && (
        <p className="text-center">Loading messages...</p>
      )}
      {status === "failed" && (
        <p className="text-danger text-center">Error: {error}</p>
      )}

      <Slider {...settings} className="comments-slider">
        {userMessages.map((msg) => (
          <div key={msg._id} className="comment-card-wrapper px-2 py-3">
            <Card className="comment-card shadow-sm">
              <CardBody>
                <CardTitle tag="h5" className="fw-bold text-primary">
                  {msg.name}
                </CardTitle>
                <CardText className="text-muted small">
                  <strong>Email:</strong> {msg.email || "No email"} <br />
                  <strong>Sent:</strong> {formatDateTime(msg.createdAt)} <br />
                  {msg.reply && msg.updatedAt && (
                    <span>
                      <strong>Replied:</strong> {formatDateTime(msg.updatedAt)}
                    </span>
                  )}
                </CardText>
                <CardText className="comment-text">{msg.userMsg}</CardText>
                <CardText className="comment-reply">
                  <strong>Reply:</strong>{" "}
                  {msg.reply || (
                    <span className="text-muted">(No reply yet)</span>
                  )}
                </CardText>
                <Input
                  type="textarea"
                  placeholder="Write your reply..."
                  className="mb-3"
                  value={replies[msg._id] || ""}
                  onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                />
                <div className="d-flex justify-content-end">
                  <Button
                    color="success"
                    onClick={() => sendReply(msg._id)}
                    disabled={!replies[msg._id]?.trim()}
                  >
                    <FaPaperPlane className="me-1" /> Send Reply
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default CommentsReplies;
