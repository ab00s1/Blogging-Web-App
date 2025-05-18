import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState(''); // input as string
  const [tags, setTags] = useState([]); // array of tags
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  const autoSaveTimeout = useRef(null);
  const isFirstRender = useRef(true);
  const lastSaved = useRef({ title: '', content: '', tag: [] });
  const navigate = useNavigate();

  // Redirect to landing if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Update tags array whenever tagInput changes
  useEffect(() => {
    setTags(
      tagInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    );
  }, [tagInput]);

  // Single debounced auto-save draft effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (publishing || saving) return;
    if (!title) {
      setAutoSaveStatus('Title is necessary to save draft');
      return;
    }
    if (!title && !content && tags.length === 0) return;
    // Only auto-save if something changed since last save
    if (
      title === lastSaved.current.title &&
      content === lastSaved.current.content &&
      JSON.stringify(tags) === JSON.stringify(lastSaved.current.tag)
    ) {
      return;
    }
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(async () => {
      setAutoSaveStatus('Saving draft...');
      setSaving(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const userEmail = localStorage.getItem('userEmail');
        const res = await fetch('https://blog-editor-service.onrender.com/api/blog', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, tag: tags, isDraft: true, author: username, authorEmail: userEmail }),
        });
        if (!res.ok) throw new Error('Failed to auto-save draft');
        setAutoSaveStatus('Draft auto-saved');
        lastSaved.current = { title, content, tag: tags };
        toast.success('Draft auto-saved', { position: 'top-right', autoClose: 2000 });
        setTimeout(() => setAutoSaveStatus(''), 1500);
      } catch (err) {
        setAutoSaveStatus('Auto-save failed');
        toast.error('Auto-save failed', { position: 'top-right', autoClose: 2000 });
      } finally {
        setSaving(false);
      }
    }, 5000); // 5s debounce
    return () => {
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    };
  }, [title, content, tags, publishing, saving]);

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (isDraft) {
      if (!title) {
        setError('Title is necessary to save draft');
        return;
      }
      setSaving(true);
    } else {
      if (!title || !content || tags.length === 0) {
        setError('All fields are required to publish blog');
        return;
      }
      setPublishing(true);
    }
    setError('');
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const userEmail = localStorage.getItem('userEmail');
      const res = await fetch('https://blog-editor-service.onrender.com/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tag: tags, isDraft, author: username, authorEmail: userEmail }),
      });
      if (!res.ok) throw new Error('Failed to create blog');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setPublishing(false);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 relative">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
        Write a New Blog
      </h1>
      <form className="space-y-6 bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100">
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
          {autoSaveStatus === 'Title is necessary to save draft' && (
            <p className="text-orange-600 text-xs">Title is required to auto-save draft</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tags</label>
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
          <label className="text-sm font-medium text-gray-700">Content</label>
          <textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            className="w-full border border-orange-200 rounded-lg p-3 bg-orange-50/50 placeholder:text-orange-300 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-300"
          />
          <p className="text-xs text-gray-500">Required for publishing, optional for drafts</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Button 
              type="button" 
              onClick={e => handleSubmit(e, true)}
              disabled={saving || publishing}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
              variant="outline"
            >
              {saving ? 'Saving Draft...' : 'Save as Draft'}
            </Button>
            <Button 
              type="submit" 
              onClick={e => handleSubmit(e, false)}
              disabled={publishing || saving}
              className="bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-600 hover:to-amber-500 shadow-md hover:shadow-lg transition-all"
            >
              {publishing ? 'Publishing...' : 'Publish Blog'}
            </Button>
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
