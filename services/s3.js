const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')


const s3Client = new S3Client({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
})

exports.generateGetSignedUrl = async function (Key) {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.bucketName,
            Key
        })
        const url = await getSignedUrl(s3Client, command);
        return url
    } catch (error) {
        throw new Error(error?.message || 'Error in generating signed url');
    }
}

exports.generatePutSignedUrl = async function (Key, ContentType, filename) {
    try {
        console.log(`attachment;filename="${filename}"`);
        const command = new PutObjectCommand({
            Bucket: process.env.bucketName,
            Key,
            ContentType,
            ContentDisposition: `attachment;filename="${filename}"`
        })
        const url = await getSignedUrl(s3Client, command);
        return url;
    } catch (error) {
        throw new Error(error?.message || 'Error in generating signed url');
    }
}


exports.deleteObject = async function (Key) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.bucketName,
            Key,
        })
        const response = await s3Client.send(command);
        return response;
    } catch (error) {
        throw new Error(error?.message || 'Error in deleting object');
    }
}
