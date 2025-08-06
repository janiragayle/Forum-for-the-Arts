import { Routes, Route } from 'react-router-dom'
import Forum from './components/Forum'
import PostPage from './components/PostPage'


export default function App() {
  return (
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Forum />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
  )
}
