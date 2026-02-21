require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

/* =========================
   SECURITY & MIDDLEWARE
========================= */

// Helmet (security headers)
app.use(helmet());

// CORS
// Only allow requests from frontend domain specified in .env
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));
// Body parser
app.use(express.json());

// Logging
app.use(morgan('dev'));

/* =========================
   RATE LIMITING
========================= */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later.'
    }
});

app.use('/api', limiter);

/* =========================
   ROUTES
========================= */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/users/profile', require('./routes/profileRoutes'));
app.use('/api/bill-pay', require('./routes/billPayRoutes'));

/* =========================
   HEALTH CHECK
========================= */

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Bank API runs successfully! 🚀'
    });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
    // Only log errors in development mode
    if (process.env.NODE_ENV !== 'production') {
        console.error("SERVER ERROR:", err);
    }

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    // console.log(`🚀 Server running on port ${PORT}`);
});