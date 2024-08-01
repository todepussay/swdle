const { getImage } = require('../Entity/Image');

async function getImageService(req, res){
    try {
        const { filename, folder } = req.params;
        const image = await getImage(filename, folder);
        res.json({
            success: true,
            data: image
        });
    } catch(err){
        res.json({
            success: false,
            message: 'Erreur lors de la récupération de l\'image'
        });
    }
}

module.exports = {
    getImageService
}