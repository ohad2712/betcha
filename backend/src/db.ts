import { Sequelize } from 'sequelize';

// Create a new instance of Sequelize
export const sequelize = new Sequelize('db_dev', 'ohad', '', {
  host: '127.0.0.1',
  dialect: 'postgres',
});
