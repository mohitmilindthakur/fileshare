const { Worker } = require('bullmq');
const { deleteObject } = require('./../../services/s3');

const processor = async(job) => {
    let s3Key = job?.data?.s3Key;
    if (!s3Key) {
        return;
    }
    console.log('deleting object')
    await deleteObject(s3Key);
    console.log('object deleted')
}
const worker = new Worker('files-queue', processor);