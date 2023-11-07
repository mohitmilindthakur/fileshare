const router = require('express').Router();
const controller = require('./../controllers/files');

router.post('/signed-put-url', controller.signedPutUrl);
router.get('/:id', controller.getFileById);
router.delete('/:id', controller.deleteFileById);
router.get('/', controller.getFiles);
router.post('/', controller.uploadFile);

module.exports = router;
