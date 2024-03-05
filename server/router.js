const express = require('express');
const router = express.Router();
const { getDailyPick } = require('./services/DailyPick'); // A supprimer
const { verifyDaily } = require('./services/DailyPick');
const { getMonsters } = require('./services/Monster');
const { guessMonster } = require('./services/GuessMonster');

router.get("/getAllMonsters", getMonsters);

router.post("/guessMonster", guessMonster);

router.get("/verifyDaily", verifyDaily);

router.get("/getDailyPick", (req, res) => {
    const dailyPick = getDailyPick();
    res.status(200).send(dailyPick);
});

module.exports = router;