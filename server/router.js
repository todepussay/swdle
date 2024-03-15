const express = require('express');
const router = express.Router();
const { verifyDaily } = require('./services/DailyPick');
const { getMonsters } = require('./services/Monster');
const { guessMonster } = require('./services/GuessMonster');

router.get("/getAllMonsters", getMonsters);

router.post("/guessMonster", guessMonster);

router.get("/verifyDaily", verifyDaily);

module.exports = router;