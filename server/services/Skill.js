const { db } = require('./db');
const Jimp = require('jimp');
const { getImage, addImage, deleteImage } = require('./Image');
const { UserHasPermissionAdmin } = require('./User');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

async function getSkillByMonsterId(monsterId) {
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT
                s.id,
                s.name,
                s.icon_filename
            FROM skill s
            JOIN monster_skill ms ON s.id = ms.skill_id
            WHERE ms.monster_id = ?
            ORDER BY s.slot ASC
            `,
            [monsterId],
            async (err, result) => {
                if (err) reject(err);

                const skills = await Promise.all(
                    result.map(async skill => {
                        return {
                            ...skill,
                            image: await getImage(skill.icon_filename, "skills")
                        }
                    })
                )

                resolve(skills);
            }
        );
    });
}

async function getSkills(req, res){
    const page = req.query.page;
    const token = req.headers.authorization.split(" ")[1];
    const search = req.query.search + "%";
    
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
                COUNT(*) as total
            FROM skill s
            LEFT JOIN monster_skill ms ON s.id = ms.skill_id
            LEFT JOIN monster m ON ms.monster_id = m.id
            WHERE m.name LIKE ?
            `,
            [search],
            (err, result) => {
                if(err) throw err;
                let totalPage = Math.ceil(result[0].total / PaginationLimit);

                db.query(
                    `
                    SELECT
                        s.id,
                        s.name,
                        s.slot,
                        s.passive,
                        s.icon_filename,
                        m.id AS monster_id,
                        m.name AS monster_name,
                        m.image_filename AS monster_image_pathname
                    FROM skill s
                    LEFT JOIN monster_skill ms ON s.id = ms.skill_id
                    LEFT JOIN monster m ON ms.monster_id = m.id
                    WHERE m.name LIKE ?
                    ORDER BY m.natural_stars ASC, m.name ASC, s.slot ASC
                    LIMIT ? OFFSET ?
                    `,
                    [search, PaginationLimit, (page - 1) * PaginationLimit],
                    async (err, result) => {
                        if(err) throw err;

                        const skills = await Promise.all(
                            result.map(async skill => {
                                return {
                                    ...skill,
                                    monster_image: await getImage(skill.monster_image_pathname, "monsters"),
                                    skill_image: await getImage(skill.icon_filename, "skills")
                                }
                            })
                        );
        
                        res.json({
                            success: true,
                            totalPage: totalPage,
                            data: skills
                        });
        
                    }
                )
            }
        )
    }
}

function getSkill(req, res){
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
                s.id,
                s.name,
                s.slot,
                s.passive,
                s.icon_filename,
                m.id AS monster_id,
                m.name AS monster_name,
                m.image_filename AS monster_image_pathname
            FROM skill s
            LEFT JOIN monster_skill ms ON s.id = ms.skill_id
            LEFT JOIN monster m ON ms.monster_id = m.id
            WHERE s.id = ?
            ORDER BY m.natural_stars ASC, m.name ASC, s.slot ASC
            `,
            [id],
            (err, result) => {
                if(err) throw err;

                if(result.length === 0){
                    return res.json({
                        success: false,
                        message: 'Compétence introuvable'
                    });
                }

                const skill = {
                    ...result[0],
                    monster_image: getImage(result[0].monster_image_pathname, "monsters"),
                    skill_image: getImage(result[0].icon_filename, "skills")
                }

                res.json({
                    success: true,
                    data: skill
                });
            }
        )
    }

}

async function addSkill(req, res){
    const token = req.headers.authorization.split(" ")[1];
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {
        const { name, monsterId, slot, passive, image } = req.body;

        const pathImage = await addImage(image, 'skills');

        if(!pathImage){
            return res.json({
                success: false,
                cause: 'invalid_image',
                message: 'L\'image n\'est pas valide'
            });
        }

        db.query(
            `
            INSERT INTO skill (name, slot, passive, icon_filename) VALUES (?, ?, ?, ?)
            `,
            [name, slot, passive, pathImage],
            (err, result) => {
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de l\'ajout de la compétence'
                    });
                } else {
                    db.query(
                        `
                        INSERT INTO monster_skill (monster_id, skill_id) VALUES (?, ?)
                        `,
                        [monsterId, result.insertId],
                        (err, result) => {
                            if(err) throw err;

                            if(err){
                                return res.json({
                                    success: false,
                                    message: 'Erreur lors de l\'ajout de la compétence au monstre'
                                });
                            } else {
                                return res.json({
                                    success: true,
                                    message: 'Compétence ajoutée'
                                });
                            }
                        }
                    )
                }
            }
        )
    }

}

function deleteSkill(req, res){
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
            DELETE FROM monster_skill WHERE skill_id = ?
            `,
            [id],
            (err, result) => {
                if(err) throw err;
                
                db.query(
                    `
                    DELETE FROM skill WHERE id = ?
                    `,
                    [id],
                    (err, result) => {
                        if(err) throw err;

                        if(err){
                            return res.json({
                                success: false,
                                message: 'Erreur lors de la suppression de la compétence'
                            });
                        } else {
                            return res.json({
                                success: true,
                                message: 'Compétence supprimée'
                            });
                        }
                    }
                )
            }
        )
    }

}

function updateSkill(req, res){
    const token = req.headers.authorization.split(" ")[1];
    const id = req.params.id;
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {
        const { name, monsterId, slot, passive } = req.body;

        db.query(
            `
            UPDATE skill
            SET name = ?, slot = ?, passive = ?
            WHERE id = ?
            `,
            [name, slot, passive, id],
            (err, result) => {
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de la modification de la compétence'
                    });
                } else {
                    db.query(
                        `
                        DELETE FROM monster_skill WHERE skill_id = ?
                        `,
                        [id],
                        (err, result) => {
                            if(err) throw err;

                            db.query(
                                `
                                INSERT INTO monster_skill (monster_id, skill_id) VALUES (?, ?)
                                `,
                                [monsterId, id],
                                (err, result) => {
                                    if(err) throw err;

                                    if(err){
                                        return res.json({
                                            success: false,
                                            message: 'Erreur lors de la modification de la compétence'
                                        });
                                    } else {
                                        return res.json({
                                            success: true,
                                            message: 'Compétence modifiée'
                                        });
                                    }
                                }
                            )
                        }
                    )
                }
            }
        )
    }

}

module.exports = {
    getSkillByMonsterId,
    getSkills,
    getSkill,
    addSkill,
    deleteSkill,
    updateSkill
}