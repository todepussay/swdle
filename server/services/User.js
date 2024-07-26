const jsonwebtoken = require('jsonwebtoken');

function UserHasPermissionAdmin(req, res, next){

    // Check if token is valid
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        // Check if token is expired
        if(Date.now() >= decoded.exp * 1000){
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        // Check if user is admin
        if(decoded.role_id !== 1){
            return res.status(401).json({
                success: false,
                message: 'User is not admin'
            });
        }
        
        next();
        
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    UserHasPermissionAdmin,
}