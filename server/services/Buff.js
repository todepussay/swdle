const { db } = require('./db');
const { UserHasPermissionAdmin } = require('./User');
const { addImage, getImage, deleteImage } = require('./Image');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

async function getBuffs(req, res) {
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
            SELECT COUNT(*) as total FROM buff WHERE name LIKE ?
            `,
            [search],
            async (err, result) => {
                if(err) throw err;
                let totalPage = Math.ceil(result[0].total / PaginationLimit);

                db.query(
                    `
                    SELECT 
                        b.id,
                        b.name,
                        b.image_filename,
                        COUNT(m.id) as monster_count
                    FROM buff b
                    LEFT JOIN monster_buff mb ON b.id = mb.buff_id
                    LEFT JOIN monster m ON mb.monster_id = m.id
                    WHERE b.name LIKE ?
                    GROUP BY b.id
                    LIMIT ? OFFSET ?
                    `,
                    [search, PaginationLimit, (page - 1) * PaginationLimit],
                    async (err, result) => {
                        if(err) throw err;

                        const buffs = await Promise.all(
                            result.map(async buff => {
                                return {
                                    ...buff,
                                    buff_image: await getImage(buff.image_filename, "buffs")
                                };
                            })
                        );

                        res.json({
                            success: true,
                            totalPage: totalPage,
                            data: buffs
                        });
                    }
                )
            }
        )
    }
}

async function addBuff(req, res) {
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
            image
        } = req.body;

        const pathImage = await addImage(image, 'buffs');

        if(!pathImage){
            return res.json({
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
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de l\'ajout de l\'effet de renforcement'
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'Effet de renforcement ajouté'
                    });
                }
            }
        )

    }
}

async function getBuff(req, res) {
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
                b.id,
                b.name,
                b.image_filename,
                COUNT(m.id) as monster_count
            FROM buff b
            LEFT JOIN monster_buff mb ON b.id = mb.buff_id
            LEFT JOIN monster m ON mb.monster_id = m.id
            WHERE b.id = ?
            `,
            [id],
            async (err, result) => {
                if(err) throw err;

                let buff = result[0];
                buff.image = await getImage(buff.image_filename, "buffs");

                res.json({
                    success: true,
                    data: buff
                });
            }
        )
    }
}

async function deleteBuff(req, res) {
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
                COUNT(*) as monster_count
            FROM monster_buff
            WHERE buff_id = ?
            `,
            [id],
            (err, result) => {
                if(err) throw err;

                if(result[0].monster_count > 0){
                    return res.json({
                        success: false,
                        message: 'Vous ne pouvez pas supprimer un effet qui appartient à un monstre'
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
                                    if(err) throw err;

                                    if(err){
                                        return res.json({
                                            success: false,
                                            message: 'Erreur lors de la suppression de l\'effet de renforcement'
                                        });
                                    } else {
                                        return res.json({
                                            success: true,
                                            message: 'Effet de renforcement supprimé'
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

function updateBuff(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const id = req.params.id;
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

        const { name } = req.body;

        db.query(
            `
            UPDATE buff SET name = ? WHERE id = ?
            `,
            [name, id],
            (err, result) => {
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de la mise à jour de l\'effet de renforcement'
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'Effet de renforcement mis à jour'
                    });
                }
            }
        )

    }
}

async function getBuffByMonsterId(id) {
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                b.id
            FROM buff b
            LEFT JOIN monster_buff mb ON b.id = mb.buff_id
            WHERE mb.monster_id = ?
            `,
            [id],
            (err, result) => {
                if(err) reject(err);

                resolve(
                    result.map(buff => buff.id)
                );
            }
        )
    })
}

module.exports = {
    getBuffs,
    addBuff,
    getBuff,
    deleteBuff,
    updateBuff,
    getBuffByMonsterId
}