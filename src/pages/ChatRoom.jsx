import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const { chatId } = useParams();

  return (
    <div>
      <h2>Chat Room: {chatId}</h2>
      <p>Messages will be displayed here...</p>
    </div>
  );
};

export default ChatRoom;
