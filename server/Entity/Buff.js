const { db } = require('../services/db');
const { addImage, deleteImage } = require('./Image');

async function addBuff({ name, image }){
    return new Promise(async (resolve, reject) => {
        const pathImage = await addImage(image, 'buffs');

        if(!pathImage){
            return reject({
                success: false,
                cause: 'invalid_image',
                message: 'L\'image n\'est pas valide'
            });
        }

        db.query(
            `
            INSERT INTO buff (name, image_filename) VALUES (?, ?)
            `,
            [name, pathImage],
            (err, result) => {
                if(err){
                    return reject({
                        success: false,
                        cause: 'db_error',
                        message: 'Erreur lors de l\'ajout de l\'effet de renforcement'
                    });
                }
                
                return resolve({
                    success: true,
                    message: 'Effet de renforcement ajouté'
                });
            }
        )
    })
}

async function deleteBuff(id){
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT
                COUNT(*) as monster_count
            FROM monster_buff
            WHERE buff_id = ?
            `,
            [id],
            (err, result) => {
                if(result[0].monster_count > 0){
                    return reject({
                        success: false,
                        message: 'Impossible de supprimer l\'effet de renforcement car il est utilisé par des monstres'
                    });
                } else {

                    db.query(
                        `
                        SELECT image_filename FROM buff WHERE id = ?
                        `,
                        [id],
                        (err, result) => {
                            if(err) throw err;

                            deleteImage(result[0].image_filename, 'buffs');

                            db.query(
                                `
                                DELETE FROM buff WHERE id = ?
                                `,
                                [id],
                                (err, result) => {
                                    if(err){
                                        return reject({
                                            success: false,
                                            message: 'Erreur lors de la suppression de l\'effet de renforcement'
                                        });
                                    }

                                    return resolve({
                                        success: true,
                                        message: 'Effet de renforcement supprimé'
                                    });
                                }
                            )
                        }
                    )

                }
            }
        )
    });
}

async function updateBuff(id, { name }){
    return new Promise((resolve, reject) => {
        db.query(
            `
            UPDATE buff SET name = ? WHERE id = ?
            `,
            [name, id],
            (err, result) => {
                if(err){
                    return reject({
                        success: false,
                        message: 'Erreur lors de la mise à jour de l\'effet de renforcement'
                    });
                } 
                
                return resolve({
                    success: true,
                    message: 'Effet de renforcement mis à jour'
                });
            }
        )
    })
}

module.exports = {
    addBuff,
    deleteBuff,
    updateBuff
}