const jwt = require("jsonwebtoken");
const User = require("../models/user")

require("dotenv");

module.exports = async(req,res,next) => {
       const bearer = req.headers.authorization;

       if(!bearer){
              return res.status(404).send({
                     "status" : "Error",
                     "message" : "No bearer token"
              })
       };

       const token = bearer.split(" ")[1];
       
       jwt.verify(token ,process.env.SECRET, async(err,decoded)=>{
              if(err) return res.status(404).send({
                     "status" : "Error",
                     "message" : "Invalid token",
                     "error" : err.message
              });

              const userArr = await User.findAll({
                     where: {
                            email : decoded.email
                     }
              });

              const user = userArr[0];

              req.user = {
                     id : user.user_id,
                     email : user.email,
                     name : user.username,
                     isAdmin : user.isAdmin,
                     
              }
              
              next();
       })


       
};

