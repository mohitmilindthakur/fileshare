const { Queue } = require('bullmq');
const filesQueue = new Queue('files-queue', {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

module.exports = filesQueue;