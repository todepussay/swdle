const { db } = require('../services/db');
const { addImage, deleteImage } = require('../services/Image');

async function addDebuff({ name, image }){
    return new Promise(async (resolve, reject) => {
        const pathImage = await addImage(image, 'debuffs');

        if(!pathImage){
            return reject({
                success: false,
                cause: 'invalid_image',
                message: 'L\'image n\'est pas valide'
            });
        }

        db.query(
            `
            INSERT INTO debuff (name, image_filename) VALUES (?, ?)
            `,
            [name, pathImage],
            (err, result) => {
                if(err){
                    return reject({
                        success: false,
                        cause: 'db_error',
                        message: 'Erreur lors de l\'ajout de l\'effet nocif'
                    });
                } else {
                    return resolve({
                        success: true,
                        message: 'Effet nocif ajouté'
                    });
                }
            }
        )
    });
}

async function deleteDebuff(id){
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT
                COUNT(*) as monster_count
            FROM monster_debuff
            WHERE debuff_id = ?
            `,
            [id],
            (err, result) => {
                if(result[0].monster_count > 0){
                    return reject({
                        success: false,
                        message: 'Impossible de supprimer l\'effet nocif car il est utilisé par des monstres'
                    });
                } else {
    
                    db.query(
                        `
                        SELECT image_filename FROM debuff WHERE id = ?
                        `,
                        [id],
                        (err, result) => {
                            let status = deleteImage(result[0].image_filename, 'debuffs');

                            if(!status){
                                return reject({
                                    success: false,
                                    cause: 'image_not_deleted',
                                    message: 'L\'image n\'a pas pu être supprimée'
                                });
                            }
    
                            db.query(
                                `
                                DELETE FROM debuff WHERE id = ?
                                `,
                                [id],
                                (err, result) => {
                                    if(err){
                                        return reject({
                                            success: false,
                                            message: 'Erreur lors de la suppression de l\'effet nocif'
                                        });
                                    } else {
                                        return resolve({
                                            success: true,
                                            message: 'Effet nocif supprimé'
                                        });
                                    }
                                }
                            )
                        }
                    )
    
                }
            }
        )
    });
}

async function updateDebuff({ id, name, image }){
    return new Promise(async (resolve, reject) => {
        db.query(
            `
            UPDATE debuff SET name = ? WHERE id = ?
            `,
            [name, id],
            (err, result) => {
                if(err){
                    return reject({
                        success: false,
                        message: 'Erreur lors de la modification de l\'effet nocif'
                    });
                } else {
                    return resolve({
                        success: true,
                        message: 'Effet nocif mis à jour'
                    });
                }
            }
        )
    });
}

module.exports = {
    addDebuff,
    deleteDebuff,
    updateDebuff
}