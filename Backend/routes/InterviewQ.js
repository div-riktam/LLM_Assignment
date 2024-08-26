const router = require('express').Router();
const InterviewCtrl = require("../controllers/InterviewQ");

router.post("/questions", InterviewCtrl.generateQuestions);


module.exports = router;