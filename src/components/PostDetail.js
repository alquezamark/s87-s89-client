import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get logged-in user
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}`);
        if (!response.ok) throw new Error("Post not found");

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/${postId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]); // ✅ Update UI without reload
      setNewComment("");
      setMessage("Comment added successfully");
    } catch (error) {
      setError(error.message);
      console.error("Error adding comment:", error);
    }
  };

  if (!post) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <hr />
      <h4>Comments</h4>
      {comments.length === 0 ? <p>No comments yet.</p> : (
        <ul className="list-group">
          {comments.map((comment) => (
            <li key={comment._id} className="list-group-item">
              {comment.content}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Show comment form only for logged-in users */}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="mt-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit" className="btn btn-primary mt-2">Post Comment</button>
        </form>
      ) : (
        <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/auth")}>
          Login to Comment
        </button>
      )}

      {message && <p className="text-success mt-2">{message}</p>}
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default PostDetail;
