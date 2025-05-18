import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function BlogDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const username = localStorage.getItem('username');
  const userEmail = localStorage.getItem('userEmail');

  // Redirect to landing if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    // Dummy blogs fallback
    const dummyBlogs = [
      {
        _id: 'dummy1',
        title: 'Welcome to Blogger!',
        author: 'Admin',
        content: 'This is a sample blog post. Start writing your own blogs and share your thoughts with the world!',
        likes: 0,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        comments: [],
        tag: 'welcome',
        authorEmail: userEmail,
      },
      {
        _id: 'dummy2',
        title: 'How to use the Dashboard',
        author: 'Admin',
        content: 'Click on any blog title to read more. Like your favorite blogs and see them rise to the top!',
        likes: 0,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        comments: [],
        tag: 'guide',
        authorEmail: userEmail,
      },
    ];
    fetch(`https://blog-editor-service.onrender.com/api/blog/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setBlog(data);
        } else {
          // If not found in backend, check dummy
          const found = dummyBlogs.find(b => b._id === id);
          setBlog(found || null);
        }
        setLoading(false);
      })
      .catch(() => {
        // On error, check dummy
        const found = dummyBlogs.find(b => b._id === id);
        setBlog(found || null);
        setLoading(false);
      });
  }, [id, userEmail]);

  const isMyBlog = blog && blog.authorEmail && blog.authorEmail === userEmail;

  useEffect(() => {
    // Check if user has liked this blog (by username)
    if (blog && Array.isArray(blog.likedBy) && username) {
      setHasLiked(blog.likedBy.includes(username));
    }
  }, [blog, username]);

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      const url = `https://blog-editor-service.onrender.com/api/blog/${id}/like`;
      const method = hasLiked ? 'DELETE' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        setBlog(b => {
          let likes = b.likes || 0;
          let likedBy = Array.isArray(b.likedBy) ? [...b.likedBy] : [];
          if (hasLiked) {
            likes = Math.max(0, likes - 1);
            likedBy = likedBy.filter(u => u !== username);
          } else {
            likes = likes + 1;
            likedBy.push(username);
          }
          return { ...b, likes, likedBy };
        });
        setHasLiked(!hasLiked);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`https://blog-editor-service.onrender.com/api/blog/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment, author: username }),
      });
      const data = await res.json();
      setBlog(b => ({ ...b, comments: [...(b.comments || []), data.comment || { text: comment, author: userEmail, createdAt: new Date().toISOString() }] }));
      setComment('');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center py-16 text-orange-600">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="text-center py-16 text-red-500">{error}</div>
  );
  if (!blog) return (
    <div className="text-center py-16 text-gray-500">Blog not found.</div>
  );

  const isDraft = blog.status === 'draft';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <article className="bg-white rounded-xl shadow-md border border-orange-100 p-8">
        {/* Title and Author Section */}
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
          <span className="bg-orange-50 px-3 py-1 rounded-full font-medium">
            By {blog.author}
          </span>
          <span>•</span>
          <span>
            Published: {new Date(blog.createdAt).toLocaleString()}
          </span>
          {blog.lastUpdatedAt && (
            <>
              <span>•</span>
              <span>
                Updated: {new Date(blog.lastUpdatedAt).toLocaleString()}
              </span>
            </>
          )}
          {/* Tags: support array or string for backward compatibility */}
          {Array.isArray(blog.tag) && blog.tag.length > 0 && (
            <>
              <span>•</span>
              <span className="flex flex-wrap gap-2">
                {blog.tag.map((t, i) => (
                  <span key={i} className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1 rounded-full font-medium border border-orange-200">
                    #{t}
                  </span>
                ))}
              </span>
            </>
          )}
          {typeof blog.tag === 'string' && blog.tag && (
            <>
              <span>•</span>
              <span className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1 rounded-full font-medium border border-orange-200">
                #{blog.tag}
              </span>
            </>
          )}
          {isDraft && (
            <>
              <span>•</span>
              <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                Draft
              </span>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="prose max-w-none mb-8 text-gray-700 leading-relaxed">
          {blog.content}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 items-center mb-8 pt-4 border-t border-orange-100">
          {!isDraft && (
            <Button 
              variant={hasLiked ? "default" : "outline"}
              onClick={handleLike} 
              disabled={likeLoading}
              className={`transition-all ${
                hasLiked 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-600 hover:to-amber-500' 
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              }`}
            >
              {hasLiked ? '👍 Liked' : '👍 Like'} ({blog.likes})
            </Button>
          )}
          {isMyBlog && (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/edit-blog/${blog._id}`)}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this blog?')) {
                    await fetch(`https://blog-editor-service.onrender.com/blogs/${blog._id}`, { method: 'DELETE' });
                    navigate('/dashboard');
                  }
                }}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
              {isDraft && (
                <Button 
                  onClick={async () => {
                    if (!blog.title || !blog.tag || !blog.content) {
                      alert('All fields (title, tag, content) are required to publish a blog.');
                      return;
                    }
                    await fetch(`https://blog-editor-service.onrender.com/api/blog/${blog._id}/publish`, { method: 'PUT' });
                    window.location.reload();
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-600 hover:to-amber-500"
                >
                  Publish
                </Button>
              )}
            </>
          )}
        </div>

        {/* Comments Section */}
        {!isDraft && (
          <div className="space-y-6">
            <form onSubmit={handleComment} className="flex gap-3">
              <input
                type="text"
                className="flex-1 border border-orange-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-orange-50/50 placeholder:text-orange-300"
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={commentLoading}
              />
              <Button 
                type="submit" 
                disabled={commentLoading || !comment.trim()}
                className="bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-600 hover:to-amber-500"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>

            <div className="border-t border-orange-100 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Comments {blog.comments?.length > 0 && `(${blog.comments.length})`}
              </h2>
              {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
                <ul className="space-y-4">
                  {blog.comments.map((c, i) => (
                    <li key={i} className="bg-orange-50/50 rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm font-medium text-gray-700">
                          {c.author || 'Anonymous'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                      <div className="text-gray-600">{c.text}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm bg-orange-50/50 rounded-lg p-4 text-center">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
