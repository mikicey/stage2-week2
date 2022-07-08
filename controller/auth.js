const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { Op } = require("sequelize");

require("dotenv").config();



const registerUser = async(req,res) => {


        const schema = Joi.object({
            name: Joi.string().min(6).required(),
            email: Joi.string().email().min(5).required(),
            password: Joi.string().min(8).required()
        });

        // Check format
        const{err} = schema.validate(req.body);
        if(err){
            return res.status(400).send({
                error: {
                    message: error.details[0].message
                }
            })
        }

    try {
        // Check any duplicate emails and username
        const duplicate = await User.findAll({
            where: {
                [Op.or]: [
                    {email: req.body.email},
                    {username: req.body.name }
                ]
            },
            attributes:["user_id"]
        })

        if(duplicate.length !== 0){
            return res.status(400).send({
                status:"Form error",
                message:"Username/Email is already registered"
            })
        };


        // Kalo lolos semua, insert
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)

        const newUser = await User.create({
            username: req.body.name,
            email:req.body.email,
            password: hashedPassword,
            isAdmin : false
        })

        // Create token + response

        
        const token = jwt.sign({
           email : req.body.email,
           iat: Date.now(),
           expires : "1d"
        }, process.env.SECRET,
        {
            expiresIn:"1d"
        })

        res.status(201).send({
             status:"success",
             data : {
                user : {
                    name : newUser.username,
                    email : newUser.email,
                    token : token
                }
             }
        })

    } catch (err) {


        res.status(400).send({
            status:"fail",
            msg : err
       })

    }

};

const loginUser = async(req,res) => {
    const{email,password} = req.body;


 try{
    //  check apakah email terdaftar
    const match = await User.findAll({
        where: {
            email : email
        } 
    });

    if(match.length === 0){
        return res.status(400).send({
            status:"Error",
            message: "Email isnt registered yet"
        })
    };


    
    // check input passwordnya
    const matchedPw = match[0].password;
    const isMatch = bcrypt.compareSync(password,matchedPw);

    if(!isMatch){
        return res.status(400).send({
            status:"Error",
            message:"Wrong password"
        })
    }


    // kasi token
    const token = jwt.sign({
        email : req.body.email,
        iat: Date.now(),
        expires : "1d"
     }, process.env.SECRET,
     {
         expiresIn:"1d"
     })

    // response
    res.status(201).send({
        status:"success",
        data : {
            user : {
                name: match[0].username,
                email: match[0].email ,
                status: match[0].isAdmin ? "admin" : "customer",
                token : token
            }
        }
    }) 

     } catch (err) {

        return res.status(400).send({
            status:"fail",
            msg : err
       })

    }

};

const logoutUser = async(req,res) => {
    return res.status(201).send({
        status:"Success",
        message: "Logout"
    })
};


module.exports = {registerUser, loginUser, logoutUser};