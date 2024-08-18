// routes/matches.ts
import { Router } from 'express';
import axios from 'axios';
import { Match } from '../models/match';
import { authenticate } from '../middleware/authenticate';

const router = Router();

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_URL = 'https://v3.football.api-sports.io';

router.get('/upcoming', authenticate, async (req, res) => {
  try {
    const gameweekId = req.query.gameweek;
    
    // Check if the next gameweek is already cached
    const cachedMatches = await Match.findAll({ where: { gameweekId: Number(gameweekId) } });
    
    if (cachedMatches.length > 0) {
      return res.json(cachedMatches);
    }

    // Fetch upcoming matches from the API
    const response = await axios.get(`${API_URL}/fixtures`, {
      params: {
        league: '39', // Premier League
        season: '2024',
        next: '10',
      },
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    const matchesData = JSON.parse(response.data.response);
    // TODO: add a type for this
    const matches = matchesData.map((data: any) => ({
      gameweekId: Number(gameweekId),
      homeTeam: data.teams.home.name,
      awayTeam: data.teams.away.name,
      homeGoals: 0,
      awayGoals: 0,
    }));

    const savedMatches = await Match.bulkCreate(matches);
    res.json(savedMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

export default router;
