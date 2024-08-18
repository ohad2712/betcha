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
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.get('/stats', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all guesses for the season
        const guesses = yield guess_1.Guess.findAll({
            include: ['User', 'Match'],
        });
        // Calculate overall stats
        const stats = guesses.reduce((acc, guess) => {
            const userId = guess.userId;
            if (!acc[userId]) {
                acc[userId] = { exactGuesses: 0, directionGuesses: 0, totalPoints: 0 };
            }
            const matchResult = guess.Match;
            const isExact = guess.homeGoals === matchResult.homeGoals && guess.awayGoals === matchResult.awayGoals;
            const isDirection = (guess.homeGoals - guess.awayGoals) === (matchResult.homeGoals - matchResult.awayGoals);
            if (isExact) {
                acc[userId].exactGuesses += 1;
                acc[userId].totalPoints += 3;
            }
            else if (isDirection) {
                acc[userId].directionGuesses += 1;
                acc[userId].totalPoints += 2;
            }
            return acc;
        }, {});
        res.json(stats);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch season stats' });
    }
}));
exports.default = router;
