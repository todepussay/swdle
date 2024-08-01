const { db } = require('./db');

async function getMonstersForSearch(search){
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                m.id,
                m.name, 
                m.image_filename
            FROM monster m
            WHERE m.name LIKE ?
            `,
            [`${search}%`],
            async (err, result) => {
                if(err){
                    console.log(err);
                    reject({
                        success: false,
                        message: "Internal server error"
                    });
                } else {
                    let monsters = [];

                    for(let i = 0; i < result.length; i++){
                        monsters.push({
                            monster_id: result[i].id,
                            monster_name: result[i].name,
                            monster_image_path: result[i].image_filename
                        });
                    }

                    resolve({
                        success: true,
                        data: { monsters }
                    });
                }
            }
        )
    });
}

async function getFamiliesForSearch(search){
    return new Promise((resolve, reject) => {
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
            JOIN monster m ON m.family_id = f.id
            WHERE f.name LIKE ?
            ORDER BY FIELD(m.element, 'fire', 'water', 'wind', 'light', 'dark')
            `,
            [`${search}%`],
            async (err, result) => {
                if(err){
                    console.log(err);
                    reject({
                        success: false,
                        message: "Internal server error"
                    });
                } else {
                    let families = []

                    for(let i = 0; i < result.length; i++){
                        let family = families.find(f => f.family_id === result[i].family_id);

                        if(family){
                            family.monsters.push({
                                monster_id: result[i].monster_id,
                                monster_name: result[i].monster_name,
                                monster_image_path: result[i].monster_image,
                                monster_element: result[i].monster_element
                            });
                        } else {
                            families.push({
                                family_id: result[i].family_id,
                                family_name: result[i].family_name,
                                monsters: [{
                                    monster_id: result[i].monster_id,
                                    monster_name: result[i].monster_name,
                                    monster_image_path: result[i].monster_image,
                                    monster_element: result[i].monster_element
                                }]
                            });
                        }
                    }

                    resolve({
                        success: true,
                        data: { families }
                    });
                }
            }
        );
    });
}

async function search(req, res){
    try {
        const { search, searchMode } = req.query;

        const result = await (searchMode === "monsters" ? getMonstersForSearch(search) : getFamiliesForSearch(search));

        if(result.success){
            res.status(200).send(result.data);
        } else {
            res.status(500).send(result.message);
        }
    } catch(e){
        console.log(e);
        res.status(500).send("Internal server error");
    }
}

module.exports = { 
    search
};