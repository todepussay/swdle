const { db } = require('../services/db');
const { addImage, deleteImage } = require('../services/Image');

async function addSkill({ name, monsterId, slot, passive, pathImage }){
    return new Promise((resolve, reject) => {
        if(!pathImage){
            return reject({
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
                if(err) {
                    return reject({
                        success: false,
                        cause: 'db_error',
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
                                return reject({
                                    success: false,
                                    cause: 'db_error',
                                    message: 'Erreur lors de l\'ajout de la compétence'
                                });
                            } 
                            
                            return resolve({
                                success: true,
                                message: 'Compétence ajoutée'
                            });
                        }
                    )
                }
            }
        )
    });
}

async function deleteSkill(id){
    return new Promise((resolve, reject) => {
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
                        if(err){
                            return reject({
                                success: false,
                                message: 'Erreur lors de la suppression de la compétence'
                            });
                        } 
                        
                        return resolve({
                            success: true,
                            message: 'Compétence supprimée'
                        });
                    }
                )
            }
        )
    })
}

async function updateSkill(id, { name, monsterId, slot, passive, pathImage }){
    return new Promise((resolve, reject) => {
        db.query(
            `
            UPDATE skill
            SET name = ?, slot = ?, passive = ?
            WHERE id = ?
            `,
            [name, slot, passive, id],
            (err, result) => {
                if(err){
                    return reject({
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
                                    if(err){
                                        return reject({
                                            success: false,
                                            message: 'Erreur lors de la modification de la compétence'
                                        });
                                    }
                                    
                                    return resolve({
                                        success: true,
                                        message: 'Compétence modifiée'
                                    });
                                }
                            )
                        }
                    )
                }
            }
        )
    })
}

module.exports = {
    addSkill,
    deleteSkill,
    updateSkill
}