import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';
import { User } from './user';
import { Match } from './match';

// Define Guess attributes
interface GuessAttributes {
  id: number;
  userId: number;
  gameweek: string;
  exact: boolean;
  correctDirection: boolean;
  homeGoals: number;  // Add homeGoals
  awayGoals: number;  // Add awayGoals
}

// Define Guess creation attributes
interface GuessCreationAttributes extends Optional<GuessAttributes, 'id'> {}

// Extend the Model class
export class Guess extends Model<GuessAttributes, GuessCreationAttributes> implements GuessAttributes {
  public id!: number;
  public userId!: number;
  public gameweek!: string;
  public exact!: boolean;
  public correctDirection!: boolean;
  public homeGoals!: number;  // Add homeGoals
  public awayGoals!: number;  // Add awayGoals
  
  // Define associations
  public readonly User?: User;
  public readonly Match?: Match;
}

// Initialize the model
Guess.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameweek: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    correctDirection: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    homeGoals: {  // Add homeGoals
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayGoals: {  // Add awayGoals
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Guess',
  }
);

// Define associations
Guess.belongsTo(User, { foreignKey: 'userId', as: 'User' });
User.hasMany(Guess, { foreignKey: 'userId' });

Guess.belongsTo(Match, { foreignKey: 'gameweek', as: 'Match' });
Match.hasMany(Guess, { foreignKey: 'gameweek' });
