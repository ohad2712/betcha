// models/gameweek.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';
import { Match } from './match';
import { Guess } from './guess';

// Define Gameweek attributes
interface GameweekAttributes {
  id: number;
  seasonYear: number;
  weekNumber: number;
}

// Define Gameweek creation attributes
interface GameweekCreationAttributes extends Optional<GameweekAttributes, 'id'> {}

// Extend the Model class
class Gameweek extends Model<GameweekAttributes, GameweekCreationAttributes> implements GameweekAttributes {
  public id!: number;
  public seasonYear!: number;
  public weekNumber!: number;
  
  // Define associations
  public readonly Matches?: Match[];
  public readonly Guesses?: Guess[];
}

// Initialize the model
Gameweek.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    seasonYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weekNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Gameweek',
  }
);


export { Gameweek };
