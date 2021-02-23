const Sequelize = require('sequelize');

//const connection = new Sequelize('guiapress','root','relogio',{
const connection = new Sequelize('digima','digima','relogio12',{
    //host: 'localhost',
    host: 'mysql743.umbler.com',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;