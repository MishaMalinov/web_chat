import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

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

  const { chat_id } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  
  const { setSelectedUser} = useChat();

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

  // Whenever chat list or chat_id changes, update selected user
  useEffect(() => {
    if (!chat_id) return setSelectedUser(null);
    if (chats.length > 0) {
      const foundUser = chats.find((u) => u.chat_id.toString() === chat_id);
      console.log(foundUser)
      setSelectedUser(foundUser || null);
    }
  }, [chats, chat_id]);

  // When user selects a chat from sidebar
  const selectUserHandler = (chat) => {
    navigate(`/chat/${chat.chat_id}`);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="chat-page">
      <Header
        userData={userData}
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
        <ChatWindow chat_id={chat_id} />
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
