"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
// Define Match attributes
class Match extends sequelize_1.Model {
}
exports.Match = Match;
// Initialize the model
Match.init({
    gameweek: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    homeGoals: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    awayGoals: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    matches: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'Match',
});
