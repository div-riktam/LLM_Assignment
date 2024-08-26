const router = require('express').Router();
const ChatCtrl = require("../controllers/Chat");

router.post("/message", ChatCtrl.generateAnswer);


module.exports = router;