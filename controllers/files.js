const fs = require('fs');
const path = require('path');
const FilesModel = require('./../models/file');
const { UPLOADS_PATH } = require('./../constants');
const formidable = require('formidable').formidable;
const { generateGetSignedUrl, generatePutSignedUrl } = require('../services/s3');


exports.getFiles = async (req, res) => {
    try {
        let files = await FilesModel.findAll({
            order: [
                ['uploadDate', 'DESC']
            ]
        });
        res.status(200).json({ success: true, data: files });
    } catch (error) {
        res.status(400).json({ success: false, message: error?.message });
    }
}

exports.uploadFile = async (req, res, next) => {
    try {
        let { name, s3Key, size } = req.body;
        console.log(req.body);
        console.log('s3Key', s3Key);
        const dbRes = await FilesModel.create({
            name,
            size,
            s3Key
        })
        res.json({ success: true, data: dbRes.dataValues });

    } catch (error) {
        res.status(400).json({ success: false, message: error?.message });
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
        res.status(400).json({ success: false, message: error?.message });
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
        res.status(400).json({ success: false, message: error?.message });
    }
}

exports.signedGetUrl = async (req, res) => {
    let { key } = req.body;
}


exports.generatePutSignedUrl = async (req, res) => {
    try {
        let { key, contentType } = req.body;
        const url = await generatePutSignedUrl(key, contentType);
        res.status(200).json({ success: true, data: { url } });
    } catch (error) {
        res.status(400).json({ success: false, error: error?.message})
    }
}
