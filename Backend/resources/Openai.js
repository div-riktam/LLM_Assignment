const OpenAI = require("openai");

// Create an instance of the OpenAI client
const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Example usage to generate a completion
// const completion = await ai.chat.completions.create({
//     model: "gpt-4", // Replace "gpt-4o-mini" with the correct model if needed
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "Write a haiku about recursion in programming.",
//         },
//     ],
// });

// console.log(completion.choices[0].message.content);

module.exports = { ai };
