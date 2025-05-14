import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "../App.css";
import login1 from "../component/images/login6.png";
import logo from "../component/images/logo.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../config"; // ✅ تم استيراد رابط الخادم

// FontAwesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const { user } = useSelector((state) => state.users);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess, isError } = useSelector((state) => state.users);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/forgot-password`, {
        email,
      });

      if (response.data.success) {
        toast.success(
          "Check your email for instructions to reset your password."
        );
        setIsForgotPassword(false);
      } else {
        toast.error("Email not found. Please try again.");
      }
    } catch (error) {
      console.error("Error sending password reset request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("Login failed. Please check your credentials.");
    } else if (isSuccess) {
      toast.success("Login successful!");

      if (user && user.userType) {
        if (user.userType === "User") navigate("/Home");
        else if (user.userType === "Admin") navigate("/AdminDashboard");
        else if (user.userType === "Nurse") navigate("/NurseDashboard");
        else toast.error("User type not recognized. Please contact support.");
      } else {
        toast.error("User type not found. Please contact support.");
      }
    }
  }, [isSuccess, isError, navigate, user]);

  return (
    <Container className="login-container">
      <Row className="login-wrapper">
        <Col md="6" className="left-section">
          <h2 className="text-login">
            Your health is our priority, offering specialized care within a
            supportive academic setting.
          </h2>
          <div className="img-container">
            <img src={login1} alt="stethoscope" className="stethoscope-img" />
          </div>
        </Col>

        <Col md="6" className="right-section">
          <div className="login-box">
            <img src={logo} alt="logo" className="logo-img" />
            <h1 className="text-center mb-4">
              {isForgotPassword ? "Reset Password" : "Login"}
            </h1>

            <Form
              onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}
            >
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="input-field"
                  onChange={(e) => setemail(e.target.value)}
                  value={email}
                  required
                />
              </FormGroup>

              {!isForgotPassword && (
                <FormGroup>
                  <Label for="password">Password</Label>
                  <div style={{ position: "relative" }}>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      className="input-field"
                      onChange={(e) => setpassword(e.target.value)}
                      value={password}
                      required
                    />
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#666",
                      }}
                    />
                  </div>
                </FormGroup>
              )}

              <Button color="primary" block type="submit" className="login-btn">
                {isForgotPassword ? "Send Reset Link" : "Login"}
              </Button>
            </Form>

            <p className="forgot-password mt-3">
              <a
                href="#"
                onClick={() => setIsForgotPassword(!isForgotPassword)}
              >
                {isForgotPassword ? "Back to Login" : "Forgot your password?"}
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
