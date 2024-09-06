const db = require("../models");

module.exports = {
    saveJobOpening: async (req, res, next) => {
        try {
            let {
                jobTitle,
                skills,
                experience,
                difficultyLevel,
                programmingLanguage
            } = req.body;
             experience = Number(experience);
             difficultyLevel = Number(difficultyLevel);

            const newJob = new db.JobOpening({
                jobTitle,
                skills,
                experience: Number(experience),
                difficultyLevel: Number(difficultyLevel),
                programmingLanguage
            });

            await newJob.save();

            return res.status(200).json({
                message: "Job has been created successfully!"
            });
        } catch (error) {
            return next(error);
        }
    },
    getAllJobs: async (req, res, next) => {
        try {
            const jobs = await db.JobOpening.find({});
            return res.status(200).json({
                jobs
            });
        } catch (error) {
            return next(error);
        }
    }
}