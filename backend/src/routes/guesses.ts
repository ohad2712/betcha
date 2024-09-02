import { Router } from 'express';
import { Guess } from '../models/guess';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/', authenticate, async (req, res) => {
  const guesses = req.body.guesses;
  
  // Check if req.user is defined
  const userId = req.user?.id;
  if (userId === undefined) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Upsert each guess in the batch
    const guessPromises = guesses.map(({ matchId, gameweekId, homeGoals, awayGoals }: { matchId: number, gameweekId: number, homeGoals: number, awayGoals: number }) => {
      return Guess.upsert({
        userId,
        matchId: Number(matchId),
        gameweekId: Number(gameweekId),
        homeGoals,
        awayGoals,
      });
    });

    await Promise.all(guessPromises);

    res.status(200).json({ message: 'Guesses updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save guesses' });
  }
});

router.get('/:gameweekId', authenticate, async (req, res) => {
  const gameweekId = req.params.gameweekId;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const userGuesses = await Guess.findAll({
      where: {
        userId,
        gameweekId: Number(gameweekId),
      },
    });

    res.status(200).json(userGuesses);
  } catch (error) {
    console.error('Failed to fetch user guesses:', error);
    res.status(500).json({ error: 'Failed to fetch user guesses' });
  }
});

export default router;
