const { db } = require('./db');
const { getDailyPick } = require('./DailyPick');

const guessMonster = async (req, res) => {
    const { monster_id } = req.body;
    const dailyPick = getDailyPick().daily_monster;

    db.query(
        `
        SELECT * 
        FROM monster
        WHERE id = ?
        `,
        [monster_id],
        (err, result) => {
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
            } else {
                if(result.length === 0){
                    res.status(400).send("Monster not found");
                    return;
                } else {

                    const monster = result[0];

                    if(monster.id === dailyPick.id){
                        res.status(200).json({
                            correct: true
                        });
                    } else {
                        res.status(200).json({
                            correct: false,
                            information: {
                                natural_stars: monster.natural_stars === dailyPick.natural_stars,
                                natural_stars_more: monster.natural_stars < dailyPick.natural_stars,
                                natural_stars_less: monster.natural_stars > dailyPick.natural_stars,
                                second_awakened: monster.awaken_level === dailyPick.awaken_level,
                                element: monster.element === dailyPick.element,
                                archetype: monster.archetype === dailyPick.archetype,
                                family: monster.family_id === dailyPick.family_id,
                                leader_skill: monster.leader_skill === dailyPick.leader_skill,
                                fusion_food: monster.fusion_food === dailyPick.fusion_food
                            }
                        })
                    }

                }
            }
        }
    )
}

module.exports = {
    guessMonster
}