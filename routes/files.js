const router = require('express').Router();
const controller = require('./../controllers/files');

router.post('/generate-put-signed-url', controller.generatePutSignedUrl);
router.post('/generate-get-signed-url', controller.generateGetSignedUrl);
router.get('/:id', controller.getFileById);
router.delete('/:id', controller.deleteFileById);
router.get('/', controller.getFiles);
router.post('/', controller.uploadFile);

module.exports = router;
