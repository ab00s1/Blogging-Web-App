const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  tag: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    required: true,
    default: 'draft',
  },
  author: { type: String, required: true },
  authorEmail: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{
    author: String,
    text: String,
}]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdatedAt' } });

module.exports = mongoose.model('Blog', BlogSchema);