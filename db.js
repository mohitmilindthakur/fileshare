const Sequelize = require('sequelize');
const sequelize = new Sequelize('fileshare', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('DB connected');
    })
    .catch(err => {
        console.log('error', err)
    })

module.exports = { Sequelize, sequelize }