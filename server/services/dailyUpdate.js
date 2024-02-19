const { db } = require('./db');
const { setDailyPick } = require('./DailyPick');

function dailyUpdate(){

    db.query("SELECT * FROM history ORDER BY id DESC LIMIT 1", 
    (err, result) => {
        if(err){
            console.log(err);
        } else {
            if(result.length === 0){
                insert({monster_daily_pick_id: null, skill_daily_pick_id: null, monster_image_daily_pick_id: null});
            } else if(new Date(result[0].date).getDate() !== new Date().getDate()){
                insert(result[0]);
            } else {
                console.log('Daily update already done');
            }
        }
    })

}

function insert(result){
    db.query(
        `INSERT INTO history (date, monster_daily_pick_id, skill_daily_pick_id, monster_image_daily_pick_id)
        SELECT 
            NOW(),
            (
                SELECT id
                FROM monster
                WHERE id != ${result.monster_daily_pick_id == null ? "0" : `(
                    SELECT monster_daily_pick_id
                    FROM history
                    ORDER BY id DESC
                    LIMIT 1
                )`}
                ORDER BY RAND()
                LIMIT 1
            ),
            (
                SELECT id
                FROM skill
                WHERE id != ${result.skill_daily_pick_id == null ? "0" : `(
                    SELECT skill_daily_pick_id
                    FROM history
                    ORDER BY id DESC
                    LIMIT 1
                )`}
                ORDER BY RAND()
                LIMIT 1
            ),
            (
                SELECT id
                FROM monster
                WHERE id != ${result.monster_image_daily_pick_id == null ? "0" : `(
                    SELECT monster_image_daily_pick_id
                    FROM history
                    ORDER BY id DESC
                    LIMIT 1
                )`}
                ORDER BY RAND()
                LIMIT 1
            );`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Daily update successful');
                setDailyPick();
            }
        }
    )
}

module.exports = { dailyUpdate };