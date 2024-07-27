const jsonwebtoken = require('jsonwebtoken');

function TokenIsValid(token){
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return false;
    }
}

function UserHasPermissionAdmin(req, res, next){

    // Check if token is valid
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decoded = TokenIsValid(token);

        if(!decoded){
            return res.json({
                success: false,
                cause: "unauthorized",
                message: 'Token is invalid'
            });
        }

        // Check if user is admin
        if(decoded.role_id !== 1){
            return res.json({
                success: false,
                cause: "unauthorized",
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