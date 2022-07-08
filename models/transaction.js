const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Transaction = sequelize.define("transaction", {
    transaction_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    buyer_id : {
        type: DataTypes.INTEGER,
        // references:'user',
        // referencesKey:"user_id",
    },
    product_id : {
        type: DataTypes.INTEGER,
        // references:'product',
        // referencesKey:"product_id",
    },

    transaction_qty : {
       type:DataTypes.INTEGER
    },
        
    total : {
        type: DataTypes.INTEGER,
    }
},{
    freezeTableName:true
})

Transaction.sync();

module.exports = Transaction;