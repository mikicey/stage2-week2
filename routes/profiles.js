const express = require("express");
const router = express.Router();

const { getProfile, postProfile , editProfile} = require("../controller/profiles");

router.get("/:id",getProfile);
router.post("/:id", postProfile);
router.put("/:id", editProfile);


module.exports = router;