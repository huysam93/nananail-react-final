const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDB } = require('./database');

const visitorsRoutes = require('./routes/visitors');
const authRoutes = require('./routes/auth');
const aboutRoutes = require('./routes/about');
const serviceRoutes = require('./routes/services');
const galleryRoutes = require('./routes/gallery');
const sliderRoutes = require('./routes/slider');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contacts');
const appointmentRoutes = require('./routes/appointments');
const messageRoutes = require('./routes/messages');
const devRoutes = require('./routes/dev');
const postsRoutes = require('./routes/posts');
const promotionsRoutes = require('./routes/promotions');
const beforeAfterRoutes = require('./routes/before_after');
const loyaltyRoutes = require('./routes/loyalty');

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Serve static uploads directory for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database connection
initializeDB();

// API Routes
app.use('/api', authRoutes);
app.use('/api', aboutRoutes);
app.use('/api', serviceRoutes);
app.use('/api', galleryRoutes);
app.use('/api', sliderRoutes);
app.use('/api', reviewRoutes);
app.use('/api', contactRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', messageRoutes);
app.use('/api', visitorsRoutes);
app.use('/api', postsRoutes);
app.use('/api', promotionsRoutes);
app.use('/api', beforeAfterRoutes);
app.use('/api', loyaltyRoutes);
app.use('/api/dev', devRoutes);

// Serve static frontend build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for all unmatched routes (SPA fix)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('NanaNail API is running...');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});