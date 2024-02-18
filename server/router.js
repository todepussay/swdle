const express = require('express');
const router = express.Router();
const { getDailyPick } = require('./services/DailyPick');

router.get("/", (req, res) => {
    res.send(getDailyPick());
})

module.exports = router;