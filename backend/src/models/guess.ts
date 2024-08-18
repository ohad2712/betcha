// models/guess.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { Gameweek } from './gameweek';
import { Match } from './match';
import { User } from './user';

class Guess extends Model {
  public id!: number;
  public userId!: number;
  public gameweekId!: number;
  public matchId!: number;
  public exact!: boolean;
  public correctDirection!: boolean;
  public homeGoals!: number;
  public awayGoals!: number;
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
    matchId: {  
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameweekId: {
      type: DataTypes.INTEGER,
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
    homeGoals: {  
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayGoals: {  
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Guess',
  }
);


export { Guess };
