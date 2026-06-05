import { Link } from 'react-router-dom'
import LabSetupPage from './LabSetupPage'
import BlogPage from './BlogPage'

export default function Explore() {
  return (
    <main className="bg-bg text-white overflow-x-hidden">
      <LabSetupPage/>
      <BlogPage/>
    </main>
      
  )
}
