import { Router } from 'express';
import axios from 'axios';
import { Match } from '../models/match';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Helper function to get the latest active gameweek ID
const getLatestActiveGameweek = async (): Promise<number | null> => {
  try {
    const response = await axios.get(`${process.env.API_FOOTBALL_URL}/fixtures/rounds`, {
      params: {
        league: process.env.LEAGUE_CODE,
        season: process.env.SEASON,
        current: 'true',
      },
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY,
      },
    });

    // Assuming the API returns an array of gameweeks and the last one is the active one
    const gameweeks = response.data.response;
    const latestGameweek = gameweeks.pop(); // Get the latest active gameweek

    if (latestGameweek) {
      return parseInt(latestGameweek.match(/\d+/)[0]); // Extract the number from the gameweek string
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch the latest active gameweek:', error);
    return null;
  }
};

router.get('/upcoming', authenticate, async (req, res) => {
  try {
    console.log("In /upcoming :)", req.headers);
    
    const gameweekId = await getLatestActiveGameweek();

    if (!gameweekId) {
      return res.status(500).json({ error: 'Failed to retrieve the latest active gameweek' });
    }

    // Check if the matches for this gameweek are already cached
    const cachedMatches = await Match.findAll({ where: { gameweekId } });

    if (cachedMatches.length > 0) {
      return res.json(cachedMatches);
    }

    // Fetch upcoming matches for the gameweek from the API
    const response = await axios.get(`${process.env.API_FOOTBALL_URL}/fixtures`, {
      params: {
        league: process.env.LEAGUE_CODE,
        season: process.env.SEASON,
        round: `Regular Season - ${gameweekId}`,
      },
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY,
      },
    });

    const matchesData = response.data.response;

    // Map the API data to your Match model
    const matches = matchesData.map((data: any) => ({
      gameweekId,
      homeTeam: data.teams.home.name,
      awayTeam: data.teams.away.name,
      homeGoals: 0,
      awayGoals: 0,
    }));

    // Save the matches to the cache (database)
    const savedMatches = await Match.bulkCreate(matches);
    res.json(savedMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

export default router;
