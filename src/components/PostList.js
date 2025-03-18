import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bgVideo from "../bg/blog-bg.mp4"; // ✅ Import the background video

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://s87-s89-server.onrender.com/api/posts/");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="position-relative">
      {/* ✅ Background Video */}
      <video autoPlay loop muted className="bg-video">
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Overlay Content */}
      <div className="container mt-4 content-overlay">
        <h2 className="text-center text-white">Blogs</h2>
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-white">No posts available.</p>
        ) : (
          <div className="row">
            {posts.map((post) => (
              <div key={post._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text flex-grow-1">{post.content.slice(0, 100)}...</p>
                    <p className="text-muted small">Author: {post.author?.username || "Unknown"}</p>
                    <Link to={`/post/${post._id}`} className="btn btn-primary mt-auto">Read More</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Styling */}
      <style>
        {`
          .bg-video {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            z-index: -1;
          }
          .content-overlay {
            position: relative;
            z-index: 1;
            background: rgba(0, 0, 0, 0.6);
            padding: 20px;
            border-radius: 10px;
          }
          .card {
            transition: transform 0.3s ease-in-out;
          }
          .card:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default PostList;
