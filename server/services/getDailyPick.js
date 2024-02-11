const historical = require('../data/historical');
const monsters = require('../data/monsters');

function getDailyPick(){
    console.log("Getting daily pick");
    return monsters[historical[historical.length - 1].pick];
}

module.exports = getDailyPick;