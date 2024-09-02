import { Router } from 'express';
import { Guess } from '../models/guess';
import { User } from '../models/user';
import { Match } from '../models/match';
import { Gameweek } from '../models/gameweek';
import { authenticate } from '../middleware/authenticate';
import { getLatestActiveGameweekId } from '../utils';

const router = Router();

interface UserStats {
  exactGuesses: number;
  directionGuesses: number;
  totalPoints: number;
}

// Define an interface to include Match in Guess
interface GuessWithMatch extends Guess {
  Match: Match;
  User: User;
}

router.get('/current', authenticate, async (req, res) => {
  try {
    const currentGameweekId = await getLatestActiveGameweekId();

    // Fetch guesses with associated User and Match
    const guesses = await Guess.findAll({
      include: [
        {
          model: User,
          as: 'User', // Ensure this matches the 'as' defined in your association
        },
        {
          model: Match,
          as: 'Match', // Ensure this matches the 'as' defined in your association
          include: [
            {
              model: Gameweek,
              as: 'Gameweek', // Ensure this matches the 'as' defined in your association
              where: { id: Number(currentGameweekId) },
            },
          ],
        },
      ],
    }) as GuessWithMatch[];

    const stats: { [userId: number]: { username: string; exactGuesses: number; directionGuesses: number; totalPoints: number } } = {};

    for (const guess of guesses) {
      const userId = guess.userId;
      if (!stats[userId]) {
        const username = guess.User ? guess.User.username : 'Unknown User'; // Fallback username
        stats[userId] = {
          username,
          exactGuesses: 0,
          directionGuesses: 0,
          totalPoints: 0,
        };
      }

      if (guess.exact) {
        stats[userId].exactGuesses += 1;
        stats[userId].totalPoints += 3;
      } else if (guess.correctDirection) {
        stats[userId].directionGuesses += 1;
        stats[userId].totalPoints += 2;
      }
    }

    const result = Object.values(stats).sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(result);
  } catch (error) {
    console.error('Error fetching current gameweek stats:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// TODO: if this endpoint will be used, extract /current/... to another router and have "/" and "/number"
router.get('/current/id', authenticate, async (req, res) => {
  try {
    const latestActiveGameweekId = await getLatestActiveGameweekId();

    res.json(latestActiveGameweekId);
  } catch (error) {
    console.error('Error fetching the current active gameweek number:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
