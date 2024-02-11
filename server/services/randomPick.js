const fs = require('fs');
const historical = require('../data/historical');
const monsters = require('../data/monsters');
const path = require('path');
const filePath = path.join(__dirname, '../data/historical.json');

function randomPick(){
    let now = new Date();
    now.setHours(now.getHours() + 1);
    historical.push({
        date: now,
        pick: Math.floor(Math.random() * monsters.length)
    })

    fs.writeFileSync(filePath, JSON.stringify(historical));

    return true;
}

module.exports = randomPick;