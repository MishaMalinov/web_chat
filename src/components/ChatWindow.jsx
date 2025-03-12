import { useState } from "react";
// import '../styles/Chat.css';

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  return (
    <div className="chat-window p-3">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "me" ? "sent" : "received"}`}>
            {msg.text}
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
        <button className="btn btn-primary ms-2" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
