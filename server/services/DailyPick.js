const { db } = require('./db');

let dailyPick = {
    date: null,
    daily_monster: null,
    daily_skill: null,
    daily_monster_image: null
};

const setDailyPick = () => {
    db.query(
        `SELECT * FROM history ORDER BY id DESC LIMIT 1`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            dailyPick.date = new Date(result[0].date);

            db.query("SELECT * FROM monster WHERE id = ?",
            [result[0].monster_daily_pick_id],
            (err, result1) => {
                if (err) {
                    console.log(err);
                } else {
                    dailyPick.daily_monster = result1[0];

                    db.query(`SELECT icon_filename as image FROM skill WHERE id = ?`, 
                    [result[0].monster_daily_pick_indice_skill], 
                    (err, result2) => {
                        if (err) {
                            console.log(err);
                        } else {
                            dailyPick.daily_monster.indice_skill = result2[0].image;
                            dailyPick.daily_monster.buffs = [];
                            dailyPick.daily_monster.debuffs = [];

                            db.query(
                                `
                                SELECT b.id
                                FROM monster_buff mb
                                INNER JOIN buff b ON mb.buff_id = b.id
                                WHERE mb.monster_id = ?
                                `,
                                [result[0].monster_daily_pick_id],
                                (err, result3) => {
                                    if(err){
                                        console.log(err);
                                    } else {
                                        result3.forEach(buff => {
                                            dailyPick.daily_monster.buffs.push(buff.id);
                                        });

                                        db.query(
                                            `
                                            SELECT d.id
                                            FROM monster_debuff md
                                            INNER JOIN debuff d ON md.debuff_id = d.id
                                            WHERE md.monster_id = ?
                                            `,
                                            [result[0].monster_daily_pick_id],
                                            (err, result4) => {
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    result4.forEach(debuff => {
                                                        dailyPick.daily_monster.debuffs.push(debuff.id);
                                                    });
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    })
                }
            });

            db.query("SELECT ms.monster_id as monster_id, s.icon_filename as image FROM skill s INNER JOIN monster_skill ms ON ms.skill_id = ? WHERE s.id = ?",
            [result[0].skill_daily_pick_id, result[0].monster_daily_pick_id],
            (err, result1) => {
                if (err) {
                    console.log(err);
                } else {
                    dailyPick.daily_skill = result1[0];
                }
            });

            db.query("SELECT id, image_filename as image FROM monster WHERE id = ?",
            [result[0].monster_image_daily_pick_id],
            (err, result1) => {
                if (err) {
                    console.log(err);
                } else {
                    dailyPick.daily_monster_image = result1[0];
                }
            });
        }
    });
}

const getDailyPick = () => {
    if(dailyPick.date === null || dailyPick.daily_monster === null || dailyPick.daily_skill === null || dailyPick.daily_monster_image === null){
        setDailyPick();
    }
    return dailyPick;
}

const verifyDaily = (req, res) => {
    res.status(200).send(dailyPick.date);
}

module.exports = {
    setDailyPick,
    getDailyPick,
    verifyDaily
};