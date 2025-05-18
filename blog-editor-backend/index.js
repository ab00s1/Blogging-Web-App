const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
  origin: 'https://blog-editor-client.vercel.app',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const blogRoutes = require('./routes/blog');
app.use('/api/blog', blogRoutes);

app.listen(PORT, () => console.log("Server running on port 5000"));