// src/components/PostFeed.jsx
import { useNavigate } from 'react-router-dom'

export default function PostFeed({ posts }) {
  const navigate = useNavigate()

  return (
    <div className="post-feed">
      {posts.length === 0 ? (
        <p className="no-posts">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.post_id}
            className="post-card"
            onClick={() => navigate(`/post/${post.post_id}`)}
          >
            <h3 className="post-title">{post.title}</h3>
            <p className="post-medium">Medium: {post.medium}</p>
            <p>{post.body}</p>
            <p className="post-upvotes">Upvotes: {post.upvotes}</p>
          </div>
        ))
      )}
    </div>
  )
}
