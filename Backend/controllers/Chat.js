const { ai } = require("../resources/Openai")

module.exports = {
    generateAnswer: async (req, res, next) => {
        try {
            const { userText, numVariants } = req.body;
            const completion = await ai.chat.completions.create({
                model: "gpt-4", // Replace "gpt-4o-mini" with the correct model if needed
                messages: [
                    { role: "system", content: "You are a witty assistant who loves making up creative and unique jokes." },
                    {
                        role: "user",
                        content: userText,
                    },
                ],
                n: numVariants,
                temperature: 2,   // Introduces more randomness
                top_p: 0.9,         // Encourages sampling from a broader set of possible outputs
            });

            return res.status(200).json({
                responses: completion.choices.map((e) => { return { index: e.index + 1, content: e.message.content } }),
                // completion
            });
        } catch (error) {
            next(error);
        }
    }
}