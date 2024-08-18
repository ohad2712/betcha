import { Router } from 'express';
import { Guess } from '../models/guess';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/stats', authenticate, async (req, res) => {
  try {
    // Fetch all guesses for the season
    const guesses = await Guess.findAll({
      include: ['User', 'Match'],
    });

    // Calculate overall stats
    const stats = guesses.reduce((acc, guess) => {
      const userId = guess.userId;
      if (!acc[userId]) {
        acc[userId] = { exactGuesses: 0, directionGuesses: 0, totalPoints: 0 };
      }
      
      const matchResult = guess.Match;
      const isExact = guess.homeGoals === matchResult.homeGoals && guess.awayGoals === matchResult.awayGoals;
      const isDirection = (guess.homeGoals - guess.awayGoals) === (matchResult.homeGoals - matchResult.awayGoals);

      if (isExact) {
        acc[userId].exactGuesses += 1;
        acc[userId].totalPoints += 3;
      } else if (isDirection) {
        acc[userId].directionGuesses += 1;
        acc[userId].totalPoints += 2;
      }
      return acc;
    }, {});

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch season stats' });
  }
});

export default router;