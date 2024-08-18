import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';
import { Guess } from './guess';

// Define User attributes
interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

// Define User creation attributes
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Extend the Model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  
  // Define associations
  public readonly Guess?: Guess[];  // This line tells TypeScript about the association
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export { User };
