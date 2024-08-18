"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const matches_1 = __importDefault(require("./routes/matches"));
const guess_1 = __importDefault(require("./routes/guess"));
const gameweek_1 = __importDefault(require("./routes/gameweek"));
const season_1 = __importDefault(require("./routes/season"));
const cup_1 = __importDefault(require("./routes/cup"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/matches', matches_1.default);
app.use('/api/guesses', guess_1.default);
app.use('/api/gameweek', gameweek_1.default);
app.use('/api/season', season_1.default);
app.use('/api/cup', cup_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Initialize database and start server
db_1.sequelize.sync({ force: false }).then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
});
