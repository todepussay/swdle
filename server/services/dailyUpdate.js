const { db } = require('./db');
const { setDailyPick } = require('./DailyPick');

function dailyUpdate(){
    
    db.query(
        `INSERT INTO history (date, monster_daily_pick_id, skill_daily_pick_id, monster_image_daily_pick_id)
        SELECT 
            NOW(),
            (
                SELECT id
                FROM monster
                WHERE id != (
                    SELECT monster_daily_pick_id
                    FROM history
                    ORDER BY id DESC
                    LIMIT 1
                )
                ORDER BY RAND()
                LIMIT 1
            ),
            (
                SELECT id
                FROM skill
                WHERE id != (
                    SELECT skill_daily_pick_id
                    FROM history
                    ORDER BY id DESC
                    LIMIT 1
                )
                ORDER BY RAND()
                LIMIT 1
            ),
            (
                SELECT id
                FROM monster
                WHERE id != (
                    SELECT monster_image_daily_pick_id
                    FROM history
                    ORDER BY id DESC
                    LIMIT 1
                )
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

// `date` datetime,
//     `monster_daily_pick_id` int,
//     `skill_daily_pick_id` int,
//     `monster_image_daily_pick_id` int,