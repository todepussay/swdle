const { db } = require('./db');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function login(req, res){
    console.log("Tentative de connexion");

    const { email, password } = req.body;

    console.log(email, password)

    if(!email || !password){
        return res.json({
            message: 'Les données sont incomplètes'
        });
    }

    db.query(
        `SELECT 
            u.id,
            u.email,
            u.password,
            u.username,
            r.id as role_id,
            r.name as role_name
        FROM user u, role r
        WHERE u.email = ? 
        AND u.role_id = r.id`,
        [email],
        (err, result) => {
            if(err){
                console.log(err);
                return res.json({
                    success: false,
                    message: 'Erreur serveur'
                });
            }

            if(result.length === 0){
                return res.json({
                    success: false,
                    message: 'Adresse email ou mot de passe incorrect1'
                });
            }

            // Bcrypt compare with salt 12
            const isPasswordValid = bcrypt.compareSync(password, result[0].password);

            if(!isPasswordValid){
                return res.json({
                    success: false,
                    message: 'Adresse email ou mot de passe incorrect2'
                });
            }

            const token = jsonwebtoken.sign(
                { 
                    id: result[0].id, 
                    email: result[0].email, 
                    username: result[0].username, 
                    role_id: result[0].role_id,
                    role_name: result[0].role_name
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            console.log('Connexion réussie')

            return res.json({
                success: true,
                message: 'Connexion réussie',
                token: token
            });
        }
    )
}

function signin(req, res){
    console.log("Tentative de création d'un utilisateur");

    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.json({
            message: 'Les données sont incomplètes'
        });
    }

    if(username.length < 4 || !username.match(/^[a-zA-Z0-9]+$/)){
        return res.json({
            message: 'Le nom d\'utilisateur est invalide'
        });
    }

    if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
        return res.json({
            message: 'L\'adresse email est invalide'
        });
    }

    if(password.length < 8){
        return res.json({
            message: 'Le mot de passe doit contenir au moins 8 caractères'
        });
    }

    db.query(
        `SELECT * FROM user WHERE email = ?`,
        [email],
        (err, results) => {
            if(err){
                console.log(err);
                return res.json({
                    success: false,
                    message: 'Erreur serveur'
                });
            }

            if(results.length > 0){
                return res.json({
                    success: false,
                    message: 'L\'adresse email est déjà utilisée'
                });
            } else {
                db.query(
                    `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`,
                    [username, email, password],
                    (err) => {
                        if(err){
                            return res.json({
                                success: false,
                                message: 'Erreur serveur'
                            });
                        }

                        return res.json({
                            success: true,
                            message: 'Utilisateur créé'
                        });

                        console.log('Utilisateur créé');
                    }
                )
            }
        }
    )

}

module.exports = {
    login,
    signin
}