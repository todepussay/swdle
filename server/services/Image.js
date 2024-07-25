const Jimp = require('jimp');
const fs = require('fs');
const { resolve } = require('path');

function getImage(monsterImage, category) {
    return new Promise(async (resolve, reject) => {
        try {
            const image = await Jimp.read(`./asset/${category}/${monsterImage}`);
            image.getBase64(Jimp.AUTO, (err, base64) => {
                if(err) reject(err);
                resolve(base64);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

async function addImage(image, category){
    return new Promise(async (resolve, reject) => {
        try {
            const base64Regex = /^data:image\/(jpeg|png|webp);base64,/;
            const matches = image.match(base64Regex);

            if (!matches) {
                return reject(new Error('Invalid base64 image string'));
            }

            const extension = matches[1].split(';')[0];
            const base64Data = image.replace(base64Regex, '');
            const buffer = Buffer.from(base64Data, 'base64');

            let path = `./asset/${category}/`;
            let filename = `${Date.now()}.${extension}`;

            fs.writeFile(path + filename, buffer, (err) => {
                if(err) reject(err);
                resolve(filename);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

async function deleteImage(filename, category){
    new Promise(async (resolve, reject) => {
        try {
            let path = `./asset/${category}/${filename}`;
            fs.unlink(path, (err) => {
                if(err) reject(err);
                resolve();
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

module.exports = {
    getImage,
    addImage,
    deleteImage
}