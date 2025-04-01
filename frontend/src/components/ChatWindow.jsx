import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../cofing";

const ChatWindow = ({ chat_id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { userData } = useAuth();
  const token = localStorage.getItem("token");

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

  const sendMessageHandler = async () => {
    if (input.trim() === "") return;

    try {
      const response = await axios.post(`${config.apiUrl}/messages`, {
        chat_id: chat_id,
        message: input,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages((prev) => [...prev, response.data]);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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
