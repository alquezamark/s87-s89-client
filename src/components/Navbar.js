import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user

  const handleLogout = () => {
    Swal.fire({
      title: "Logging Out...",
      text: "Please wait...",
      icon: "info",
      showConfirmButton: false,
      timer: 1500,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      Swal.fire({
        title: "Logged Out",
        text: "You have successfully logged out.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/auth"); // ✅ Redirect to login page
    }, 1600);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        {/* ✅ Brand Name */}
        <Link className="navbar-brand" to={user && user.role === "admin" ? "/admin" : "/"}>
          PenChronicle
        </Link>

        {/* ✅ Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ✅ Navbar Links (Collapsible in Mobile) */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user && user.role === "admin" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger w-100 mt-2 mt-lg-0" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                {user ? (
                  <>
                    {/* ✅ "Create Post" visible ONLY for non-admin users */}
                    {user.role !== "admin" && (
                      <li className="nav-item">
                        <Link className="nav-link" to="/create-post">Create Post</Link>
                      </li>
                    )}
                    <li className="nav-item">
                      <button className="btn btn-danger w-100 mt-2 mt-lg-0" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth">Login | Register</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
