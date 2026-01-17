import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contacts.js';
import feedbackRoutes from './routes/feedback.js';
import configRoutes from './routes/config.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/config', configRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio Backend API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            contacts: '/api/contacts',
            feedback: '/api/feedback',
            config: '/api/config',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`\n✨ Available endpoints:`);
    console.log(`   - POST   /api/auth/login`);
    console.log(`   - POST   /api/contacts`);
    console.log(`   - GET    /api/contacts (admin)`);
    console.log(`   - POST   /api/feedback`);
    console.log(`   - GET    /api/feedback (admin)`);
    console.log(`   - GET    /api/config`);
    console.log(`   - PUT    /api/config (admin)`);
    console.log(`   - GET    /api/config/colors`);
    console.log(`   - PUT    /api/config/colors (admin)`);
    console.log(`   - POST   /api/config/colors/reset (admin)`);
    console.log(`\n`);
});
