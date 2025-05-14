import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/ContactUs.css";
import { useDispatch, useSelector } from "react-redux";
import { saveUserMsg, getUserMsgs } from "../Features/MessageSlice";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users?.user);
  const { userMessages, status, error } = useSelector(
    (state) => state.userMessages || {}
  );

  const [message, setMessage] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savedMessage, setSavedMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");

  useEffect(() => {
    if (status === "idle") {
      dispatch(getUserMsgs());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message || !name || !email) {
      setAlertMessage("Please fill in all fields.");
      setAlertColor("danger");
      return;
    }

    const userMessageData = {
      name,
      email,
      userMsg: message,
    };

    setIsSubmitting(true);

    try {
      const response = await dispatch(saveUserMsg(userMessageData)).unwrap();
      setAlertMessage("Message submitted successfully!");
      setAlertColor("success");
      setMessage("");
      setSavedMessage(response.usermessage);
    } catch (error) {
      console.error("Message Error:", error);
      setAlertMessage("There was an error submitting your message.");
      setAlertColor("danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="cu-container">
      <div className="cu-header mb-4">
        <h1>Contact Us</h1>
        <p>
          At the University Clinic, healthcare is more than just a service—it's
          a journey of healing and support.
        </p>
      </div>

      {alertMessage && (
        <div className={`alert alert-${alertColor}`} role="alert">
          {alertMessage}
        </div>
      )}

      <div className="row mt-4 equal-height" >
        {/* Form Section */}
        <div className="col-md-6">
          <div className="cu-form-section">
            <h2>We'd Love to Hear From You!</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-2 cu-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Chat Bubble Messages */}
        <div className="col-md-6">
          <div className="cu-messages-sidebar">
            <h4 className="mb-3">📬 Your Messages</h4>
            {userMessages
              .filter((msg) => msg.email === user?.email)
              .map((msg) => (
                <div key={msg._id} className="cu-message-card">
                  <div className="cu-bubble-left">
                    {msg.userMsg}
                    <div className="cu-bubble-time">{formatDate(msg.createdAt)}</div>
                  </div>
                  
                  {msg.reply && (
                    <div className="cu-bubble-right">
                      {msg.reply}
                      <div className="cu-bubble-time">{formatDate(msg.updatedAt || msg.createdAt)}</div>
                    </div>
                  )}
                </div>
              ))}
            {userMessages.filter((msg) => msg.email === user?.email).length === 0 && (
              <div className="text-muted">No previous messages found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Clinic Info and Map */}
      <div className="cu-clinic-info mt-5">
        <h3>Visit Our University Clinic</h3>
        <p>
          Address: University of Technology and Applied Sciences Salalah Branch
        </p>
        <p>Phone: +968 99292300</p>
        <p>Email: clinic@university.edu</p>
      </div>

     
    </div>
  );
};

export default ContactUs;