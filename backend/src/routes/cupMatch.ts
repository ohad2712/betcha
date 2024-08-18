import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export class CupMatch extends Model {
  public userId!: number;
  public stage!: string;
  public gameweekPoints!: number[];
  public totalPoints!: number;
}

CupMatch.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gameweekPoints: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [],
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'CupMatch',
  }
);
