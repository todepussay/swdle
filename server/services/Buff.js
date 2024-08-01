const { db } = require('./db');
const { getImage } = require('../Entity/Image');
const { addBuff, deleteBuff, updateBuff } = require('../Entity/Buff');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

async function getBuffs(req, res) {
    const page = req.query.page;
    const search = req.query.search + "%";
    
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

async function addBuffService(req, res) {
    try {
        const { name, image } = req.body;

        const result = await addBuff({ name, image });

        res.json(result);

    } catch(err) {
        res.json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'effet de renforcement'
        });
    }
}

async function getBuff(req, res) {
    const id = req.params.id;
    
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

async function deleteBuffService(req, res) {
    try {
        const id = req.params.id;

        const result = await deleteBuff(id);

        res.json(result);
    } catch(err) {
        res.json({
            success: false,
            message: 'Erreur lors de la suppression de l\'effet de renforcement'
        });
    }
}

function updateBuffService(req, res) {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const result = updateBuff(id, { name });

        res.json(result);
    } catch(err) {
        res.json({
            success: false,
            message: 'Erreur lors de la modification de l\'effet de renforcement'
        });
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
    addBuffService,
    getBuff,
    deleteBuffService,
    updateBuffService,
    getBuffByMonsterId
}