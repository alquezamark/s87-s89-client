import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const AdminActions = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts/");
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

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`);
      const data = await response.json();
      setComments(data);
      setSelectedPostId(postId);
      setShowComments(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const hideComments = () => {
    setSelectedPostId(null);
    setComments([]);
    setShowComments(false);
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This post and its comments will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: Admin login required");

        const response = await fetch(`http://localhost:5000/api/admin/posts/${postId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to delete post");

        Swal.fire("Deleted!", "The post has been deleted.", "success");
        setPosts(posts.filter((post) => post._id !== postId));

        if (selectedPostId === postId) {
          hideComments();
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = await Swal.fire({
      title: "Delete Comment?",
      text: "This comment will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`http://localhost:5000/api/admin/comments/${commentId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to delete comment");

        Swal.fire("Deleted!", "The comment has been removed.", "success");
        setComments(comments.filter((comment) => comment._id !== commentId));
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="admin-container position-relative">
      <video autoPlay loop muted className="bg-video">
        <source src="/bg/blog-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container mt-4 position-relative">
        <h2 className="text-center text-white">Admin Dashboard</h2>
        {loading ? <p className="text-center text-white">Loading...</p> : null}

        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  
                  <div className="scrollable-content">
                    <p className="card-text">{post.content}</p>
                  </div>

                  <p className="text-muted">Author: {post.author?.username || "Unknown"}</p>

                  <div className="mt-auto">
                    {!showComments || selectedPostId !== post._id ? (
                      <button className="btn btn-primary me-2" onClick={() => fetchComments(post._id)}>
                        View Comments
                      </button>
                    ) : (
                      <button className="btn btn-secondary me-2" onClick={hideComments}>
                        Hide Comments
                      </button>
                    )}

                    <button className="btn btn-danger" onClick={() => handleDeletePost(post._id)}>
                      Delete Post
                    </button>
                  </div>

                  {showComments && selectedPostId === post._id && (
                    <div className="mt-3">
                      <h6>Comments</h6>
                      <div className="scrollable-comments">
                        {comments.length > 0 ? (
                          <ul className="list-group">
                            {comments.map((comment) => (
                              <li key={comment._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {comment.content}
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment._id)}>
                                  Delete
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">No comments available.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .admin-container {
          position: relative;
          min-height: 100vh;
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

        .card {
          min-height: 300px;
          display: flex;
          flex-direction: column;
        }

        .card-body {
          display: flex;
          flex-direction: column;
        }

        .scrollable-content {
          max-height: 120px;
          overflow-y: auto;
          padding-right: 5px;
        }

        .scrollable-comments {
          max-height: 150px;
          overflow-y: auto;
          padding-right: 5px;
        }

        .btn {
          width: auto;
        }

        .scrollable-content::-webkit-scrollbar,
        .scrollable-comments::-webkit-scrollbar {
          width: 5px;
        }

        .scrollable-content::-webkit-scrollbar-thumb,
        .scrollable-comments::-webkit-scrollbar-thumb {
          background: #aaa;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminActions;
