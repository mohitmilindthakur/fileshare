const Sequelize = require('sequelize');
const sequelize = new Sequelize('fileshare', process.env.DB_USER, process.env.DB_PASSWORD, {
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