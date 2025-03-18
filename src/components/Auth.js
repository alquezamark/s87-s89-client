import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const Auth = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "An error occurred");

      // ✅ Success Alert
      Swal.fire({
        icon: "success",
        title: isLogin ? "Login Successful!" : "Registration Successful!",
        text: isLogin ? `Welcome back, ${data.user.username}!` : "Please login to continue.",
        showConfirmButton: false,
        timer: 2000, // Auto-close alert after 2 seconds
      });

      if (isLogin) {
        // ✅ Store user object including role
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // ✅ Redirect based on user role
        setTimeout(() => {
          navigate(data.user.role === "admin" ? "/admin" : "/");
          window.location.reload(); // Ensure UI updates properly
        }, 2000);
      } else {
        // ✅ Switch to login after successful registration
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);
      }
    } catch (error) {
      // ❌ Error Alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="auth-container">
      {/* Background Video */}
      <video autoPlay loop muted className="bg-video">
        <source src="/bg/blog-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login/Register Form */}
      <div className="form-container">
        <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
          <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          <button className="btn btn-link mt-3 w-100" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </button>
        </div>
      </div>

      {/* Styles for Background Video */}
      <style>
        {`
          .auth-container {
            position: relative;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }

          .bg-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -1;
          }

          .form-container {
            position: relative;
            z-index: 1;
            padding: 20px;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default Auth;
