const mongoose = require('../resources/db');

const jobOpeningSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  skills: { type: String, required: true },  // Array of skills
  experience: { type: Number, required: true },  // Number for years of experience
  difficultyLevel: { type: Number, required: true },
  programmingLanguage: {type: String, required: false},
});

const JobOpening = mongoose.model('Job_Opening', jobOpeningSchema);

module.exports = JobOpening;

// Function to create and save a job opening
async function run() {
  try {
    const job = new JobOpening({
      jobTitle: "Software Dev",
      skills: "Node.js, React",  // Array of skills
      experience: 2.5,  // As a number
      difficultyLevel: 7,
      questions: [
        {
          question: "What is your experience with Node.js?",
          type: 0,
          options: []
        }
      ]
    });
    await job.save();
    console.log('Job saved successfully:', job);
  } catch (error) {
    console.error('Error saving job:', error);
  }
}

// run();
