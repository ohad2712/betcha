import { Router } from 'express';
import { Guess } from '../models/guess';
import { User } from '../models/user';
import { Match } from '../models/match';
import { authenticate } from '../middleware/authenticate';

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

router.get('/stats', authenticate, async (req, res) => {
  try {
    const gameweek = Array.isArray(req.query.gameweek) ? req.query.gameweek[0] : req.query.gameweek;

    if (!gameweek || typeof gameweek !== 'string') {
      return res.status(400).json({ error: 'Invalid gameweek parameter' });
    }

    // Query to filter guesses based on the match's gameweek
    const guesses = await Guess.findAll({
      include: [
        {
          model: User,
          as: 'User',
        },
        {
          model: Match,
          as: 'Match',
          where: { gameweek: Number(gameweek) },
        },
      ],
    }) as GuessWithMatch[];

    const stats: { [userId: number]: UserStats } = {};

    for (const guess of guesses) {
      const userId = guess.userId;
      if (!stats[userId]) {
        stats[userId] = { exactGuesses: 0, directionGuesses: 0, totalPoints: 0 };
      }

      const matchResult = guess.Match;
      if (!matchResult) continue;

      const isExact = guess.homeGoals === matchResult.homeGoals && guess.awayGoals === matchResult.awayGoals;
      const isDirection = (guess.homeGoals - guess.awayGoals) === (matchResult.homeGoals - matchResult.awayGoals);

      if (isExact) {
        stats[userId].exactGuesses += 1;
        stats[userId].totalPoints += 3;
      } else if (isDirection) {
        stats[userId].directionGuesses += 1;
        stats[userId].totalPoints += 2;
      }
    }

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch gameweek stats' });
  }
});

router.get('/current', authenticate, async (req, res) => {
  try {
    const currentGameweek = 'current_gameweek'; // This should be dynamic in a real application

    const guesses = await Guess.findAll({
      include: [
        {
          model: User,
          as: 'User',
        },
        {
          model: Match,
          as: 'Match',
          where: { gameweek: Number(currentGameweek) },
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

export default router;
