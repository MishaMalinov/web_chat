import { useState,useEffect } from "react";
// import '../styles/Chat.css';

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  useEffect(() => {
    setMessages([
      {text:'test1',sender: selectedUser},
      {text:'test2',sender: "me"},
      {text:'test3',sender: selectedUser},
      {text:'test4',sender: "me"},
      {text:'test5',sender: selectedUser},
      {text:'test6',sender: "me"},
      {text:'test7',sender: selectedUser},

    ])
    
  }, []);
  return (
    <div className="chat-window">
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
          onKeyDown={(e)=>{if(e.key === "Enter")sendMessage()}}
        />
        <button className="btn btn-primary ms-2" onClick={sendMessage} >Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
