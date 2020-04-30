const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const Jimp = require('jimp');

async function resizeUpload(path, route){

    const nameFiles = Date.now().toString();
    const img = await Jimp.read(path);
    const resized = img.resize(250, Jimp.AUTO).quality(0);
    const bufferResized = await resized.getBase64Async(Jimp.MIME_JPEG);
    const buffer = Buffer.from(bufferResized.replace(/^data:image\/\w+;base64,/, ""),'base64');

    const response = await new Promise(function (resolve) {
        
        const params = {
            Bucket: process.env.bucket,
            Key: `resize/${route}/${nameFiles}.jpeg`,
            Body: buffer,
            ContentType: 'image/jpeg',
            ContentEncoding: 'base64',
            ACL: 'public-read',
            Metadata: {
                CacheControl: 'no-cache'
            }
        };
    
        return s3.upload(params, function(err, data){
            if(err) {
                return err;
            } else{
                return resolve(data.Location);
            }
        })

    })

    return response;

}

module.exports.resizeUpload = resizeUpload;