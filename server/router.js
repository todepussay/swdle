const express = require('express');
const router = express.Router();

const checkDay = require('./services/checkDay');
const getDailyPick = require('./services/getDailyPick');

router.get("/", (req, res) => {
    checkDay(req, res, () => {
        res.json(getDailyPick());
    });
})

module.exports = router;