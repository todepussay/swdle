const { db } = require('./db');
const { getDailyPick } = require('./DailyPick');
const Jimp = require('jimp');

const guessMonster = async (req, res) => {

    const { monster_id, number_try } = req.body;
    const dailyPick = getDailyPick().daily_monster;

    db.query(
        `
        SELECT m.*, f.name as family
        FROM monster m
        INNER JOIN family f ON m.family_id = f.id
        WHERE m.id = ?
        `,
        [monster_id],
        async (err, result) => {
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
            } else {
                if(result.length === 0){
                    res.status(400).send("Monster not found");
                    return;
                } else {

                    const monster = result[0];

                    let obj = {
                        correct: monster.id === dailyPick.id ? true : false,
                        date: dailyPick.date,
                        indice: {},
                        try: number_try,
                        information: {
                            id_monster: monster.id,
                            name_monster: monster.name,
                            image_monster: monster.image_filename,
                            natural_stars_monster: monster.natural_stars,
                            natural_stars_good: monster.natural_stars === dailyPick.natural_stars,
                            natural_stars_more: monster.natural_stars < dailyPick.natural_stars,
                            natural_stars_less: monster.natural_stars > dailyPick.natural_stars,
                            second_awakened_monster: monster.awaken_level == 1 ? false : true,
                            second_awakened_good: monster.awaken_level == dailyPick.awaken_level,
                            element_monster: monster.element,
                            element_good: monster.element === dailyPick.element,
                            archetype_monster: monster.archetype,
                            archetype_good: monster.archetype === dailyPick.archetype,
                            family_monster_id: monster.family_id,
                            family_monster_name: monster.family,
                            family_good: monster.family_id === dailyPick.family_id,
                            leader_skill_monster: monster.leader_skill === 1 ? true : false,
                            leader_skill_good: monster.leader_skill === dailyPick.leader_skill,
                            fusion_food_monster: monster.fusion_food === 1 ? true : false,
                            fusion_food_good: monster.fusion_food === dailyPick.fusion_food,
                            date: dailyPick.date
                        }
                    }

                    if(number_try >= 6){
                        obj.indice["indice1"] = dailyPick.indice_skill;
                    } 

                    if(number_try >= 12){
                        try {
                            const image = await Jimp.read("./asset/monsters/" + dailyPick.image_filename);
                            const pixelSize = process.env.INDICE_2_PIXEL_SIZE;

                            image.pixelate(pixelSize, (err, image) => {
                                image.getBase64(Jimp.AUTO, (err, base64) => {
                                    obj.indice["indice2"] = base64;
                                });
                            });

                        } catch (error) {
                            console.log(error);
                        }

                    }

                    res.status(200).json(obj);

                }
            }
        }
    )
}

module.exports = {
    guessMonster
}