// routes/season.ts
import { Router } from 'express';
import { Guess } from '../models/guess';
import { authenticate } from '../middleware/authenticate';
import { User } from '../models/user';
import { Match } from '../models/match';
import { Gameweek } from '../models/gameweek';
import { Op } from 'sequelize';

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
    // Fetch the latest season year
    const latestGameweek = await Gameweek.findOne({
      order: [['seasonYear', 'DESC']],
    });

    if (!latestGameweek) {
      return res.status(404).json({ error: 'No gameweek data found' });
    }

    const latestSeasonYear = latestGameweek.seasonYear;

    // Fetch all gameweeks for the latest season year
    const gameweeks = await Gameweek.findAll({
      where: { seasonYear: latestSeasonYear },
    });

    const gameweekIds = gameweeks.map((gw) => gw.id);

    // Fetch all guesses for the latest season year
    const guesses = await Guess.findAll({
      include: [
        {
          model: User,
          as: 'User',
        },
        {
          model: Match,
          as: 'Match',
          where: {
            gameweekId: {
              [Op.in]: gameweekIds, // Use the $in operator with the array of gameweekIds
            },
          },
        },
      ],
    }) as GuessWithMatch[];
    

    const stats: Record<number, UserStats> = {};

    guesses.forEach((guess) => {
      const userId = guess.userId;
      if (!stats[userId]) {
        stats[userId] = { exactGuesses: 0, directionGuesses: 0, totalPoints: 0 };
      }

      const matchResult = guess.Match;
      if (!matchResult) return;

      const isExact = guess.homeGoals === matchResult.homeGoals && guess.awayGoals === matchResult.awayGoals;
      const isDirection = (guess.homeGoals - guess.awayGoals) === (matchResult.homeGoals - matchResult.awayGoals);

      if (isExact) {
        stats[userId].exactGuesses += 1;
        stats[userId].totalPoints += 3;
      } else if (isDirection) {
        stats[userId].directionGuesses += 1;
        stats[userId].totalPoints += 2;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch season stats' });
  }
});

export default router;
