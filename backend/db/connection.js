const {Sequelize,DataTypes, Op} = require('sequelize');
const sequelize = new Sequelize('toyshop', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
const connect= sequelize.authenticate()
.then( db => {
    console.log('Database Connected');
    })
.catch ( err => {
    console.error('Unable to connect to the database:', err);
    })

module.exports = connect;