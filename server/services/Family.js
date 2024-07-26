const { db } = require('./db');
const { getMonstersByFamilyId } = require('./Monster');
const { addFamily, deleteFamily, updateFamily } = require('../Entity/Family');
const PaginationLimit = parseInt(process.env.PAGINATION_LIMIT);

async function getFamiliesService(req, res) {
    const page = req.query.page;
    const search = req.query.search + "%";
    const withoutMonster = req.query.withoutMonster;

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

async function addFamilyService(req, res) {
    try {
        const { name } = req.body;

        const result = await addFamily({ name });

        res.json(result);
    } catch(err){
        res.json({
            success: false,
            message: 'Erreur lors de l\'ajout de la famille'
        });
    }
}

async function getFamilyService(req, res) {
    const id = req.params.id;

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

async function deleteFamilyService(req, res) {
    try {
        const id = req.params.id;

        const result = await deleteFamily(id);

        res.json(result);
    } catch(err){
        res.json({
            success: false,
            message: 'Erreur lors de la suppression de la famille'
        });
    }
}

async function updateFamilyService(req, res) {
    try {
        const { name } = req.body;
        const id = req.params.id;
    
        const result = await updateFamily(id, { name});
    
        res.json(result);
    } catch(err){
        res.json({
            success: false,
            message: 'Erreur lors de la mise à jour de la famille'
        });
    }
}

module.exports = {
    getFamiliesService,
    addFamilyService,
    getFamilyService,
    deleteFamilyService,
    updateFamilyService
}