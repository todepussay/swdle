const historical = require('../data/historical');
const randomPick = require('./randomPick');

async function checkDay(req, res, next) {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    if(historical.length === 0) {
        await randomPick();
    } else {
        const lastPick = new Date(historical[historical.length - 1].date);
        lastPick.setHours(lastPick.getHours() + 1);
        if (now.getDate() !== lastPick.getDate()) {
            await randomPick();
        }
    }
    
    next();
}

module.exports = checkDay;