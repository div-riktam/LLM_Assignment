const { ai } = require("../resources/Openai")


module.exports = {
    generateQuestions: async (req, res, next) => {
        const { jobTitle, skills, experience, difficultyLevel } = req.body;
        try {
            const response = await ai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert in creating job-specific exam questions.',
                    },
                    {
                        role: 'user',
                        content: `Generate 10 questions for a ${jobTitle} job interview with experience in years: ${experience} & difficulty level: ${difficultyLevel}/10. Include "question-and-answer", "multiple-choice", and "coding" questions. Skills required: ${skills}. Format each question as JSON with 'question', 'type', and optionally 'options' for multiple-choice questions, And send the response in a way that it can be passed in JSON.parse function directly
                        Your response should be an array of questions and no extra word, just the questions because if you will add any extra word, JSON.parse will give an error.
                        Also in JSON use type : 0, 1 and 2 where 0 means "question-answer", 1 means "multiple-choice" and 2 means "coding".`,
                    },
                ],
                temperature: 0.7,
                n: 1,
            });

            // Format response to ensure it matches the required structure
            // console.log({ res: response.choices[0].message.content })
            const questions = JSON.parse(response.choices[0].message.content);
            // console.log(questions);
            res.status(200).json(questions);
        } catch (error) {
            next(error);
        }
    }
}