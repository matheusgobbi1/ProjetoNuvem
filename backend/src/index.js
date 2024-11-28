import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as authRoutes } from './routes/auth.js';
import { router as projectRoutes } from './routes/projects.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});