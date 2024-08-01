const { db } = require('./db');
const { getDailyPick } = require('./DailyPick');
const Jimp = require('jimp');
const { getImage } = require('../Entity/Image');

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
                        indices: [],
                        try: number_try,
                        information: {
                            id_monster: monster.id,
                            name_monster: monster.name,
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
                            date: dailyPick.date,
                            image_monster: null
                        }
                    }

                    const { buffs, countBuff } = await new Promise((resolve, reject) => {
                        db.query(
                            `
                            SELECT b.id, b.name, b.image_filename
                            FROM monster_buff mb
                            INNER JOIN buff b ON mb.buff_id = b.id
                            WHERE mb.monster_id = ?
                            `,
                            [monster.id],
                            async (err, result) => {
                                if(err){
                                    console.log(err);
                                    resolve([]);
                                } else {
                                    
                                    let buffs = [];
                                    let count = dailyPick.buffs.length;

                                    for(let buff of result){
                                        if(dailyPick.buffs.includes(buff.id)){
                                            count--;
                                        }
                                        buffs.push({
                                            id: buff.id,
                                            name: buff.name,
                                            image_path: buff.image_filename
                                        });
                                    }

                                    resolve({
                                        buffs: buffs,
                                        countBuff: count
                                    });
                                }
                            }
                        )
                    });

                    const { debuffs, countDebuff } = await new Promise((resolve, reject) => {
                        db.query(
                            `
                            SELECT d.id, d.name, d.image_filename
                            FROM monster_debuff md
                            INNER JOIN debuff d ON md.debuff_id = d.id
                            WHERE md.monster_id = ?
                            `,
                            [monster.id],
                            async (err, result) => {
                                if(err){
                                    console.log(err);
                                    resolve([]);
                                } else {

                                    let debuffs = [];
                                    let count = dailyPick.debuffs.length;

                                    for(let debuff of result){
                                        if(dailyPick.debuffs.includes(debuff.id)){
                                            count--;
                                        }
                                        debuffs.push({
                                            id: debuff.id,
                                            name: debuff.name,
                                            image_path: debuff.image_filename
                                        });
                                    }

                                    resolve({
                                        debuffs: debuffs,
                                        countDebuff: count
                                    });
                                }
                            }
                        )
                    });

                    obj.information.buffs = buffs;

                    obj.information.debuffs = debuffs;

                    if(countBuff === 0 && dailyPick.buffs.length === buffs.length){
                        obj.information.buffs_good = true;
                        obj.information.buffs_partiel = false;
                    } else if(countBuff > 0 && countBuff < dailyPick.buffs.length){
                        obj.information.buffs_good = false;
                        obj.information.buffs_partiel = true;
                    } else {
                        obj.information.buffs_good = false;
                        obj.information.buffs_partiel = false;
                    }

                    if(countDebuff === 0 && dailyPick.debuffs.length === debuffs.length){
                        obj.information.debuffs_good = true;
                        obj.information.debuffs_partiel = false;
                    } else if(countDebuff !== dailyPick.debuffs.length){
                        obj.information.debuffs_good = false;
                        obj.information.debuffs_partiel = true;
                    } else {
                        obj.information.debuffs_good = false;
                        obj.information.debuffs_partiel = false;
                    }

                    const image_path = monster.image_filename;

                    obj.information.image_monster_path = image_path;

                    const indices = await generateIndices(dailyPick, number_try);

                    obj.indices = indices;

                    res.status(200).json(obj);

                }
            }
        }
    )
}

async function generateIndices(dailyPick, number_try){
    return new Promise(async (resolve, reject) => {
        let indices = [];

        if(number_try >= 6){
            try {
                let img = await getImage(dailyPick.indice_skill, "skills");
                indices.push({
                    id: 0,
                    img: img
                });
            } catch (error) {
                console.log("Error getting image for skill:", error);
            }
        } 

        if(number_try >= 12){
            try {
                const image = await Jimp.read("./asset/monsters/" + dailyPick.image_filename);
                const pixelSize = process.env.INDICE_2_PIXEL_SIZE;

                image.pixelate(pixelSize, (err, image) => {
                    image.getBase64(Jimp.AUTO, (err, base64) => {
                        indices.push(
                            {
                                id: 1,
                                img: base64
                            }
                        )
                    });
                });

            } catch (error) {
                console.log(error);
            }
        }
        
        resolve(indices);
    });
}

module.exports = {
    guessMonster
}