import { Router } from 'express';
import { Guess } from '../models/guess';
import { User } from '../models/user';
import { authenticate } from '../middleware/authenticate';

const router = Router();

const SEMI_FINAL_GWS = ['8', '14', '21', '27'];
const FINAL_GWS = ['30', '35', '38'];

// Get cup data
router.get('/', authenticate, async (req, res) => {
  try {
    const semiFinals = await getCupMatches(SEMI_FINAL_GWS);
    const finals = await getCupMatches(FINAL_GWS);

    res.json({ semiFinals, finals });
  } catch (error) {
    console.error('Error fetching cup data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Helper function to get cup matches
async function getCupMatches(gameweeks: string[]) {
  const guesses = await Guess.findAll({
    where: { gameweek: gameweeks },
    include: [{ model: User, as: 'User' }],
  });

  const userMap: { [key: number]: { username: string; gameweekPoints: number[]; totalPoints: number } } = {};

  guesses.forEach((guess) => {
    if (guess.User) {
      if (!userMap[guess.userId]) {
        userMap[guess.userId] = {
          username: guess.User.username,
          gameweekPoints: new Array(gameweeks.length).fill(0),
          totalPoints: 0,
        };
      }

      const gameweekIndex = gameweeks.indexOf(guess.gameweek);
      const points = guess.exact ? 3 : guess.correctDirection ? 2 : 0;

      if (gameweekIndex !== -1) {
        userMap[guess.userId].gameweekPoints[gameweekIndex] = points;
        userMap[guess.userId].totalPoints += points;
      }
    }
  });

  return Object.values(userMap);
}

export default router;
