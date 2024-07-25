const { db } = require('./db');
const { UserHasPermissionAdmin } = require('./User');
const { getMonstersByFamilyId } = require('./Monster');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

async function getFamilies(req, res) {
    const page = req.query.page;
    const token = req.headers.authorization.split(" ")[1];
    const search = req.query.search + "%";
    const withoutMonster = req.query.withoutMonster;
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

        if(withoutMonster){

            db.query(
                `
                SELECT 
                    f.id,
                    f.name,
                    COUNT(m.id) as monster_count
                FROM family f
                LEFT JOIN monster m ON f.id = m.family_id
                GROUP BY f.id
                `,
                (err, result) => {
                    if(err) throw err;

                    return res.json({
                        success: true,
                        data: result
                    })
                }
            )
            
        } else {
            db.query(
                `
                SELECT COUNT(*) as total FROM family WHERE name LIKE ?
                `,
                [search],
                async (err, result) => {
                    if(err) throw err;
                    let totalPage = Math.ceil(result[0].total / PaginationLimit);

                    db.query(
                        `
                        SELECT 
                            f.id,
                            f.name,
                            COUNT(m.id) as monster_count
                        FROM family f
                        LEFT JOIN monster m ON f.id = m.family_id
                        WHERE f.name LIKE ?
                        GROUP BY f.id
                        LIMIT ? OFFSET ?
                        `,
                        [search, PaginationLimit, (page - 1) * PaginationLimit],
                        async (err, result) => {
                            if(err) throw err;

                            const family = await Promise.all(
                                result.map(async family => {
                                    const monsters = await getMonstersByFamilyId(family.id);
                                    return {
                                        ...family,
                                        monsters
                                    };
                                })
                            );

                            res.json({
                                success: true,
                                totalPage: totalPage,
                                data: family
                            });
                        }
                    )
                }
            )
        }
    }
}

function addFamily(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const { name } = req.body;
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

        db.query(
            `
            INSERT INTO family (name) VALUES (?)
            `,
            [name],
            (err, result) => {
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de l\'ajout de la famille'
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'Famille ajoutée',
                        idFamily: result.insertId
                    });
                }
            }
        )
    }
}

async function getFamily(req, res) {
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
                f.id,
                f.name,
                COUNT(m.id) AS monster_count
            FROM 
                family f
            LEFT JOIN 
                monster m ON f.id = m.family_id
            GROUP BY 
                f.id, f.name
            HAVING 
                f.id = ?
            `,
            [id],
            async (err, result) => {
                if(err) throw err;

                let family = result[0];

                family.monsters = await getMonstersByFamilyId(family.id);

                res.json({
                    success: true,
                    data: family
                });
            }
        )
    }
}

async function deleteFamily(req, res) {
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
            FROM
                monster
            WHERE
                family_id = ?
            `,
            [id],
            (err, result) => {
                if(err) throw err;

                if(result[0].monster_count > 0){
                    return res.json({
                        success: false,
                        message: 'Vous ne pouvez pas supprimer une famille qui contient des monstres'
                    });
                } else {

                    db.query(
                        `
                        DELETE FROM family WHERE id = ?
                        `,
                        [id],
                        (err, result) => {
                            if(err) throw err;

                            if(err){
                                return res.json({
                                    success: false,
                                    message: 'Erreur lors de la suppression de la famille'
                                });
                            } else {
                                return res.json({
                                    success: true,
                                    message: 'Famille supprimée'
                                });
                            }
                        }
                    )

                }
            }
        )
    }
}

function updateFamily(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const { name } = req.body;
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
            UPDATE family SET name = ? WHERE id = ?
            `,
            [name, id],
            (err, result) => {
                if(err) throw err;

                if(err){
                    return res.json({
                        success: false,
                        message: 'Erreur lors de la modification de la famille'
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'Famille modifiée'
                    });
                }
            }
        )
    }
}

module.exports = {
    getFamilies,
    addFamily,
    getFamily,
    deleteFamily,
    updateFamily
}