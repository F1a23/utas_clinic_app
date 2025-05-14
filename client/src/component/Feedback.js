import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Feedback.css";
import { useDispatch, useSelector } from "react-redux";
import { saveFeedback, getFeedbacks } from "../Features/FeedbackSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faStar,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import feedbackImage from "../component/images/fd.png";

const Feedback = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { feedbacks } = useSelector((state) => state.feedbacks);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    rating: 5,
    feedbackMsg: "",
  });

  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.feedbackMsg || !formData.rating) {
      alert("Please provide a rating and feedback message.");
      return;
    }

    const feedbackData = {
      ...formData,
      name: user?.name || "Anonymous",
      email: user?.email || "",
    };

    try {
      await dispatch(saveFeedback(feedbackData)).unwrap();
      alert("Feedback submitted successfully!");
      setFormData({ rating: 5, feedbackMsg: "" });
    } catch (error) {
      console.error("Feedback Error:", error);
      alert("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="fb-dashboard main-layout">
      <img
        src={feedbackImage}
        alt="Feedback Visual"
        className="dashboard-background-img"
      />

      <div className="fb-container">
        <div className="fb-header">
          <h2 className="fb-title">
            <FontAwesomeIcon icon={faCommentDots} className=" text-primary" />
            We Value Your Feedback
          </h2>
          <p>
            Your feedback helps us improve our services and better serve you!
          </p>
        </div>

        <div className="fb-form-wrapper">
          <form onSubmit={handleSubmit} className="fb-form">
            <div className="form-group">
              <label htmlFor="name">
                <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={user?.name || "Anonymous"}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="me-2 text-primary"
                />
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">
                <FontAwesomeIcon icon={faStar} className="me-2 text-warning" />
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                className="form-control"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="feedback">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="me-2 text-primary"
                />
                Your Feedback
              </label>
              <input
                type="text"
                id="feedback"
                name="feedbackMsg"
                className="form-control"
                value={formData.feedbackMsg}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn fb-submit-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
