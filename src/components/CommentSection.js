import React, { useEffect, useState } from "react";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/${postId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add comment");

      setComments([...comments, data]);
      setContent("");
      setMessage("Comment added successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      {message && <p className="text-success">{message}</p>}
      {comments.length > 0 ? (
        <ul className="list-group">
          {comments.map((comment) => (
            <li key={comment._id} className="list-group-item">
              {comment.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post Comment</button>
      </form>
    </div>
  );
};

export default CommentSection;
