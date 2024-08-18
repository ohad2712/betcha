"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CupMatch = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class CupMatch extends sequelize_1.Model {
}
exports.CupMatch = CupMatch;
CupMatch.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    stage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    gameweekPoints: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
    },
    totalPoints: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'CupMatch',
});
