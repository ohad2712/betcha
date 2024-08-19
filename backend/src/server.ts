import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './db';

import matchRoutes from './routes/matches';
import guessRoutes from './routes/guess';
import gameweekRoutes from './routes/gameweek';
import seasonRoutes from './routes/season';
import cupRoutes from './routes/cup';
import settingsRoutes from './routes/settings';

import { errorHandler } from './middleware/errorHandler';
import { User, Guess, Gameweek, Match } from './models'; // Import models


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/matches', matchRoutes);
app.use('/api/guesses', guessRoutes);
app.use('/api/gameweek', gameweekRoutes);
app.use('/api/season', seasonRoutes);
app.use('/api/cup', cupRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
});
