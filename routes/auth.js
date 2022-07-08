const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");
const { registerUser, loginUser , logoutUser } = require("../controller/auth");


router.get("/register", registerUser);
router.get("/login", loginUser);
router.get("/logout", verifyJWT , logoutUser);



module.exports = router;