const {DataTypes} = require("sequelize");
const sequelize = require("../config/connect");

const Message = sequelize.define("message", {
    message_id : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    room_id : {
        type: DataTypes.INTEGER,
        references:'chat_room',
        referencesKey:"room_id",
    },
    sender_id : {
        type: DataTypes.INTEGER,
        references:"user",
        referencesKey:"user_id"
    },
    body :{
        type: DataTypes.STRING
    }


},{
    freezeTableName:true
})

Message.sync();

module.exports = Message;
