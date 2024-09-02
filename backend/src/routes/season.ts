// routes/season.ts
import { Router } from 'express';
import { Guess } from '../models/guess';
import { authenticate } from '../middleware/authenticate';
import { User } from '../models/user';
import { Match } from '../models/match';
import { Gameweek } from '../models/gameweek';
import { sequelize } from '../db';
import { getLatestActiveGameweekId } from '../utils';

const router = Router();

interface UserStats {
  exactGuesses: number;
  directionGuesses: number;
  totalPoints: number;
}

// Define an interface to include Match in Guess
interface GuessWithUser extends Guess {
  Match: Match;
  User: User;
}

router.get('/standings', authenticate, async (req, res) => {
  try {
    // const currentGameweek = await getLatestActiveGameweekId();
    const currentGameweek = 3; // TODO: remove this line after tests

    const guesses = await Guess.findAll({
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN exact THEN 1 ELSE 0 END')), 'exactGuesses'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN "correctDirection" THEN 1 ELSE 0 END')), 'directionGuesses'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN exact THEN 3 WHEN "correctDirection" THEN 2 ELSE 0 END')), 'totalPoints']
      ],
      include: [
        {
          model: User,
          as: 'User',
        }
      ],
      group: ['userId', 'User.id'], // Group by userId and User.id
      where: {
        gameweekId: Number(currentGameweek)
      }
    }) as GuessWithUser[];;    

    const stats = guesses.map(guess => ({
      username: guess.User ? guess.User.username : 'Unknown User', // Fallback username
      exactGuesses: Number(guess.getDataValue('exactGuesses')),
      directionGuesses: Number(guess.getDataValue('directionGuesses')),
      totalPoints: Number(guess.getDataValue('totalPoints')),
    }));

    const result = stats.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(result);
  } catch (error) {
    console.error('Error fetching current gameweek stats:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
