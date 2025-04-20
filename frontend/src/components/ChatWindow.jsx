import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../cofing";
import { v4 as uuidv4 } from "uuid"; 

const CACHE_LIMIT = 50; //  how many to keep
const ChatWindow = ({ chat_id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userData } = useAuth();
  const token = localStorage.getItem("token");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // helper – cache key per‑chat
  const cacheKey = `chat_cache_${chat_id}`;

  // ----------------- load cache first -----------------
  useEffect(() => {
    if (!chat_id) return setMessages([]);

    const cached = localStorage.getItem(cacheKey);     
    if (cached) setMessages(JSON.parse(cached));       // show cached messages ASAP
  }, [chat_id]);                                       // separate effect (only load cache)

  // ----------------- fetch fresh from API -----------------
  useEffect(() => {
    if (!chat_id) return;

    const fetchChatContent = async () => {
      try {
        const { data } = await axios.get(
          `${config.apiUrl}/chat-content?chat_id=${chat_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data);                             // replaces cache once fresh arrives
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchChatContent();
  }, [chat_id]);

  // ----------------- save cache whenever messages change -----------------
  useEffect(() => {
    if (!chat_id) return;
    const lastMessages = messages.slice(-CACHE_LIMIT);
    localStorage.setItem(cacheKey, JSON.stringify(lastMessages));
  }, [messages, chat_id]);                             

  // ----------------- WebSocket -----------------
  useEffect(() => {
    if (!chat_id) return;
    if (socketRef.current) socketRef.current.close();

    const socket = new WebSocket(config.wssUrl);
    socketRef.current = socket;

    socket.onopen = () => socket.send(JSON.stringify({ action: "subscribe", chat_id }));

    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);

      setMessages((prev) => {
        if (message.temp_id && message.sender?.username === userData.username) {
          return prev.map((m) =>
            m.temp_id === message.temp_id ? { ...message, pending: false } : m
          );
        }
        if (message.sender?.username !== userData.username) {
          return [...prev, { ...message, pending: false }];
        }
        return prev;
      });
    };

    return () => socket.close();
  }, [chat_id]);

  // ----------------- auto‑scroll -----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------- send -----------------
  const sendMessageHandler = async () => {
    if (!input.trim()) return;

    const temp_id = uuidv4();
    setMessages((prev) => [
      ...prev,
      { temp_id, text: input, sender: { username: userData.username }, pending: true },
    ]);
    setInput("");

    try {
      await axios.post(
        `${config.apiUrl}/messages`,
        { chat_id, message: input, temp_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <div
            key={msg.id || msg.temp_id || i}
            className={`message ${
              msg.sender.username === userData.username ? "sent" : "received"
            }`}
          >
            <div className="d-flex align-items-center">
              <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
              {msg.pending && <span className="ms-2 pending-dot" title="Sending…" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-box d-flex">
        <textarea
          className="form-control"
          placeholder="Type a message…"
          value={input}
          rows={1}
          maxLength={2000}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary ms-2" onClick={sendMessageHandler}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
