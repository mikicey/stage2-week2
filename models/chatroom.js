const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Chatroom = sequelize.define("chat_room", {
    room_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    last_msg : {
        type: DataTypes.STRING,
    },
    last_time : {
        type: DataTypes.DATE
    }

},{
    timestamps:false,
    freezeTableName:true
})

Chatroom.sync();

module.exports = Chatroom;
