import { useAuth } from "../context/AuthContext";
import { useState, useEffect,useRef } from "react";
import axios from "axios";
import config from "../cofing";

const ChatWindow = ({ chat_id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userData } = useAuth();
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  useEffect(() => {
    if (!chat_id) {
      setMessages([]);
      return;
    }

    const fetchChatContent = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/chat-content?chat_id=${chat_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data); 
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchChatContent();
  }, [chat_id]);
  useEffect(() => {
    // Connect to WebSocket
    if (socketRef.current) {
      socketRef.current.close();
    }
    const socket = new WebSocket(config.wssUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Subscribe to current chat_id
      socket.send(JSON.stringify({ action: "subscribe", chat_id }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [chat_id]);
  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageHandler = async () => {
    if (input.trim() === "") return;

    try {
      await axios.post(`${config.apiUrl}/messages`, {
        chat_id: chat_id,
        message: input,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  // Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender.username === userData.username ? "sent" : "received"}`}
          >
            {msg.content || msg.text}
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
        />
        <button className="btn btn-primary ms-2" onClick={sendMessageHandler}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
