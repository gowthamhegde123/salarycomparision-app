import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import salaryRoutes from './routes/salaries.js';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';
import predictorRoutes from './routes/predictor.js';
import initRoutes from './routes/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Set security headers
app.use(helmet());

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Body parser limit to avoid large payloads
app.use(cookieParser());
app.use(mongoSanitize()); // Data sanitization
app.use(xss()); // XSS protection

app.use('/api/salaries', salaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/predictor', predictorRoutes);
app.use('/api/init', initRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
