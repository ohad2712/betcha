import { Sequelize } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL || "postgresql://localhost:5432/betcha", {
  dialect: 'postgres',
  logging: false, // Set to true to see SQL queries
});

export { sequelize };
