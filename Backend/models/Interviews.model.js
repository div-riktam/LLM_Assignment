const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  jobID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job_Opening',  // Referencing JobOpening by its _id
    required: true 
  },
  questions: [
    {
      question: { type: String, required: true },
      answer: { type: String },
      chat: [
        {
          sender: {type: String, required: true},
          message: {type: String, required: true}
        }
      ]
    }
  ]
});

// The interviewID will be the default MongoDB _id
const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
