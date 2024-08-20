import { Router } from 'express';
import { Guess } from '../models/guess';
import { User } from '../models/user';
import { authenticate } from '../middleware/authenticate';
import { Includeable } from 'sequelize';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    res.json({ settings: true });
  } catch (error) {
    console.error('Error fetching cup data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
