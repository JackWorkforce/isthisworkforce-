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
        const userMessage = req.body.messages;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Ensure you're using GPT-4
                messages: userMessage,
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
