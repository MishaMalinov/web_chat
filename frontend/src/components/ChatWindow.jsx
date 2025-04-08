import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../cofing";
import { v4 as uuidv4 } from "uuid"; 

const ChatWindow = ({ chat_id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userData } = useAuth();
  const token = localStorage.getItem("token");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch existing messages
  useEffect(() => {
    if (!chat_id) {
      setMessages([]);
      return;
    }

    const fetchChatContent = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/chat-content?chat_id=${chat_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchChatContent();
  }, [chat_id]);

  // WebSocket
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    const socket = new WebSocket(config.wssUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(JSON.stringify({ action: "subscribe", chat_id }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      // If the message was already shown locally (pending), replace it
      setMessages((prev) => {
        // Replace pending message if temp_id matches
        if (message.temp_id && message.sender?.username === userData.username) {
          return prev.map((m) =>
            m.temp_id === message.temp_id ? { ...message, pending: false } : m
          );
        }

        // For received messages (from others), just add
        if (message.sender?.username !== userData.username) {
          return [...prev, { ...message, pending: false }];
        }

        // Otherwise, don't change anything
        return prev;
      });
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => socket.close();
  }, [chat_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message handler
  const sendMessageHandler = async () => {
    if (input.trim() === "") return;

    const temp_id = uuidv4();
    const localMessage = {
      temp_id,
      content: input,
      sender: { username: userData.username },
      pending: true,
    };

    setMessages((prev) => [...prev, localMessage]);
    setInput("");

    try {
      await axios.post(
        `${config.apiUrl}/messages`,
        {
          chat_id: chat_id,
          message: input,
          temp_id: temp_id, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally, show error state
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={msg.id || msg.temp_id || index}
            className={`message ${msg.sender.username === userData.username ? "sent" : "received"}`}
          >
            <div className="d-flex align-items-center">
              <span>{msg.content || msg.text}</span>
              {msg.pending && (
                <span className="ms-2 pending-dot" title="Sending..."></span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
        />
        <button className="btn btn-primary ms-2" onClick={sendMessageHandler}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
