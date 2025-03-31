import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import config from "../../cofing";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import ProfileModal from "../../components/Profile";
import Search from "../../components/Search";
import UserInfo from "../../components/UserInfo";
import { FaBars } from "react-icons/fa"; 

import "./chat.css";

const Chat = () => {
  const { userData } = useAuth();
  const token = localStorage.getItem("token");

  const { username } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Fetch user's chat list
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/get-chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(res.data.chats || []);
      } catch (e) {
        console.error("Error fetching chats:", e);
      }
    };
    fetchChats();
  }, [token]);

  // Whenever chat list or username changes, update selected user
  useEffect(() => {
    if (!username) return setSelectedUser(null);
    if (chats.length > 0) {
      const foundUser = chats.find((u) => u.username === username);
      setSelectedUser(foundUser || null);
    }
  }, [chats, username]);

  // When user selects a chat from sidebar
  const selectUserHandler = (chat) => {
    navigate(`/chat/${chat.username}`);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="chat-page">
      <Header
        userData={userData}
        interlocutor={selectedUser}
        onProfileClick={() => setShowProfileModal(true)}
        onUserInfoClick={() => setShowUserInfoModal(true)}
        setShowSearchModal={() => setShowSearchModal(true)}
      />

      {/* Sidebar Toggle (mobile) */}
      <button
        className="toggle-sidebar btn btn-light d-md-none"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars size={24} />
      </button>

      <div className="d-flex chat-container">
        <Sidebar
          users={chats}
          onSelectUser={selectUserHandler}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onProfileClick={() => setShowProfileModal(true)}          
          userData={userData}
          onSearchClick={() => setShowSearchModal(true)}
        />
        <ChatWindow selectedUser={selectedUser} />
      </div>

      {/* Modals */}
      <ProfileModal
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
        userData={userData}
      />
      <UserInfo
        show={showUserInfoModal}
        handleClose={() => setShowUserInfoModal(false)}
      />
      <Search
        show={showSearchModal}
        handleClose={() => setShowSearchModal(false)}
      />
    </div>
  );
};

export default Chat;
