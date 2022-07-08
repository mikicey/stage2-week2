const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Product = sequelize.define("product", {
    product_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    product_name : {
        type: DataTypes.STRING,
    },
    product_img : {
        type: DataTypes.STRING,
    },
    product_qty : {
        type: DataTypes.INTEGER,
    },

    price : {
        type: DataTypes.INTEGER,
    },

    desc : {
        type: DataTypes.STRING,
    },

    category_id : {
        type: DataTypes.INTEGER,
        // references:'category',
        // referencesKey:"category_id",
    },
    
    user_id : {
        type: DataTypes.INTEGER,
        // references:'user',
        // referencesKey:'user_id'
    }

},{
    timestamps:false,
    freezeTableName:true
})

Product.sync();

module.exports = Product;