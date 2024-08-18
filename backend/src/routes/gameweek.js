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
router.get('/stats', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameweek = Array.isArray(req.query.gameweek) ? req.query.gameweek[0] : req.query.gameweek;
        if (!gameweek || typeof gameweek !== 'string') {
            return res.status(400).json({ error: 'Invalid gameweek parameter' });
        }
        const guesses = yield guess_1.Guess.findAll({
            where: { gameweek },
            include: [{ model: user_1.User, as: 'User' }],
        });
        const stats = {};
        for (const guess of guesses) {
            const userId = guess.userId;
            if (!stats[userId]) {
                stats[userId] = { exactGuesses: 0, directionGuesses: 0, totalPoints: 0 };
            }
            const matchResult = guess.Match;
            if (!matchResult)
                continue;
            const isExact = guess.homeGoals === matchResult.homeGoals && guess.awayGoals === matchResult.awayGoals;
            const isDirection = (guess.homeGoals - guess.awayGoals) === (matchResult.homeGoals - matchResult.awayGoals);
            if (isExact) {
                stats[userId].exactGuesses += 1;
                stats[userId].totalPoints += 3;
            }
            else if (isDirection) {
                stats[userId].directionGuesses += 1;
                stats[userId].totalPoints += 2;
            }
        }
        res.json(stats);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch gameweek stats' });
    }
}));
router.get('/current', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentGameweek = 'current_gameweek'; // This should be dynamic in a real application
        const guesses = yield guess_1.Guess.findAll({
            where: { gameweek: currentGameweek },
            include: [{ model: user_1.User, as: 'User' }],
        });
        const stats = {};
        for (const guess of guesses) {
            const userId = guess.userId;
            if (!stats[userId]) {
                // Ensure that guess.User is defined before accessing properties
                const username = guess.User ? guess.User.username : 'Unknown User'; // Fallback username
                stats[userId] = {
                    username,
                    exactGuesses: 0,
                    directionGuesses: 0,
                    totalPoints: 0,
                };
            }
            if (guess.exact) {
                stats[userId].exactGuesses += 1;
                stats[userId].totalPoints += 3;
            }
            else if (guess.correctDirection) {
                stats[userId].directionGuesses += 1;
                stats[userId].totalPoints += 2;
            }
        }
        const result = Object.values(stats).sort((a, b) => b.totalPoints - a.totalPoints);
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching current gameweek stats:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
exports.default = router;
