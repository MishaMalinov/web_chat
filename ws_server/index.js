const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001; // HTTP API
const WS_PORT = 3002; // WebSocket server

app.use(cors());
app.use(bodyParser.json());

const wss = new WebSocket.Server({ port: WS_PORT });

const clients = new Map(); // WebSocket => chat_id

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Set chat_id when client subscribes
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.action === "subscribe" && data.chat_id) {
        clients.set(ws, data.chat_id);
        console.log(`Client subscribed to chat_id: ${data.chat_id}`);
      }
    } catch (err) {
      console.error("Invalid WS message:", msg);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Receive HTTP request from Laravel and broadcast to relevant clients
app.post("/broadcast", (req, res) => {
  const message = req.body;
  console.log("Incoming message from Laravel:", message);

  // Broadcast only to sockets subscribed to this chat
  clients.forEach((subscribedChatId, client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      subscribedChatId === message.chat_id
    ) {
      client.send(JSON.stringify(message));
    }
  });

  res.json({ status: "Message broadcasted" });
});

app.listen(PORT, () => {
  console.log(`HTTP server on http://localhost:${PORT}`);
  console.log(`WebSocket server on ws://localhost:${WS_PORT}`);
});
