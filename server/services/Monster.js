const { db } = require('./db');

const getMonsters = async (req, res) => {
    db.query(
        `
        SELECT 
            f.id as family_id,
            f.name as family_name,
            m.id as monster_id,
            m.name as monster_name,
            m.image_filename as monster_image,
            m.element as monster_element
        FROM 
            family f 
        JOIN monster m ON m.family_id = f.id;
        `,
        (err, result) => {
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
            } else {
                
                let monsters = [];

                result.forEach(monster => {
                    if(monsters.findIndex(family => family.family_id === monster.family_id) === -1){
                        monsters.push({
                            family_id: monster.family_id,
                            family_name: monster.family_name,
                            monsters: [
                                {
                                    monster_id: monster.monster_id,
                                    monster_name: monster.monster_name,
                                    monster_image: monster.monster_image,
                                    monster_element: monster.monster_element
                                }
                            ]
                        })
                    } else {
                        monsters.forEach(family => {
                            if(family.family_id === monster.family_id){
                                family.monsters.push({
                                    monster_id: monster.monster_id,
                                    monster_name: monster.monster_name,
                                    monster_image: monster.monster_image,
                                    monster_element: monster.monster_element
                                })
                            }
                        })
                    }
                })

                res.status(200).send(monsters);

            }
        }
    )
}

module.exports = {
    getMonsters
}