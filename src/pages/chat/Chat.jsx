import { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import ProfileModal from "../../components/Profile";
import { FaBars } from "react-icons/fa"; // Importing an icon for toggle
import './chat.css';

const ChatPage = () => {
  const currentUser = { id: 1, name: "Myself" };
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state

  const [showProfile, setShowProfile] = useState(false); // Profile Modal State
  const users = [
    currentUser,
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
    { id: 4, name: "Charlie" }
  ];

  return (
    <div className="chat-page">
      <Header user={currentUser} interlocutor={selectedUser} onProfileClick={() => setShowProfile(true)} />
      
      {/* Sidebar Toggle Button (Visible on Small Screens) */}
      <button className="toggle-sidebar btn btn-light d-md-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FaBars size={24} />
      </button>

      <div className="d-flex chat-container">
        <Sidebar users={users} onSelectUser={setSelectedUser} isOpen={isSidebarOpen} />
        <ChatWindow selectedUser={selectedUser} />
      </div>

      {/* Profile Modal */}
      <ProfileModal show={showProfile} handleClose={() => setShowProfile(false)} />
    </div>
  );
};

export default ChatPage;
