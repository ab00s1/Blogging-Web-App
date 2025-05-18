import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState(''); // input as string
  const [tags, setTags] = useState([]); // array of tags
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect to landing if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`https://blog-editor-service.onrender.com/api/blog/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '');
        setContent(data.content || '');
        // If tag is array, join for input; else fallback
        if (Array.isArray(data.tag)) {
          setTagInput(data.tag.join(', '));
          setTags(data.tag);
        } else if (typeof data.tag === 'string') {
          setTagInput(data.tag);
          setTags(data.tag ? [data.tag] : []);
        } else {
          setTagInput('');
          setTags([]);
        }
        setStatus(data.status || 'draft');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load blog');
        setLoading(false);
      });
  }, [id]);

  // Keep tags array in sync with tagInput
  useEffect(() => {
    setTags(
      tagInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    );
  }, [tagInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validation: if published, require tag and content
    if (status === 'published') {
      if (tags.length === 0 || !content.trim()) {
        setError('Tag and content are required to update a published blog.');
        return;
      }
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://blog-editor-service.onrender.com/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tag: tags, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('Failed to update blog');
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center py-16 text-orange-600">
      <div className="animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
        Edit Blog
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Blog Title</label>
          <Input
            type="text"
            placeholder="Enter your blog title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="border-orange-200 bg-orange-50/50 placeholder:text-orange-300 focus:ring-orange-200"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
            <span>Tags</span>
            {status === 'published' && (
              <span className="text-xs text-orange-600">Required for published blogs</span>
            )}
          </label>
          <Input
            type="text"
            placeholder="e.g. tech, life, guide (separate by comma)"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            className="border-orange-200 bg-orange-50/50 placeholder:text-orange-300 focus:ring-orange-200"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((t, i) => (
              <span key={i} className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium border border-orange-200">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">Required for publishing, optional for drafts. Separate tags by comma.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
            <span>Content</span>
            {status === 'published' && (
              <span className="text-xs text-orange-600">Required for published blogs</span>
            )}
          </label>
          <textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            className="w-full border border-orange-200 rounded-lg p-3 bg-orange-50/50 placeholder:text-orange-300 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-300"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-orange-100">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(`/blog/${id}`)}
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-600 hover:to-amber-500 shadow-md hover:shadow-lg transition-all"
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </Button>
        </div>
      </form>
    </div>
  );
}
