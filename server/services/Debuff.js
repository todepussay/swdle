const { db } = require('./db');
const { UserHasPermissionAdmin } = require('./User');
const { addImage, getImage, deleteImage } = require('./Image');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

async function getDebuffs(req, res) {
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
            SELECT COUNT(*) as total FROM debuff WHERE name LIKE ?
            `,
            [search],
            async (err, result) => {
                if(err) throw err;
                let totalPage = Math.ceil(result[0].total / PaginationLimit);

                db.query(
                    `
                    SELECT 
                        d.id,
                        d.name,
                        d.image_filename,
                        COUNT(m.id) as monster_count
                    FROM debuff d
                    LEFT JOIN monster_debuff md ON d.id = md.debuff_id
                    LEFT JOIN monster m ON md.monster_id = m.id
                    WHERE d.name LIKE ?
                    GROUP BY d.id
                    LIMIT ? OFFSET ?
                    `,
                    [search, PaginationLimit, (page - 1) * PaginationLimit],
                    async (err, result) => {
                        if(err) throw err;

                        const debuffs = await Promise.all(
                            result.map(async debuff => {
                                return {
                                    ...debuff,
                                    debuff_image: await getImage(debuff.image_filename, "debuffs")
                                };
                            })
                        );

                        res.json({
                            success: true,
                            totalPage: totalPage,
                            data: debuffs
                        });
                    }
                )
            }
        )
    }
}

async function addDebuff(req, res) {
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

        const pathImage = await addImage(image, 'debuffs');

        if(!pathImage){
            return res.json({
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
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de l\'ajout de l\'effet nocif'
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'Effet nocif ajouté'
                    });
                }
            }
        )

    }
}

async function getDebuff(req, res) {
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
                d.id,
                d.name,
                d.image_filename,
                COUNT(m.id) as monster_count
            FROM debuff d
            LEFT JOIN monster_debuff mb ON d.id = mb.debuff_id
            LEFT JOIN monster m ON mb.monster_id = m.id
            WHERE d.id = ?
            `,
            [id],
            async (err, result) => {
                if(err) throw err;

                let debuff = result[0];
                debuff.image = await getImage(debuff.image_filename, "debuffs");

                res.json({
                    success: true,
                    data: debuff
                });
            }
        )
    }
}

async function deleteDebuff(req, res) {
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
            FROM monster_debuff
            WHERE debuff_id = ?
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
                        SELECT image_filename FROM debuff WHERE id = ?
                        `,
                        [id],
                        (err, result) => {
                            if(err) throw err;

                            deleteImage(result[0].image_filename, 'debuffs');

                            db.query(
                                `
                                DELETE FROM debuff WHERE id = ?
                                `,
                                [id],
                                (err, result) => {
                                    if(err) throw err;

                                    if(err){
                                        return res.json({
                                            success: false,
                                            message: 'Erreur lors de la suppression de l\'effet nocif'
                                        });
                                    } else {
                                        return res.json({
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
    }
}

function updateDebuff(req, res) {
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
            UPDATE debuff SET name = ? WHERE id = ?
            `,
            [name, id],
            (err, result) => {
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de la mise à jour de l\'effet nocif'
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'Effet nocif mis à jour'
                    });
                }
            }
        )

    }
}

async function getDebuffByMonsterId(id) {
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                d.id
            FROM debuff d
            LEFT JOIN monster_debuff md ON d.id = md.debuff_id
            WHERE md.monster_id = ?
            `,
            [id],
            (err, result) => {
                if(err) reject(err);

                resolve(
                    result.map(debuff => debuff.id)
                );
            }
        )
    })
}

module.exports = {
    getDebuffs,
    addDebuff,
    getDebuff,
    deleteDebuff,
    updateDebuff,
    getDebuffByMonsterId
}