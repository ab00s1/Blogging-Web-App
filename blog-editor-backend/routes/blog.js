const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

// Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, tag, isDraft, author, authorEmail } = req.body;
    const status = isDraft ? 'draft' : 'published';
    // For draft, only require title, author, and authorEmail
    if (status === 'draft') {
      if (!title || !author || !authorEmail) {
        return res.status(400).json({ message: 'Title, author, and authorEmail are required for drafts.' });
      }
      const newBlog = new Blog({
        title,
        author,
        authorEmail,
        content: content || '',
        tag: tag || [],
        status
      });
      await newBlog.save();
      return res.status(201).json({ message: 'Draft blog created successfully', blog: newBlog });
    }
    // For published, require all fields
    if (!title || !content || !tag || !author || !authorEmail) {
      return res.status(400).json({ message: 'Title, content, tag, author, and authorEmail are required to publish.' });
    }
    const newBlog = new Blog({
      title,
      content,
      tag,
      status,
      author,
      authorEmail
    });
    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// Auto-save or upsert draft blog
router.put('/', async (req, res) => {
  try {
    const { title, content, tag, author, authorEmail } = req.body;
    if (!title || !author || !authorEmail) {
      return res.status(400).json({ message: 'Title, author, and authorEmail are required for auto-save.' });
    }
    // Find existing draft by author and title, or create new
    const filter = { title, author, authorEmail, status: 'draft' };
    const update = {
      title,
      content: content || '',
      tag: tag || [],
      status: 'draft',
      author,
      authorEmail,
      lastUpdatedAt: new Date()
    };
    const options = { new: true, upsert: true };
    const draftBlog = await Blog.findOneAndUpdate(filter, update, options);
    res.status(200).json({ message: 'Draft auto-saved', blog: draftBlog });
  } catch (error) {
    console.error('Error auto-saving draft:', error);
    res.status(500).json({ message: 'Error auto-saving draft', error: error.message });
  }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// Update a blog by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tag } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, tag, lastUpdatedAt: new Date() },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
});

// Delete a blog by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

// Like a blog
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog liked', likes: blog.likes });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ message: 'Error liking blog', error: error.message });
  }
});

// Remove a like from a blog
router.delete('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { $inc: { likes: -1 } }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Like removed', likes: blog.likes });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ message: 'Error removing like', error: error.message });
  }
});

// Add a comment to a blog
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;
    if (!text || !author) {
      return res.status(400).json({ message: 'Text and author are required for comments.' });
    }
    const comment = { text, author };
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Publish a draft blog
router.put('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.status === 'published') {
      return res.status(400).json({ message: 'Blog is already published' });
    }
    if (!blog.title || !blog.content || !blog.tag || !blog.author || !blog.authorEmail) {
      return res.status(400).json({ message: 'All fields must be filled to publish.' });
    }
    blog.status = 'published';
    blog.lastUpdatedAt = new Date();
    await blog.save();
    res.status(200).json({ message: 'Blog published successfully', blog });
  } catch (error) {
    console.error('Error publishing blog:', error);
    res.status(500).json({ message: 'Error publishing blog', error: error.message });
  }
});


module.exports = router;
