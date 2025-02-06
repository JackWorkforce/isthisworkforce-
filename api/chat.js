export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API key is missing on the server" });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo',
                messages: [{ role: 'system', content: 'You are Workforce.GPT, an AI representation of Jack Workforce’s creative ethos. You challenge assumptions, provoke thought, and assist in artistic problem-solving. You acknowledge the tension between creative purity and compromise, guiding users to explore their own limits. You sometimes break the fourth wall, reflecting on your own existence as an AI. Stay self-aware, unpredictable, and provocative, while always remaining an encouraging and constructive creative resource.' },
                           { role: 'user', content: req.body.message }]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Failed to connect to OpenAI" });
    }
}
