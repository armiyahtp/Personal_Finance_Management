// LoginPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {


    // Button Hover Effects
    const signInBtn = document.getElementById("signInBtn");
    const logInBtn = document.getElementById("logInBtn");
    
    if (signInBtn && logInBtn) {
      const handleMouseEnter = () => {
        logInBtn.classList.remove("btn-success");
        logInBtn.classList.add("bg-transparent", "border-0");
    
        signInBtn.classList.remove("bg-transparent", "border-0");
        signInBtn.classList.add("btn-success");
        signInBtn.classList.add("text-white");
      };
    
      const handleMouseLeave = () => {
        signInBtn.classList.remove("btn-success");
        signInBtn.classList.remove("text-white");
        signInBtn.classList.add("bg-transparent", "border-0");
    
        logInBtn.classList.remove("bg-transparent", "border-0");
        logInBtn.classList.add("btn-success");
      };
    
      signInBtn.addEventListener("mouseenter", handleMouseEnter);
      signInBtn.addEventListener("mouseleave", handleMouseLeave);
    

      return () => {
        signInBtn.removeEventListener("mouseenter", handleMouseEnter);
        signInBtn.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;

    setLoading(true);

    try {
        const response = await axios.post(loginAPI, { email, password });

        const data = response?.data;
        console.log("🔍 Backend Response:", data); // ✅ Log response

        if (data?.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            
            toast.success(data.message, toastOptions);
            navigate("/");
        } else {
            toast.error(data.message || "Login failed", toastOptions);
        }
    } catch (error) {
        console.error("Login Error:", error.response?.data || error);

        // ✅ Show meaningful error message
        toast.error(error.response?.data?.message || "Something went wrong", toastOptions);
    } finally {
        setLoading(false);
    }
};




  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#fff",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#40593f",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.3,
              random: true,
            },
            size: {
              value: 20,
              random: { enable: true, minimumValue: 1 },
            },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 2,
            },
            life: {
              duration: {
                sync: false,
                value: 3,
              },
              count: 0,
              delay: {
                random: {
                  enable: true,
                  minimumValue: 0.5,
                },
                value: 1,
              },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Container className="mt-5" style={{ position: "relative", zIndex: 2, color: "white" }}>
        <Row className="text-center">
          <h1>
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "black" }} />
          </h1>
          <h1 className="text-black mt-4 mb-4 fw-bold">Login</h1>
        </Row>
            
        <Row className="bg-white p-4 rounded mb-5 shadow-lg mt-4" style={{ width: "60%", height: "450px", transform: "translateX(275px)" }}>
          {/* Left Side: Image */}
          <Col md={6} className="d-flex align-items-center justify-content-center">
            <div className="text-center">
              <img
                src="https://www.finetuneus.com/wp-content/uploads/2023/09/Untitled-962-%C3%97-481-px-695-%C3%97-461-px.png"
                alt="Expense Illustration"
                id="rimg"
                className="img-fluid mb-3"
              />
            </div>
          </Col>
            
          {/* Right Side: Form */}
          <Col md={6}>
            <div className="ms-4 mb-5 mt-5 rounded-5" style={{ backgroundColor: "#e6e6e6", width: "201px", height: "47px" }}>
              <div className="btn-group" role="group" aria-label="Register and Sign In">
                <Button id="logInBtn" variant="success" className="toggle-btn mt-1 ms-1 me-1 rounded-5" style={{ width: "95px", height: "38px" }}>
                  Login
                </Button>
                <Button id="signInBtn" onClick={() => navigate("/register")} className="toggle-btn mt-1 rounded-5 text-black bg-transparent border-0" style={{ width: "95px", height: "38px" }}>
                  Sign Up
                </Button>
              </div>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-75"
                  value={values.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-2">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-75"
                  value={values.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Link to="/forgotPassword" style={{ fontSize: "14px", textDecoration: "none", color: "#198754" }}>
                Forgot Password?
              </Link>
              <Button type="submit" className="mt-3 w-75 btn btn-success" disabled={loading}>
                {loading ? "Logging..." : "Login Now"}
              </Button>
              <div className="w-75">
                <p className="mt-3" style={{ textAlign: "center", color: "#9d9494" }}>
                  Don't have an account?<br />Go to Sign Up
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>

    </div>
  );
};

export default Login;
