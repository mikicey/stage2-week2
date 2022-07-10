const Transaction = require("../models/transaction");
const Product = require("../models/product");
const sequelize = require("../config/connect")
const { QueryTypes } = require('sequelize');
const {sendErr} = require("../helper/other");

const getTransactions = async(req,res) => {

    const userID = req.user.id;
    const query = `
    SELECT transaction_id, total, product.product_id, product_name, product_img, product.desc, user.user_id, username, email
    FROM transaction INNER JOIN product 
    ON transaction.product_id = product.product_id AND transaction.buyer_id = ${userID}
    INNER JOIN  user ON user.user_id = product.user_id
    `

    try {
         const mytransaction_products = await sequelize.query(
            query , {type:QueryTypes.SELECT}
         );

         
        
         return res.status(201).send({
            status : "success",
            data : {
                transaction : mytransaction_products.map(item => {
                    return {
                        id : item.transaction_id,
                        product : {
                           id: item.product_id,
                           image: item.product_img,
                           title : item.product_name ,
                           desc : item.desc
                        },
                        buyer : {
                           id:req.user.id ,
                           name :req.user.name,
                           email : req.user.email 
                        },
                        seller : {
                            id: item.user_id,
                            name : item.username,
                            email :  item.email
                        },
                        price: item.total ,
                        status: "Success"
                    }
                })
            }
         })

    } catch(err) {
        return res.status(400).send({
            status: "fail",
            message : err
        })
    }
      
};

const postTransaction = async(req,res) => {

    const userID = req.user.id;
    const {idProduct,qty,total} = req.body;

    
    if(qty < 0 || total < 0){
        return sendErr("Total Price and quantity cant be negative",res)
    }

try{
  const transaction = await Transaction.create({
      buyer_id : userID,
      product_id : idProduct,
      transaction_qty : qty,
      total : total
  });

  const productBought = await Product.findOne(
    {where: {product_id:transaction.product_id},
     attributes: ["user_id"]
    }
    );

  
  return res.status(201).send({
      status:"success",
      data: {
        transaction : {
         id : transaction.transaction_id,
         idProduct : transaction.product_id,
         idBuyer: transaction.buyer_id,
         idSeller : productBought.user_id,
         total: transaction.total }
      }
  });

    } catch(err) {

        return res.status(400).send({
            status:"fail",
            message : "Make sure datatype correct and product id exists in product table"
        })

    }

};

module.exports = {getTransactions,postTransaction};

