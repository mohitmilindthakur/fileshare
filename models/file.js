const { Sequelize, sequelize } = require('./../db');


const FilesModel = sequelize.define('files', {
    // stored as UUID in MySQL
    id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    s3Key: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false
    },
    uploadDate: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW
    },
}, {
    tabelName: 'files',
    timestamps: false
});

module.exports = FilesModel;