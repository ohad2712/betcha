import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

// Define Match attributes
export class Match extends Model {
  public gameweek!: number;
  public homeGoals!: number;  // Add homeGoals
  public awayGoals!: number;  // Add awayGoals
  public matches!: any;
}

// Initialize the model
Match.init(
  {
    gameweek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    homeGoals: { // Add homeGoals
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayGoals: { // Add awayGoals
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matches: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Match',
  }
);
