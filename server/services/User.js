const jsonwebtoken = require('jsonwebtoken');

function UserHasPermissionAdmin(token){

    // Check if token is valid
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        // Check if token is expired
        if(Date.now() >= decoded.exp * 1000){
            return false;
        }

        return true;
        
    } catch (error) {
        return false;
    }

}

module.exports = {
    UserHasPermissionAdmin,
}