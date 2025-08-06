// src/components/Forum.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import PostForm from './PostForm'
import PostFeed from './PostFeed'

export default function Forum() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('recent')
  const [medium, setMedium] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [filter, medium])

  const fetchPosts = async () => {
    let query = supabase.from('posts').select('*')

    if (medium !== 'all') {
      query = query.eq('medium', medium)
    }

    if (filter === 'popular') {
      query = query.order('upvotes', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    setPosts(data || [])
  }

  return (
    <div className="app-container">
      <h1 className="forum-title">Art Medium Forum</h1>

      <PostForm refreshPosts={fetchPosts} />

      <div className="filter-bar">
        <select onChange={(e) => setFilter(e.target.value)} className="dropdown">
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>

        <select onChange={(e) => setMedium(e.target.value)} className="dropdown">
          <option value="all">All</option>
          <option value="painting">Painting</option>
          <option value="drawing">Drawing</option>
          <option value="photography">Photography</option>
        </select>
      </div>

      <PostFeed posts={posts} />
    </div>
  )
}
