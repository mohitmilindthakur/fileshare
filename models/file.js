const { Sequelize, sequelize } = require('./../db');


const FilesModel = sequelize.define('files', {
    // stored as UUID in MySQL
    id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4
    },

    // We are storing the file with hashed name in upload folder but we are storing the original name here
    originalName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    uploadDate: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW
    },
    imgLink: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false
    }
}, {
    tabelName: 'files',
    timestamps: false
});

module.exports = FilesModel;