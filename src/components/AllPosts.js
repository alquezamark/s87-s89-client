import React, { useEffect, useState } from "react";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts/");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Blog Posts</h2>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content.substring(0, 100)}...</p>
                  <p className="text-muted">By: {post.author}</p>
                  <a href={`/post/${post._id}`} className="btn btn-primary">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
