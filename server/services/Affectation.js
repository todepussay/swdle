const { db } = require('./db');
const { UserHasPermissionAdmin } = require('./User');

async function affecter(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

        const { id, onglet } = req.query;
        const { monsters } = req.body;
        
        let removeLastLetterOnglet = onglet.slice(0, -1);
        let tableName = `monster_${removeLastLetterOnglet}`; 
        let columnName = `${removeLastLetterOnglet}_id`;

        db.beginTransaction();
        
        try  {
            monsters.map(monster => {
                return db.query(
                    `
                    INSERT INTO ${tableName} (monster_id, ${columnName}) VALUES (?, ?)
                    `,
                    [monster, id],
                    (err, result) => {
                        if(err) throw err;
                    }
                )
            });

            db.commit();
            return res.json({
                success: true,
                message: 'Affectation réussie'
            });

        } catch(error){
            db.rollback();
            return res.json({
                success: false,
                cause: 'affectation_failed',
                message: 'L\'affectation a échouée'
            });
        }
        
    }
}

async function desaffecter(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    
    if(!UserHasPermissionAdmin(token)){
        return res.json({
            success: false,
            cause: 'unauthorized',
            message: 'Vous n\'avez pas les permissions nécessaires'
        });
    } else {

        const { id, onglet } = req.query;
        const { monsters } = req.body;

        let removeLastLetterOnglet = onglet.slice(0, -1);
        let tableName = `monster_${removeLastLetterOnglet}`;
        let columnName = `${removeLastLetterOnglet}_id`;

        db.beginTransaction();

        try {
            monsters.map(monster => {
                return db.query(
                    `
                    DELETE FROM ${tableName} WHERE monster_id = ? AND ${columnName} = ?
                    `,
                    [monster, id],
                    (err, result) => {
                        if(err) throw err;
                    }
                )
            });

            db.commit();
            return res.json({
                success: true,
                message: 'Désaffectation réussie'
            });

        } catch(error){
            db.rollback();
            return res.json({
                success: false,
                cause: 'desaffectation_failed',
                message: 'La désaffectation a échouée'
            });
        }

    }
}

module.exports = {
    affecter,
    desaffecter
};