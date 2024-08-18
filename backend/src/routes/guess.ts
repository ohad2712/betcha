import { Router } from 'express';
import { Guess } from '../models/guess';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/:matchId', authenticate, async (req, res) => {
  const { matchId } = req.params;
  const { homeGoals, awayGoals, exact, correctDirection } = req.body;
  
  // Check if req.user is defined
  const userId = req.user?.id;
  if (userId === undefined) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Save the guess in the database
    const guess = await Guess.create({
      userId,
      matchId: Number(matchId),  // Ensure matchId is a number
      homeGoals,
      awayGoals,
      correctDirection,
      exact
    });

    res.status(201).json(guess);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save guess' });
  }
});

export default router;
