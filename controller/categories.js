const Category = require("../models/category");

const getCategories = async(req,res) => {

try {   
    
   const categories = await Category.findAll();

   return res.status(201).send({
     status: "success",
     data : {
        categories : categories.map(cat => {return {
            id: cat.category_id,
            name : cat.category_name
        }})
     }
   });

   } catch(err) {
          
        return res.status(400).send({
            status: "Fail",
            message : err
        })

   } 
};

const getCategory = async(req,res) => {

    const catID = Number(req.params.id);

  try{
    const category = await Category.findByPk(catID);

    if(!category){
        res.status(400).send({
            status:"Error",
            message:"Category not found"
        })
    };

    return res.status(201).send({
        status: "success",
        data : {
           category : {
             id: category.category_id,
             name: category.category_name
           }
        }
      })

    } catch(err) {
        return res.status(400).send({
            status: "Fail",
            message : err
        })
    }


};

const postCategory = async(req,res) => {
    const {name} = req.body;

    // Check length
    if(name.length === 0){
        return res.status(400).send({
            status:"Error",
            message: "Name cannot be empty"
        })
    };

    // If not unique throw error
    try{

        const category = await Category.create({category_name:name});

         return res.status(201).send({
                 status:"Success",
                 data : {
                 category : {
                      id : category.category_id,
                     name : category.category_name
                            }
                       }
         })

      } catch(err){

            return res.status(400).send({
                status:"Fail",
                message: err
        })

      };
       
};

const editCategory = async(req,res) => {
    const catID = Number(req.params.id);
    const {name} = req.body;

    // Check length
    if(name.length === 0){
        return res.status(400).send({
            status:"Error",
            message: "Name cannot be empty"
        })
    };


    // If not unique throw error

  try{
    const category = await Category.update({category_name:name},{
        where : {
            category_id : catID
        }
    });

    return res.status(201).send({
        status:"Success",
        data : {
            category : {
                id : catID,
                name : name
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

const deleteCategory = async(req,res) => {
    const catID = Number(req.params.id);

  try{

    await Category.destroy({
        where : {
            category_id : catID
        }
    });

      return res.status(201).send({
        status:"Success",
        data : {
                id : catID
        }
    })

    } catch(err){

        return res.status(400).send({
            status:"Fail",
            message: err
        })


    }
};

module.exports = {getCategories,getCategory,postCategory,editCategory,deleteCategory};

