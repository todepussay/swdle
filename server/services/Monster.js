const { db } = require('./db');
const { getSkillByMonsterId } = require('./Skill');
const { getImage } = require('./Image');
const { getBuffByMonsterId } = require('./Buff');
const { getDebuffByMonsterId } = require('./Debuff');
const { addMonster, deleteMonster, updateMonster } = require('../Entity/Monster');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

const getAllMonsters = async (req, res) => {
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
        ORDER BY FIELD(m.element, 'fire', 'water', 'wind', 'light', 'dark')
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

function getMonstersByFamilyId(familyId){
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                m.id as monster_id,
                m.name as monster_name,
                m.image_filename as monster_image,
                m.element as monster_element
            FROM monster m
            WHERE m.family_id = ?
            ORDER BY FIELD(m.element, 'fire', 'water', 'wind', 'light', 'dark')
            `,
            [familyId],
            async (err, result) => {
                if(err) reject(err);

                const monsters = await Promise.all(
                    result.map(async monster => {
                        return {
                            ...monster,
                            image: await getImage(monster.monster_image, "monsters")
                        }
                    })
                )

                resolve(monsters);
            }
        )
    })
}

async function getMonsters(req, res){
    const page = req.query.page;
    const search = req.query.search + "%";
    const minimumInformation = req.query.minimumInformation;
    const debuffAndBuff = req.query.debuffAndBuff;

    if(minimumInformation){
        db.query(
            `
            SELECT
                m.id,
                m.name,
                count(s.id) as skill_count
            FROM monster m
            LEFT JOIN monster_skill ms ON m.id = ms.monster_id
            LEFT JOIN skill s ON ms.skill_id = s.id
            GROUP BY m.id
            `,
            async (err, result) => {
                if(err) throw err;

                let monsters = await Promise.all(
                    result.map(async monster => {
                        if(monster.buff_count > 0){
                            monster.buffs = await getBuffByMonsterId(monster.id);
                        }
                        if(monster.debuff_count > 0){
                            monster.debuffs = await getDebuffByMonsterId(monster.id);
                        }
                        return monster;
                    })
                )

                return res.json({
                    success: true,
                    data: monsters
                });
            }
        )
    } else if(debuffAndBuff){
        db.query(
            `
            SELECT
                m.id,
                m.name,
                m.family_id,
                m.element,
                f.name as family_name,
                count(s.id) as skill_count,
                count(b.id) as buff_count,
                count(d.id) as debuff_count
            FROM monster m
            LEFT JOIN monster_skill ms ON m.id = ms.monster_id
            LEFT JOIN skill s ON ms.skill_id = s.id
            LEFT JOIN family f ON m.family_id = f.id
            LEFT JOIN monster_buff mb ON m.id = mb.monster_id
            LEFT JOIN buff b ON mb.buff_id = b.id
            LEFT JOIN monster_debuff md ON m.id = md.monster_id
            LEFT JOIN debuff d ON md.debuff_id = d.id
            GROUP BY m.id
            `,
            async (err, result) => {
                if(err) throw err;

                let monsters = await Promise.all(
                    result.map(async monster => {
                        if(monster.buff_count > 0){
                            monster.buffs = await getBuffByMonsterId(monster.id);
                        }
                        if(monster.debuff_count > 0){
                            monster.debuffs = await getDebuffByMonsterId(monster.id);
                        }
                        return monster;
                    })
                )

                return res.json({
                    success: true,
                    data: monsters
                });
            }
        )
    } else {
        db.query(
            `
            SELECT COUNT(*) as total FROM monster WHERE name LIKE ?
            `,
            [search],
            (err, result) => {
                if(err) throw err;
                let totalPage = Math.ceil(result[0].total / PaginationLimit);

                db.query(
                    `
                    SELECT
                        m.id,
                        m.name,
                        m.family_id,
                        f.name as family_name,
                        m.image_filename,
                        m.element,
                        m.archetype,
                        m.natural_stars,
                        m.awaken_level,
                        m.leader_skill,
                        m.homunculus,
                        m.fusion_food
                    FROM monster m
                    JOIN family f ON m.family_id = f.id
                    WHERE m.name LIKE ?
                    ORDER BY f.id ASC, FIELD(m.element, 'fire', 'water', 'wind', 'light', 'dark')
                    LIMIT ? OFFSET ?
                    `,
                    [search, PaginationLimit, (page - 1) * PaginationLimit],
                    async (err, result) => {
                        if(err) throw err;

                        const monstersImage = await Promise.all(
                            result.map(async monster => {
                                return {
                                    ...monster,
                                    image: await getImage(monster.image_filename, "monsters")
                                }
                            })
                        )

                        const monsters = await Promise.all(
                            monstersImage.map(async monster => {
                                const skills = await getSkillByMonsterId(monster.id);
                                return {
                                    ...monster,
                                    skills
                                };
                            })
                        );
                    
                        res.json({
                            success: true,
                            totalPage: totalPage,
                            data: monsters
                        });
                    
                    }
                )
            }
        )
    }
}

async function addMonsterService(req, res){
    try {
        const { 
            name,
            familyId,
            baseStars,
            element,
            type,
            skillUp,
            awakened,
            leaderSkill,
            homunculus,
            farmable,
            fusion,
            image
        } = req.body;

        const result = await addMonster({
            name,
            familyId,
            baseStars,
            element,
            type,
            skillUp,
            awakened,
            leaderSkill,
            homunculus,
            farmable,
            fusion,
            image
        });

        res.json(result);

    } catch(err) {
        return res.json({
            success: false,
            message: 'Erreur lors de l\'ajout du monstre'
        });
    }
}

function getMonster(req, res){
    const id = req.params.id;
    
    db.query(
        `
        SELECT 
            m.id,
            m.name,
            m.family_id,
            m.image_filename,
            m.element,
            m.archetype,
            m.natural_stars,
            m.awaken_level,
            m.skill_ups_to_max,
            m.leader_skill,
            m.homunculus,
            m.farmable,
            m.fusion_food,
            count(s.id) as skill_count,
            f.name as family_name
        FROM monster m
        LEFT JOIN 
            monster_skill ms ON m.id = ms.monster_id
        LEFT JOIN
            skill s ON ms.skill_id = s.id
        LEFT JOIN
            family f ON m.family_id = f.id
        GROUP BY 
            m.id
        HAVING
            m.id = ?                
        `,
        [id],
        async (err, result) => {
            if(err) throw err;

            const monster = result[0];
            const skills = await getSkillByMonsterId(monster.id);
            const image = await getImage(monster.image_filename, "monsters");

            res.json({
                success: true,
                data: {
                    ...monster,
                    skills,
                    image
                }
            });
        }


    )
}

async function deleteMonsterService(req, res){
    try {
        const id = req.params.id;

        const result = await deleteMonster(id);

        res.json(result);
    } catch(err){
        res.json({
            success: false,
            message: 'Erreur lors de la suppression du monstre'
        });
    }   
}

async function updateMonsterService(req, res){
    try {
        const id = req.params.id;
        const { 
            name,
            familyId,
            baseStars,
            element,
            type,
            skillUp,
            awakened,
            leaderSkill,
            homunculus,
            farmable,
            fusion
        } = req.body;

        const result = await updateMonster(id, {
            name,
            familyId,
            baseStars,
            element,
            type,
            skillUp,
            awakened,
            leaderSkill,
            homunculus,
            farmable,
            fusion
        });

        res.json(result);
    } catch(err){
        res.json({
            success: false,
            message: 'Erreur lors de la mise à jour du monstre'
        });
    }
}

module.exports = {
    getAllMonsters,
    getMonsters,
    getMonstersByFamilyId,
    addMonsterService,
    deleteMonsterService,
    updateMonsterService,
    getMonster
}