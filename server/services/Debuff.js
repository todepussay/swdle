const { db } = require('./db');
const { getImage } = require('../Entity/Image');
const { addDebuff, deleteDebuff, updateDebuff } = require('../Entity/Debuff');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

async function getDebuffs(req, res) {
    const page = req.query.page;
    const search = req.query.search + "%";

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

async function addDebuffService(req, res) {
    try {
        const { 
            name,
            image
        } = req.body;

        const result = await addDebuff({ name, image });

        res.json(result);
    } catch(err) {
        res.json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'effet nocif'
        });
    }
}

async function getDebuff(req, res) {
    const id = req.params.id;
    
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

async function deleteDebuffService(req, res) {
    try {
        const id = req.params.id;

        const result = await deleteDebuff(id);

        res.json(result);

    } catch(err) {
        res.json({
            success: false,
            message: 'Erreur lors de la suppression de l\'effet nocif'
        });
    }
}

async function updateDebuffService(req, res) {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const result = await updateDebuff({ id, name });

        res.json(result);
    } catch(err) {
        res.json({
            success: false,
            message: 'Erreur lors de la modification de l\'effet nocif'
        });
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
                resolve(
                    result.map(debuff => debuff.id)
                );
            }
        )
    })
}

module.exports = {
    getDebuffs,
    addDebuffService,
    getDebuff,
    deleteDebuffService,
    updateDebuffService,
    getDebuffByMonsterId
}