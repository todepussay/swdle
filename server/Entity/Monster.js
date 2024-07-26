const { db } = require('../services/db');
const { addImage, deleteImage } = require('../services/Image');
const { deleteSkill } = require('../Entity/Skill');

async function addMonster({
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
}){
    return new Promise(async (resolve, reject) => {
        const pathImage = await addImage(image, 'monsters');

        if(!pathImage){
            return reject({
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
                if(err) {
                    return reject({
                        success: false,
                        message: 'Erreur lors de l\'ajout du monstre'
                    });
                }

                resolve({
                    success: true,
                    message: 'Monstre ajouté avec succès'
                });
            }
        )
    });
}

async function deleteMonster(id){
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                skill_id
            FROM
                monster_skill
            WHERE
                monster_id = ?
            `,
            [id],
            async (err, result) => {
                if(result.length > 0){
                    await Promise.all(
                        result.map(async skill => {
                            await deleteSkill(skill.skill_id);
                        })
                    );
                }
                
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
                        let status = deleteImage(result[0].image_filename, "monsters");
    
                        if(!status){
                            return reject({
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
                                    if(err) {
                                        return reject({
                                            success: false,
                                            message: 'Erreur lors de la suppression du monstre'
                                        });
                                    }
    
                                    resolve({
                                        success: true,
                                        message: 'Monstre supprimé avec succès'
                                    });
                                }
                            )
                        }
                    }
                )
            }
        )
    })
}

async function updateMonster(id, {
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
}){
    return new Promise((resolve, reject) => {
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
                if(err) {
                    return reject({
                        success: false,
                        message: 'Erreur lors de la modification du monstre'
                    });
                }

                resolve({
                    success: true,
                    message: 'Monstre modifié avec succès'
                });
            }
        )
    });
}

module.exports = {
    addMonster, 
    deleteMonster,
    updateMonster
}