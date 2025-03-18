import React, { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setMessage("You must be logged in to create a post.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
        },
        body: JSON.stringify({
          title,
          content,
          author: user.id, // ✅ Ensure the correct user ID is sent
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create post");

      setMessage("Post created successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="create-post-container">
      {/* Background Video */}
      <video autoPlay loop muted className="bg-video">
        <source src="/bg/blog-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Form Container */}
      <div className="form-container">
        <h2 className="text-center">Create a New Post</h2>
        {message && (
          <p className={`text-center ${message.includes("successfully") ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="5"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">Publish</button>
        </form>
      </div>

      {/* Styles for Background Video */}
      <style>
        {`
          .create-post-container {
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
            background: rgba(255, 255, 255, 0.9); /* Slight transparency for better readability */
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default CreatePost;
