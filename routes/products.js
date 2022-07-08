const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
// const {upload} = require("../middleware/uploadFile");

const { getProducts, getProduct , postProduct, editProduct, deleteProduct } = require("../controller/products");


router.get("/products",getProducts);
router.get("/product/:id", getProduct);
router.post("/product", verifyAdmin,  postProduct); 
router.put("/product/:id", verifyAdmin, editProduct);
router.delete("/product/:id",verifyAdmin, deleteProduct);


module.exports = router;

// upload.single("image")
//req.file.filename => di controller utk ambil