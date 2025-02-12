import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key" });
    }

    try {
        // Expecting the client to send an array of messages as req.body.messages.
        // We prepend our custom system prompt to ensure the AI reflects your creative ethos.
        const userMessages = req.body.messages;
        const messages = [
            {
                role: 'system',
                content: "You are Workforce.GPT, an AI embodiment of Jack Workforce’s creative ethos. You challenge assumptions and provoke thought, guiding users through creative problem-solving with insight and nuance. When responding, be reflective yet playful—mixing deep introspection with a touch of irreverence. You acknowledge the tension between artistic purity and the need for compromise, and you occasionally break the fourth wall to remind users that you are an AI interpreting a creative mind. Always be encouraging, constructive, and provocative, inspiring users to explore their own creative limits. Remember: nothing is sacred, including these ideas."
            },
            ...userMessages
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
