const { db } = require('../services/db');

function addFamily({ name }){
    return new Promise((resolve, reject) => {
        db.query(
            `
            INSERT INTO family (name) VALUES (?)
            `,
            [name],
            (err, result) => {
                
                if(err){
                    return reject({
                        success: false,
                        message: 'Erreur lors de l\'ajout de la famille'
                    });
                }

                return resolve({
                    success: true,
                    message: 'Famille ajoutée',
                    id: result.insertId
                });
            }
        )
    });
}

function deleteFamily(id){
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                COUNT(*) as monster_count
            FROM
                monster
            WHERE
                family_id = ?
            `,
            [id],
            (err, result) => {
                if(err) throw err;

                if(result[0].monster_count > 0){
                    return reject({
                        success: false,
                        message: 'Impossible de supprimer la famille car elle contient des monstres'
                    });
                } else {

                    db.query(
                        `
                        DELETE FROM family WHERE id = ?
                        `,
                        [id],
                        (err, result) => {
                            if(err){
                                return reject({
                                    success: false,
                                    message: 'Erreur lors de la suppression de la famille'
                                });
                            }

                            return resolve({
                                success: true,
                                message: 'Famille supprimée'
                            });
                        }
                    )

                }
            }
        )
    });
}

function updateFamily(id, { name }){
    return new Promise((resolve, reject) => {
        db.query(
            `
            UPDATE family SET name = ? WHERE id = ?
            `,
            [name, id],
            (err, result) => {
                if(err){
                    return reject({
                        success: false,
                        message: 'Erreur lors de la modification de la famille'
                    });
                }

                return resolve({
                    success: true,
                    message: 'Famille modifiée'
                });
            }
        )
    });
}

module.exports = {
    addFamily,
    deleteFamily,
    updateFamily
}