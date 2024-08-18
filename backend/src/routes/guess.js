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
router.post('/:matchId', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { matchId } = req.params;
    const { homeGoals, awayGoals } = req.body;
    // Check if req.user is defined
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (userId === undefined) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        // Save the guess in the database
        const guess = yield guess_1.Guess.create({
            userId,
            matchId: Number(matchId), // Ensure matchId is a number
            homeGoals,
            awayGoals,
        });
        res.status(201).json(guess);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save guess' });
    }
}));
exports.default = router;
