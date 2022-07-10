
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { Op } = require("sequelize");

const {emailChecker,minimumChecker} = require("../helper/auth");
const {sendErr} = require("../helper/other")

require("dotenv").config();



const registerUser = async(req,res) => {


    // Checking format
    if(!emailChecker(req.body.email) || !minimumChecker(req.body.email,8)){
        return sendErr("Email format invalid",res)
    };

    if(!minimumChecker(req.body.name,8)){
        return sendErr("Username minimum 8 characters",res)
    };

    if(!minimumChecker(req.body.password,8)){
        return sendErr("Password minimum 8 characters",res)
    };


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

        return res.status(201).send({
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
    return res.status(201).send({
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