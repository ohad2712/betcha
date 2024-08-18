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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const match_1 = require("../models/match");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
const API_KEY = process.env.FOOTBALL_API_KEY;
const API_URL = 'https://v3.football.api-sports.io';
router.get('/upcoming', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the next gameweek is already cached
        const cachedMatches = yield match_1.Match.findOne({ where: { gameweek: req.query.gameweek } });
        if (cachedMatches) {
            return res.json(cachedMatches);
        }
        // Fetch upcoming matches from the API
        const response = yield axios_1.default.get(`${API_URL}/fixtures`, {
            params: {
                league: '39', // Premier League
                season: '2024',
                next: '10', // Fetch the next 10 matches for the upcoming gameweek
            },
            headers: {
                'x-apisports-key': API_KEY,
            },
        });
        const matches = response.data.response;
        // Save matches to the database
        const newMatch = yield match_1.Match.create({ gameweek: req.query.gameweek, matches });
        res.json(newMatch);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch upcoming matches' });
    }
}));
exports.default = router;
