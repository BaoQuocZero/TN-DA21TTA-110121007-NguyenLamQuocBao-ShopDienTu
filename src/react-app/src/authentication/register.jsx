// src/components/RegisterForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [rePassword, setRePassword] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  const validateForm = () => {
    let errors = {};
    if (!formData.userName) errors.userName = "User Name is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email address";
    if (!formData.password) errors.password = "Password is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (rePassword === formData.password) {
      try {
        const response = await axios.post(`${apiUrl}/users/register`, formData);
        //   setMessage("User registered successfully!");

        console.log(response.data);
        if (response.data.EC === 1) {
          alert("Đăng ký thành công");
          setFormData({
            userName: "",
            email: "",
            password: "",
          });
          setRePassword("");
        }
      } catch (error) {
        console.log("error", error);
        console.error("Error registering user:", error);
        setMessage("Error registering user");
      }
    } else {
      alert("Mật khẩu nhập lại không trùng khớp");
    }
  };
  const HandleLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <div className="container">
        <div className="page-container" id="page-container">
          <main className="main">
            <div className="login-div content">
              <form className="login-form" onSubmit={handleSubmit}>
                <h1 style={{ fontSize: "20px", marginBottom: "9px" }}>
                  Register
                </h1>{" "}
                <div className="mb-3">
                  <input
                    type="text"
                    name="userName"
                    className="form-control form-cus"
                    value={formData.userName}
                    onChange={handleChange}
                    error={!!errors.userName}
                    helperText={errors.userName}
                    placeholder="UserName"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control form-cus"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control form-cus"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    placeholder="Password"
                  />
                </div>{" "}
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control form-cus"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder="Re-Password"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-cus">
                  Submit
                </button>
                {/* <label
                  className="form-check-label"
                  style={{ marginTop: "10px", fontSize: "12px" }}
                >
                  <a
                    style={{
                      textDecoration: "solid black",
                      cursor: "pointer",
                    }}
                    onClick={() => setCheckForm(2)}
                  >
                    FORGOT YOUR PASSWORD?
                  </a>
                </label> */}
                <button
                  className="btn btn-primary btn-cus"
                  style={{ marginTop: "30px" }}
                  onClick={() => HandleLogin()}
                >
                  Let go Login
                </button>
              </form>{" "}
              {message && (
                <Typography
                  variant="body1"
                  color="error"
                  style={{ marginTop: "16px" }}
                >
                  {message}
                </Typography>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
