const { db } = require('./db');
const { getDailyPick } = require('./DailyPick');

const guessMonster = async (req, res) => {

    const { monster_id, number_try } = req.body;
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

                        let obj = {
                            correct: false,
                            date: dailyPick.date,
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
                        }

                        switch(number_try){
                            case 6:
                                db.query(
                                    `
                                    SELECT 
                                        s.icon_filename as image 
                                    FROM 
                                        skill s 
                                    INNER JOIN monster_skill ms ON ms.skill_id = s.id 
                                    WHERE ms.monster_id = ?
                                    ORDER BY RAND() 
                                    LIMIT 1
                                    `,
                                    [monster_id],
                                    (err, result) => {
                                        if(err){
                                            console.log(err);
                                            res.status(500).send("Internal server error");
                                        } else {
                                            obj.skill = result[0];
                                            res.status(200).json(obj);
                                        }
                                    }
                                )
                        }

                        // res.status(200).json()
                    }

                }
            }
        }
    )
}

module.exports = {
    guessMonster
}