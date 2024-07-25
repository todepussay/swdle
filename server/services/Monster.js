const { db } = require('./db');
const { UserHasPermissionAdmin } = require('./User');
const { getSkillByMonsterId } = require('./Skill');
const { getImage, addImage, deleteImage } = require('./Image');
const { getBuffByMonsterId } = require('./Buff');
const { getDebuffByMonsterId } = require('./Debuff');
const Jimp = require('jimp');
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
    const token = req.headers.authorization.split(" ")[1];
    const search = req.query.search + "%";
    const minimumInformation = req.query.minimumInformation;
    const debuffAndBuff = req.query.debuffAndBuff;
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

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
}

async function addMonster(req, res){
    const token = req.headers.authorization.split(" ")[1];

    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

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


        const pathImage = await addImage(image, 'monsters');

        if(!pathImage){
            return res.json({
                success: false,
                cause: 'invalid_image',
                message: 'L\'image n\'est pas valide'
            });
        }

        db.query(
            `
            INSERT INTO monster (
                name,
                family_id,
                image_filename,
                element,
                archetype,
                base_stars,
                natural_stars,
                awaken_level,
                skill_ups_to_max,
                leader_skill,
                homunculus,
                farmable,
                fusion_food                
            ) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )
            `,
            [
                name,
                familyId,
                pathImage,
                element,
                type,
                baseStars,
                baseStars,
                awakened ? "2" : "1",
                skillUp,
                leaderSkill ? "1" : "0",
                homunculus ? "1" : "0",
                farmable ? "1" : "0",
                fusion ? "1" : "0"
            ],
            (err, result) => {
                if(err) throw err;

                res.json({
                    success: true,
                    message: 'Monster ajouté avec succès'
                })
            }
        )

    }
}

function getMonster(req, res){
    const token = req.headers.authorization.split(" ")[1];
    const id = req.params.id;
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {
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
}

async function deleteMonster(req, res){
    const token = req.headers.authorization.split(" ")[1];
    const id = req.params.id;

    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {
        db.query(
            `
            SELECT 
                COUNT(*) as skill_count
            FROM
                monster_skill
            WHERE
                monster_id = ?
            `,
            [id],
            (err, result) => {
                if(err) throw err;

                if(result[0].skill_count > 0){
                    return res.json({
                        success: false,
                        cause: 'skill_exists',
                        message: 'Le monstre possède des compétences'
                    });
                } else {
                    db.query(
                        `
                        SELECT 
                            image_filename
                        FROM
                            monster
                        WHERE
                            id = ?
                        `,
                        [id],
                        (err, result) => {
                            if(err) throw err;

                            let status = deleteImage(result[0].image_filename, "monsters");

                            if(!status){
                                return res.json({
                                    success: false,
                                    cause: 'image_not_deleted',
                                    message: 'L\'image n\'a pas pu être supprimée'
                                });
                            } else {
                                db.query(
                                    `
                                    DELETE FROM monster WHERE id = ?
                                    `,
                                    [id],
                                    (err, result) => {
                                        if(err) throw err;
    
                                        res.json({
                                            success: true,
                                            message: 'Monster supprimé avec succès'
                                        });
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }
}

async function updateMonster(req, res){
    const token = req.headers.authorization.split(" ")[1];
    const id = req.params.id;

    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

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

        db.query(
            `
            UPDATE monster SET
                name = ?,
                family_id = ?,
                element = ?,
                archetype = ?,
                base_stars = ?,
                natural_stars = ?,
                awaken_level = ?,
                skill_ups_to_max = ?,
                leader_skill = ?,
                homunculus = ?,
                farmable = ?,
                fusion_food = ?
            WHERE id = ?
            `,
            [
                name,
                familyId,
                element,
                type,
                baseStars,
                baseStars,
                awakened ? "2" : "1",
                skillUp,
                leaderSkill ? "1" : "0",
                homunculus ? "1" : "0",
                farmable ? "1" : "0",
                fusion ? "1" : "0",
                id
            ],
            (err, result) => {
                if(err) throw err;

                res.json({
                    success: true,
                    message: 'Monster modifié avec succès'
                })
            }
        )

    }
}

module.exports = {
    getAllMonsters,
    getMonsters,
    getMonstersByFamilyId,
    addMonster,
    deleteMonster,
    updateMonster,
    getMonster
}