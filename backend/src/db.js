"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
// Create a new instance of Sequelize
exports.sequelize = new sequelize_1.Sequelize('db_dev', 'ohad', '', {
    host: '127.0.0.1',
    dialect: 'postgres',
});
