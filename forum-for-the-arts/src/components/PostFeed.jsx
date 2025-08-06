// PostFeed.jsx
import { useNavigate } from 'react-router-dom'

export default function PostFeed({ posts }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => {
          const date = new Date(post.created_at).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })

          return (
            <div
              key={post.post_id}
              className="post-card"
              onClick={() => navigate(`/post/${post.post_id}`)}
            >
              <h3>{post.title}</h3>
              <p><strong>Medium:</strong> {post.medium}</p>
              {post.image_url && (
                <img src={post.image_url} alt="Post preview" className="post-image" style={{ maxWidth: '100%', borderRadius: '6px', marginBottom: '0.5rem' }} />
              )}
              <p>{post.body}</p>
              <p className="post-meta">🕒 {date} | 👍 {post.upvotes}</p>
            </div>
          )
        })
      )}
    </div>
  )
} 