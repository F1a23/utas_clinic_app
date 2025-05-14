import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as ENV from "../config";
import "../Styles/HealthWebinar.css";

const HealthWebinar = () => {
  const user = useSelector((state) => state.users.user);
  const [formData, setFormData] = useState({
    topic: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user || !user.email) {
      // Redirect if needed, e.g., navigate("/login")
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!user?.name) newErrors.name = "Full name is required.";
    if (!user?.email) newErrors.email = "Email is required.";
    if (!formData.topic) newErrors.topic = "Please select a topic.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        `${ENV.SERVER_URL}/registerwebinartopic`,
        {
          email: user.email,
          topic: formData.topic,
        }
      );
      toast.success(response.data.message || "✅ Registered successfully!");
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.error || "❌ Failed to register.";
      toast.error(message);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="healthwebinar-page-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="healthwebinar-form-card">
        <h1 className="healthwebinar-title">
          Join Our Upcoming Health Webinar
        </h1>
        <p className="healthwebinar-description">
          Whether it's <strong>mental health</strong> or{" "}
          <strong>nutrition</strong>, our expert speakers share valuable
          knowledge and answer your questions.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="healthwebinar-form">
            <div>
              <label className="healthwebinar-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={user?.name || ""}
                className="healthwebinar-input"
                disabled
              />
              {errors.name && (
                <div className="healthwebinar-error">{errors.name}</div>
              )}
            </div>

            <div>
              <label className="healthwebinar-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={user?.email || ""}
                className="healthwebinar-input"
                disabled
              />
              {errors.email && (
                <div className="healthwebinar-error">{errors.email}</div>
              )}
            </div>

            <div>
              <label className="healthwebinar-label">Webinar Topic</label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="healthwebinar-input"
              >
                <option value="">-- Select Topic --</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Stress Management">Stress Management</option>
              </select>
              {errors.topic && (
                <div className="healthwebinar-error">{errors.topic}</div>
              )}
            </div>

            <div className="healthwebinar-submit-container">
              <button type="submit" className="healthwebinar-submit-btn">
                Register Now
              </button>
            </div>
          </form>
        ) : (
          <div className="healthwebinar-success-message">
            ✅ Thank you for registering! We will contact you soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthWebinar;
