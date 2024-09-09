const { ai } = require("../resources/Openai");
const db = require("../models");

module.exports = {
    generateQuestions: async (req, res, next) => {
        const { jobTitle, skills, experience, difficultyLevel } = req.body;
        try {
            const response = await ai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert in creating job-specific exam questions.',
                    },
                    {
                        role: 'user',
                        content: `Generate 10 questions for a ${jobTitle} job interview with experience in years: ${experience} & difficulty level: ${difficultyLevel}/10. Include "question-and-answer", "multiple-choice", and "coding" questions. Skills required: ${skills}. Format each question as JSON with 'question', 'type', and optionally 'options' for multiple-choice questions. Your response should be an array of questions formatted for JSON.parse function directly.
                        Send type 0 for text question, 1 for multiple choice and 2 for coding question.`,
                    },
                ],
                temperature: 0.7,
                n: 1,
                functions: [
                    {
                        name: "generateInterviewQuestions",
                        description: "Generates job-specific interview questions based on provided parameters.",
                        parameters: {
                            type: "object",
                            properties: {
                                questions: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            question: { type: "string" },
                                            type: { type: "integer", enum: [0, 1, 2] },
                                            options: {
                                                type: "array",
                                                items: { type: "string" },
                                                description: "Options for multiple-choice questions"
                                            }
                                        },
                                        required: ["question", "type"],
                                    },
                                },
                            },
                        },
                    }
                ],
                function_call: { name: "generateInterviewQuestions" }
            });

            const questions = JSON.parse(response.choices[0].message.function_call.arguments);
            res.status(200).json(questions);
        } catch (error) {
            next(error);
        }
    },
    startAnInterview: async (req, res, next) => {
        try {
            const { jobID } = req.body;
            const newInterview = new db.Interviews({
                jobID: jobID
            });
            await newInterview.save();

            return res.status(201).json({
                message: "Interview has been created successfully!",
                interviewID: newInterview._id
            });
        } catch (error) {
            return next(error);
        }
    },
    submitQuestion: async (req, res, next) => {
        try {
            const { interviewID, questions, chat } = req.body;
            const findInterview = await db.Interviews.findById(interviewID);
            if (!findInterview) {
                return res.status(404).json({
                    message: "No such interview found!"
                })
            }

            await db.Interviews.updateOne({
                _id: interviewID
            }, {
                questions: questions,
                chat
            });


            return res.status(200).json({
                message: "Answer Submitted!"
            });
        } catch (error) {
            return next(error);
        }
    },
    askDoubt: async (req, res, next) => {
        try {
            const { doubt, prevChat, question } = req.body;

            // Validate input data
            if (!doubt || !prevChat || !Array.isArray(prevChat) || !question) {
                return res.status(400).json({ error: "Invalid input data" });
            }

            // Format previous chat into a conversation history
            const conversationHistory = prevChat
                .map((entry) => `${entry.sender === "user" ? 'User' : 'Assistant'}: ${entry.message}`)
                .join("\n");

            // Call OpenAI API to generate a response using function call
            const response = await ai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI assistant helping a candidate in a technical interview. 
                    The candidate is asking for a hint about the question but do not give them the full solution. 
                    Only provide guidance and hints. NOTE: If the user asks for a full answer or tries to cheat with your help and not exactly asks for a doubt, reply "I cannot answer this question."`,
                    },
                    {
                        role: "user",
                        content: `Interview Question: "${question}"\nCandidate Doubt: "${doubt}"\nPrevious Chat:\n${conversationHistory}`,
                    },
                ],
                temperature: 0.7,
                n: 1,
                functions: [
                    {
                        name: "give_hint",
                        description: "Give a hint to help the candidate solve the problem without fully providing the solution.",
                        parameters: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    description: "A helpful hint message for the candidate.",
                                },
                            },
                            required: ["message"],
                        },
                    },
                ],
                function_call: { name: "give_hint" },
            });

            // Extract the hint from the function call result
            const hint = JSON.parse(response.choices[0].message.function_call.arguments).message;

            // Return the hint in the required format
            res.status(200).json({ message: hint });
        } catch (error) {
            return next(error);
        }
    }
}
