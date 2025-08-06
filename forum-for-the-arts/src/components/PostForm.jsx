import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PostForm({ refreshPosts }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [medium, setMedium] = useState('painting')
  const [imageFile, setImageFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageUrl = null

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `public/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        alert('Image upload failed: ' + uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('posts').insert({
      title,
      body,
      medium,
      image_url: imageUrl,
    })

    if (error) {
      alert('Error posting: ' + error.message)
    } else {
      setTitle('')
      setBody('')
      setMedium('painting')
      setImageFile(null)
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

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <button type="submit">Post</button>
    </form>
  )
}