import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail"; // Ensure this file exists
import AdminActions from "./components/AdminActions";
import CreatePost from "./components/CreatePost";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check if user is logged in
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<PostList />} /> {/* Home page */}
        <Route path="/posts" element={<PostList />} /> {/* All Posts */}
        <Route path="/post/:postId" element={<PostDetail />} /> {/* Single Post View */}
        <Route path="/admin" element={<ProtectedRoute><AdminActions /></ProtectedRoute>} />       
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
}

export default App;
