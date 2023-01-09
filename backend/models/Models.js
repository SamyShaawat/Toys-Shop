const {Sequelize,DataTypes, Op} = require('sequelize');
const sequelize = new Sequelize('toyshop', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
sequelize.authenticate()
.then( db => {

    })
.catch ( err => {
    console.error('Unable to connect to the database:', err);
    })

const Item = sequelize.define('items', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    },
    {
    timestamps: false
    });

const User = sequelize.define('users', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
        
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    },
    {
    timestamps: false
    }
    );

const CartItems = sequelize.define('cart_items', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,

    },
    userID: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id'
    }
    },
    itemID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Item,
        key: 'id'
    }
    },
    quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
    }
    },
    {
    timestamps: false
    }
    );

Item.hasMany(CartItems)
CartItems.belongsTo(Item)
module.exports ={Item, User, CartItems}


