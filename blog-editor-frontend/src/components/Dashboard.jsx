import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Dashboard() {
  const [blogs, setBlogs] = useState([])
  const [selectedBlog, setSelectedBlog] = useState(null)
  const navigate = useNavigate();
  const { searchTag, setSearchTag } = useOutletContext();

  useEffect(() => {
    // Redirect to landing page if not logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    // Try to load blogs from sessionStorage first
    const cached = sessionStorage.getItem('blogs');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlogs(parsed);
        }
      } catch (e) {}
    }
    fetch('https://blog-editor-service.onrender.com/api/blog')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
          sessionStorage.setItem('blogs', JSON.stringify(data));
        } else {
          const dummy = [
            {
              _id: 'dummy1',
              title: 'Welcome to Blogger!',
              author: 'Admin',
              content: 'This is a sample blog post. Start writing your own blogs and share your thoughts with the world!',
              likes: 0,
              publishedAt: new Date().toISOString(),
              tag: 'welcome',
            },
            {
              _id: 'dummy2',
              title: 'How to use the Dashboard',
              author: 'Admin',
              content: 'Click on any blog title to read more. Like your favorite blogs and see them rise to the top!',
              likes: 0,
              publishedAt: new Date().toISOString(),
              tag: 'guide',
            }
          ];
          setBlogs(dummy);
          sessionStorage.setItem('blogs', JSON.stringify(dummy));
        }
      })
      .catch(() => {
        const dummy = [
          {
            _id: 'dummy1',
            title: 'Welcome to Blogger!',
            author: 'Admin',
            content: 'This is a sample blog post. Start writing your own blogs and share your thoughts with the world!',
            likes: 0,
            publishedAt: new Date().toISOString(),
            tag: 'welcome',
          },
          {
            _id: 'dummy2',
            title: 'How to use the Dashboard',
            author: 'Admin',
            content: 'Click on any blog title to read more. Like your favorite blogs and see them rise to the top!',
            likes: 0,
            publishedAt: new Date().toISOString(),
            tag: 'guide',
          }
        ];
        setBlogs(dummy);
        sessionStorage.setItem('blogs', JSON.stringify(dummy));
      });
  }, [navigate])

  // Filter blogs by tag if searchTag is set, and only show published blogs
  const filteredBlogs = (searchTag
    ? blogs.filter(blog => {
        if (!blog.tag) return false;
        if (Array.isArray(blog.tag)) {
          return blog.tag.some(t =>
            t && t.toLowerCase().includes(searchTag.toLowerCase())
          );
        } else if (typeof blog.tag === 'string') {
          return blog.tag.toLowerCase().includes(searchTag.toLowerCase());
        }
        return false;
      })
    : blogs
  ).filter(blog => blog.status === 'published');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
          Published Blogs
        </h1>
      </div>
      <div className="space-y-6">
        {filteredBlogs.length === 0 && (
          <div className="text-gray-500 text-center py-8">No blogs found.</div>
        )}
        {filteredBlogs.map(blog => {
          return (
            <div 
              key={blog._id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-3 border border-orange-100"
            >
              <div className="flex justify-between items-center">
                <h2 
                  className="text-xl font-semibold cursor-pointer hover:text-orange-600 transition-colors" 
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  {blog.title}
                </h2>
                <span className="text-sm text-gray-500 bg-orange-50 px-3 py-1 rounded-full">
                  By {blog.author}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                {/* Support array or string for tags */}
                {Array.isArray(blog.tag) && blog.tag.length > 0 && (
                  blog.tag.map((t, i) => (
                    <span key={i} className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium border border-orange-200">
                      #{t}
                    </span>
                  ))
                )}
                {typeof blog.tag === 'string' && blog.tag && (
                  <span className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium border border-orange-200">
                    #{blog.tag}
                  </span>
                )}
              </div>
              <p className="text-gray-600 line-clamp-2">
                {blog.content?.slice(0, 120)}{blog.content?.length > 120 ? '...' : ''}
              </p>
              <div className="flex gap-6 items-center mt-2 pt-3 border-t border-orange-100">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <span className="text-orange-500">👍</span> {blog.likes || 0} Likes
                </span>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <span className="text-orange-500">💬</span> {Array.isArray(blog.comments) ? blog.comments.length : 0} Comments
                </span>
                <Button 
                  variant="link" 
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="text-orange-600 hover:text-orange-700 ml-auto"
                >
                  Read More →
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {selectedBlog && (
        <BlogDetails blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
    </div>
  )
}

export default Dashboard
