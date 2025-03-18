import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch post details
        const postResponse = await fetch(`http://localhost:5000/api/posts/${id}`);
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch comments
        const commentResponse = await fetch(`http://localhost:5000/api/comments/${id}`);
        const commentData = await commentResponse.json();
        setComments(commentData);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add comment");

      setComments([...comments, data]);
      setCommentText("");
      setMessage("Comment added successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container mt-4">
      {post ? (
        <div>
          <h2>{post.title}</h2>
          <p className="text-muted">Author: {post.author || "Unknown"}</p>
          <p>{post.content}</p>

          <hr />

          <h4>Comments</h4>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border p-2 mb-2">
                {comment.content}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          <form onSubmit={handleCommentSubmit} className="mt-3">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form>
          {message && <p className="text-success mt-2">{message}</p>}
        </div>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default SinglePost;
