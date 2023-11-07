const fs = require('fs');
const path = require('path');
const FilesModel = require('./../models/file');
const { UPLOADS_PATH } = require('./../constants');
const formidable = require('formidable').formidable;


exports.getFiles = async (req, res) => {
    try {
        let files = await FilesModel.findAll({
            order: [
                ['uploadDate', 'DESC']
            ]
        });
        res.status(200).json({ success: true, data: files });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
}

exports.uploadFile = async (req, res, next) => {
    try {
        const form = formidable({ uploadDir: UPLOADS_PATH, keepExtensions: true });
        let [fields, files] = await form.parse(req);
        let file = files.image[0];
        let fileInstance = FilesModel.build({
            name: file.newFilename,
            size: file.size,
            originalName: file.originalFilename,
        })
        fileInstance.imgLink = '/files/' + fileInstance.id;
        let dbRes = await fileInstance.save();
        res.json({ success: true, data: dbRes.dataValues });

    } catch (error) {
        res.status(400).json({ success: false, message: error });
    }
}



const getFileInfo = async (id) => {
    try {
        if (!id) {
            throw new Error('No ID')
        }
        let dbRes = await FilesModel.findByPk(id);
        return dbRes;
    } catch (error) {
        return null;
    }
}

exports.getFileById = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            res.status(400).json({ success: false, error: { message: 'No ID' } })
        }
        console.log(id);
        let dbRes = await FilesModel.findByPk(id);
        console.log(dbRes);
        res.set('Content-Disposition', `attachment; filename=${dbRes.originalName}`);
        res.set('filename', dbRes.originalName);
        res.sendFile(UPLOADS_PATH + '/' + dbRes.name);
    } catch (error) {
        console.log('-----------------', error);
        res.status(400).json({ success: false, message: error });
    }
}

exports.deleteFileById = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            res.status(400).json({ success: false, error: { message: 'No ID' } })
        }
        let fileInfo = await getFileInfo(id);
        console.log('fileInfo', fileInfo);
        if (!fileInfo) {
            throw new Error('No file info found')
        }
        let dbRes = await FilesModel.destroy({
            where: {
                id
            }
        });
        fs.rm(path.join(UPLOADS_PATH, fileInfo.name), () => {
            res.status(200).json({ success: true, message: 'Deleted' });
        });
    } catch (error) {
        console.log('-----------------', error);
        res.status(400).json({ success: false, message: error });
    }
}