const Product = require("../models/product");
const sequelize = require("../config/connect");

const getProducts = async(req,res) => {

    try{
        const products = await Product.findAll();

        return res.status(201).send({
            "status":"success",
            "data": {
                "products" : products.map(product => {
                    return {
                        "id" : product.product_id,
                        "image":product.product_img,
                        "title":product.product_name,
                        "desc":product.desc,
                        "price": product.price,
                        "qty":product.product_qty
                    }
                })
            }
        })

    } catch(err) {
        return res.status(400).send({
            status:"Fail",
            message: err
    })

    }
    

   
};

const getProduct = async(req,res) => {
    const productID = Number(req.params.id);
  
    try{
        const product = await Product.findByPk(productID);

        return res.status(201).send({
            "status":"success",
            "data": {
                "product" : {
                    "id" : product.product_id,
                    "image":product.product_img,
                    "title":product.product_name,
                    "desc":product.desc,
                    "price": product.price,
                    "qty":product.product_qty
                }
            }
        })

    } catch(err) {
        return res.status(400).send({
            status:"Fail",
            message: err
        })
    }

};

const postProduct = async(req,res) => {
    const userID = req.user.id;
    const{image,title,desc,price,qty,category_id} = req.body;

    try{
        const product = await Product.create({product_name:title, 
            product_img:image, 
            product_qty:qty, 
            price:price, 
            desc:desc, 
            category_id:category_id, 
            user_id:userID});

        
        return res.status(201).send({
            "status": "success",
            "data" : {
                "product" : {
                    id : product.product_id,
                    image: product.product_img,
                    title: product.product_name,
                    desc : product.desc,
                    price: product.price,
                    qty: product.product_qty,

                    user : {
                        id:userID,
                        name: req.user.name,
                        email: req.user.email,
                        Image : "user.jpg"
                    }
                }

                }
        })
       
    } catch(err) {
        return res.status(400).send({
            status:"Fail",
            message: err
        })
    }
};

const editProduct = async(req,res) => {
    const userID = req.user.id;
    const productID = req.params.id;

    const{image,title,desc,price,qty,category_id} = req.body;


    try{
        await Product.update({
            product_name:title, 
            product_img:image, 
            product_qty:qty, 
            price:price, 
            desc:desc, 
            category_id:category_id,
        },{
            where : {
                product_id : productID,
                user_id : userID
            }
        });

        const newProduct = await Product.findByPk(productID);



        return res.status(400).send({
            status: "Success",
            data : {
                product : {
                    id : newProduct.product_id,
                    image: newProduct.product_img,
                    title: newProduct.product_name,
                    desc : newProduct.desc,
                    price: newProduct.price,
                    qty: newProduct.product_qty,
                }
            }
        })

    } catch(err) {
        return res.status(400).send({
            status:"Fail",
            message: err
        })
    }
};

const deleteProduct = async(req,res) => {
    const userID = req.user.id;
    const productID = Number(req.params.id);


    try{
        await Product.destroy({
            where : {
                user_id : userID,
                product_id :productID
            }
        });

        return res.status(201).send({
            "status": "Success",
            "data": {
                "id": productID
            }
        })

    } catch(err) {
        return res.status(400).send({
            status:"Fail",
            message: err
        })
    }
};

module.exports = {getProducts,getProduct,postProduct,editProduct,deleteProduct};
