"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guess = void 0;
// Extend the Model class
class Guess extends Model {
}
exports.Guess = Guess;
// Initialize the model
Guess.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gameweek: {
        type: DataTypes.STRING,
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
    matchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Guess',
});
// Define associations
Guess.belongsTo(User, { foreignKey: 'userId', as: 'User' });
User.hasMany(Guess, { foreignKey: 'userId' });
Guess.belongsTo(Match, { foreignKey: 'matchId', as: 'Match' }); // Use matchId instead of gameweek
Match.hasMany(Guess, { foreignKey: 'matchId' }); // Use matchId instead of gameweek
