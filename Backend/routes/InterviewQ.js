const router = require('express').Router();
const InterviewCtrl = require("../controllers/InterviewQ");
const JobCtrl = require("../controllers/JobOpening");

router.post("/", InterviewCtrl.startAnInterview);
router.post("/questions", InterviewCtrl.generateQuestions);
router.post("/job", JobCtrl.saveJobOpening);
router.get("/jobs", JobCtrl.getAllJobs);
router.post("/answer", InterviewCtrl.submitQuestion);
router.post("/doubt", InterviewCtrl.askDoubt);
module.exports = router;