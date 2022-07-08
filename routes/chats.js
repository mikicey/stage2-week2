const express = require("express");
const router = express.Router();


const { getMessage, postMessage , getChatList } = require("../controller/chats");

router.get("/messages",getChatList);
router.get("/message/:id", getMessage);
router.post("/message/:id", postMessage);



module.exports = router;