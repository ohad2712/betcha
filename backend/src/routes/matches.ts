import { Router } from 'express';
import axios from 'axios';
import { Match } from '../models/match';
import { authenticate } from '../middleware/authenticate';

const router = Router();

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_URL = 'https://v3.football.api-sports.io';

router.get('/upcoming', authenticate, async (req, res) => {
  try {
    // Check if the next gameweek is already cached
    const cachedMatches = await Match.findOne({ where: { gameweek: req.query.gameweek } });
    
    if (cachedMatches) {
      return res.json(cachedMatches);
    }

    // Fetch upcoming matches from the API
    const response = await axios.get(`${API_URL}/fixtures`, {
      params: {
        league: '39', // Premier League
        season: '2024',
        next: '10', // Fetch the next 10 matches for the upcoming gameweek
      },
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    const matches = response.data.response;

    // Save matches to the database
    const newMatch = await Match.create({ gameweek: req.query.gameweek, matches });
    res.json(newMatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch upcoming matches' });
  }
});

export default router;
