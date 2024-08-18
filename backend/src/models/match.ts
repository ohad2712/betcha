// models/match.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { Gameweek } from './gameweek';
import { Guess } from './guess';

class Match extends Model {
  public id!: number;
  public gameweekId!: number;
  public homeGoals!: number;
  public awayGoals!: number;
  public homeTeam!: string;
  public awayTeam!: string;
}

// Initialize the model
Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gameweekId: {
      type: DataTypes.INTEGER,
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
    homeTeam: {  
      type: DataTypes.STRING,
      allowNull: false,
    },
    awayTeam: {  
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Match',
  }
);

export { Match };
