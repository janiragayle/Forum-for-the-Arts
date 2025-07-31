// src/components/PostForm.jsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PostForm({ refreshPosts }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [medium, setMedium] = useState('painting')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !body.trim()) return

    const { error } = await supabase.from('posts').insert({
      title,
      body,
      medium,
    })

    if (error) {
      alert('Error posting: ' + error.message)
    } else {
      setTitle('')
      setBody('')
      setMedium('painting')
      refreshPosts()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2 className="form-title">Create a Post</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="What's on your mind?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <select value={medium} onChange={(e) => setMedium(e.target.value)}>
        <option value="painting">Painting</option>
        <option value="drawing">Drawing</option>
        <option value="photography">Photography</option>
      </select>

      <button type="submit">Post</button>
    </form>
  )
}
