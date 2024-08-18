"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guess_1 = require("../models/guess");
const user_1 = require("../models/user");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
const SEMI_FINAL_GWS = ['8', '14', '21', '27'];
const FINAL_GWS = ['30', '35', '38'];
// Get cup data
router.get('/', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semiFinals = yield getCupMatches(SEMI_FINAL_GWS);
        const finals = yield getCupMatches(FINAL_GWS);
        res.json({ semiFinals, finals });
    }
    catch (error) {
        console.error('Error fetching cup data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
// Helper function to get cup matches
function getCupMatches(gameweeks) {
    return __awaiter(this, void 0, void 0, function* () {
        const guesses = yield guess_1.Guess.findAll({
            where: { gameweek: gameweeks },
            include: [{ model: user_1.User, as: 'User' }],
        });
        const userMap = {};
        guesses.forEach((guess) => {
            if (guess.User) {
                if (!userMap[guess.userId]) {
                    userMap[guess.userId] = {
                        username: guess.User.username,
                        gameweekPoints: new Array(gameweeks.length).fill(0),
                        totalPoints: 0,
                    };
                }
                const gameweekIndex = gameweeks.indexOf(guess.gameweek);
                const points = guess.exact ? 3 : guess.correctDirection ? 2 : 0;
                if (gameweekIndex !== -1) {
                    userMap[guess.userId].gameweekPoints[gameweekIndex] = points;
                    userMap[guess.userId].totalPoints += points;
                }
            }
        });
        return Object.values(userMap);
    });
}
exports.default = router;
