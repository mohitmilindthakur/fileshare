'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
      id: {
        type: Sequelize.DataTypes.STRING(36),
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
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('files');
  }
};
