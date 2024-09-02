import { User } from './user';
import { Match } from './match';
import { Gameweek } from './gameweek';
import { Guess } from './guess';

// Define associations
User.hasMany(Guess, { foreignKey: 'userId', as: 'Guesses' });
Guess.belongsTo(User, { foreignKey: 'userId', as: 'User' });

Gameweek.hasMany(Match, { foreignKey: 'gameweekId', as: 'Matches' });
Gameweek.hasMany(Guess, { foreignKey: 'gameweekId', as: 'Guesses' });
Match.belongsTo(Gameweek, { foreignKey: 'gameweekId', as: 'Gameweek' });

Match.hasMany(Guess, { foreignKey: 'matchId', as: 'Guesses' });
Guess.belongsTo(Match, { foreignKey: 'matchId', as: 'Match' });

// Import models to ensure they are registered
import './user';
import './guess';
import './gameweek';
import './match';

// Export all models
export { User, Guess, Gameweek, Match };
