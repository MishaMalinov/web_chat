import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../cofing";
import { v4 as uuidv4 } from "uuid"; 
import { FiSend, FiPaperclip } from "react-icons/fi";
import { motion , AnimatePresence } from "framer-motion";
import FileUploadModal from './FileUploadModal';
const CACHE_LIMIT = 50; //  how many to keep
const ChatWindow = ({ chat_id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userData } = useAuth();
  const token = localStorage.getItem("token");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [showUpload, setShowUpload] = useState(false);   

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
  
    files.forEach(async (file) => {
      const temp_id = uuidv4();
  
      // Add pending message for file
      setMessages((prev) => [
        ...prev,
        {
          temp_id,
          attachment: {
            name: file.name,
            size: file.size,
          },
          sender: { username: userData.username },
          pending: true,
        },
      ]);
  
      const formData = new FormData();
      formData.append("files[]", file);
      formData.append("chat_id", chat_id);
      formData.append("temp_id", temp_id);
  
      try {
        await axios.post(`${config.apiUrl}/upload-files`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        // The actual update will be handled via WebSocket response
      } catch (err) {
        console.error("Upload failed:", err);
      }
    });
  
    setShowUpload(false);
  };
  
  
  
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
              {!msg.text && (
                 <a className="text-white" href={msg.attachment.path}>File</a>
              )}
              <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
              {msg.pending && <span className="ms-2 pending-dot" title="Sending…" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-box d-flex ">
        <textarea
          className="form-control flex-grow-1"
          placeholder="Type a message…"
          value={input}
          rows={1}
          maxLength={2000}
          onChange={(e) => setInput(e.target.value)}
        />
        <AnimatePresence initial={false} mode="wait">
          {!input ? (
            <motion.button
              key="attach"
              className="btn btn-primary ms-2"
              initial={{ y: -20, opacity: 0 }}        
              animate={{ y: 0,  opacity: 1 }}
              exit={{    y: -20, opacity: 0 }}      
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setShowUpload(true)}
              title="Attach file"
            >
              <FiPaperclip size={22} />
            </motion.button>
          ) : (
            <motion.button
              key="send"
              className="btn btn-primary ms-2"
              onClick={sendMessageHandler}
              initial={{ y: 20, opacity: 0 }}       
              animate={{ y: 0,  opacity: 1 }}
              exit={{    y: 20, opacity: 0 }}      
              transition={{ duration: 0.2, ease: "easeOut" }}
              title="Send"
            >
              <FiSend size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <FileUploadModal
        show={showUpload}
        onClose={() => setShowUpload(false)}
        onFiles={handleFiles}
      />
    </div>
  );
};

export default ChatWindow;
