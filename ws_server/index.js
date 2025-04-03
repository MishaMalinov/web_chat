const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map(); // ws => chat_id

app.use(cors({
    origin: '*', // allow all origins
}));

app.use(bodyParser.json());

// Broadcast API (from Laravel)
app.post("/broadcast", (req, res) => {
    const message = req.body;
    console.log("Broadcasting message:", message);

    clients.forEach((chatId, ws) => {
        if (ws.readyState === WebSocket.OPEN && chatId === message.chat_id) {
            ws.send(JSON.stringify(message));
        }
    });

    res.json({ status: "ok" });
});

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg);
            if (data.action === "subscribe" && data.chat_id) {
                clients.set(ws, data.chat_id);
                console.log(`Subscribed to chat ${data.chat_id}`);
            }
        } catch (e) {
            console.error("Invalid WS message");
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        clients.delete(ws);
    });
});

// Listen on assigned Render port
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`WebSocket + HTTP server running on port ${PORT}`);
});
