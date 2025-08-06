import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editMedium, setEditMedium] = useState('painting')

  useEffect(() => {
    fetchPostAndComments()
  }, [])

  const fetchPostAndComments = async () => {
    setLoading(true)

    const { data: postData } = await supabase.from('posts').select('*').eq('post_id', id).single()
    const { data: commentData } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    setPost(postData)
    setEditTitle(postData?.title || '')
    setEditBody(postData?.body || '')
    setEditMedium(postData?.medium || 'painting')
    setComments(commentData || [])
    setLoading(false)
  }

  const handleUpvote = async () => {
    const { error } = await supabase.rpc('increment_upvotes', { post_id_input: id })

    if (error) {
      alert('Upvote failed')
      return
    }

    setPost((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }))
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const { error } = await supabase.from('comments').insert({
      post_id: id,
      content: newComment,
    })

    if (error) {
      alert('Failed to post comment')
      return
    }

    setNewComment('')
    fetchPostAndComments()
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('posts').delete().eq('post_id', id)
    if (error) {
      alert('Failed to delete post')
      return
    }
    navigate('/')
  }

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('posts')
      .update({ title: editTitle, body: editBody, medium: editMedium })
      .eq('post_id', id)
    if (error) {
      alert('Failed to update post')
      return
    }
    setEditMode(false)
    fetchPostAndComments()
  }

  if (loading) return <div>Loading...</div>
  if (!post) return <div>Post not found</div>

  const formattedDate = new Date(post.created_at).toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <div className="post-detail">
      <button onClick={() => navigate('/')} className="back-button">← Back to Forum</button>

      {editMode ? (
        <>
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} />
          <select value={editMedium} onChange={(e) => setEditMedium(e.target.value)}>
            <option value="painting">Painting</option>
            <option value="drawing">Drawing</option>
            <option value="photography">Photography</option>
          </select>
          <button onClick={handleUpdate}>Save Changes</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p><strong>Medium:</strong> {post.medium}</p>
          <p><strong>Posted:</strong> {formattedDate}</p>
          <p>{post.body}</p>
          {post.image_url && (
            <div style={{ marginTop: '1rem' }}>
              <img src={post.image_url} alt="Post" className="post-image" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </div>
          )}
          <button onClick={handleUpvote}>👍 Upvote ({post.upvotes})</button>
          <button onClick={() => setEditMode(true)}>✏️ Edit</button>
          <button onClick={handleDelete}>🗑 Delete</button>
        </>
      )}

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            {comment.content}
          </div>
        ))}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>
    </div>
  )
}
