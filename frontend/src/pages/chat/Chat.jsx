import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import ProfileModal from "../../components/Profile";
import Search from "../../components/Search";
import UserInfo from "../../components/UserInfo";
import { FaBars } from "react-icons/fa"; // Importing an icon for toggle
import './chat.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Chat = ({userData}) => {
  const { username } = useParams();// username is unique
  const currentUser = { id: 1, name: "Myself", username: "misha" };
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state
  const [users, setUsers] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false); // Profile Modal State
  const [showUserInfoModal, setShowUserInfoModal] = useState(false); // Profile Modal State
  const [showSearchModal, setShowSearchModal] = useState(false);

  const navigate = useNavigate();

  const selectUserHandler = (e) => {
    const username = e.username;
    navigate(`/chat/${username}`);

    // Hide sidebar only on phones (screen width < 768px)
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  };
  

  useEffect(() => {
    const fetchUsers = async () => {
      // Simulate fetching users from the backend
      const usersList = [
        currentUser,
        { id: 2, name: "Aliceeeeeeeeeeee", username: "alice" },
        { id: 3, name: "Bob", username: "bob" },
        { id: 4, name: "Charlie", username: "charlieXCX" },
      ];
      setUsers(usersList);
    };
    
    fetchUsers();
  }, []);

  // Wait for users to be set, then find the user
  useEffect(() => {
    if (users.length > 0) {
      const foundUser = users.find((u) => u.username === username);
      setSelectedUser(foundUser || null);
    }
  }, [users, username]); // Runs when users or username change


  return (
    <div className="chat-page">
      <Header userData={userData}
        interlocutor={selectedUser}
        onProfileClick={() => setShowProfileModal(true)}
        onUserInfoClick={() => setShowUserInfoModal(true)}
        setShowSearchModal={() => setShowSearchModal(true)}

      />

      {/* Sidebar Toggle Button (Visible on Small Screens) */}
      <button className="toggle-sidebar btn btn-light d-md-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FaBars size={24} />
      </button>

      <div className="d-flex chat-container">
        <Sidebar  users={users} 
                  onSelectUser={selectUserHandler} 
                  isOpen={isSidebarOpen} 
                  setIsOpen={setIsSidebarOpen}
                  onProfileClick={() => setShowProfileModal(true)} 
                  userData={userData} 
                  onSearchClick={()=>setShowSearchModal(true)}
        />
        <ChatWindow selectedUser={selectedUser} />
      </div>

      {/* Modals */}
      <ProfileModal show={showProfileModal} handleClose={() => setShowProfileModal(false)} userData={userData} />
      <UserInfo show={showUserInfoModal} handleClose={() => setShowUserInfoModal(false)} />
      <Search show={showSearchModal} handleClose={() => setShowSearchModal(false)} />

    </div>
  );
};

export default Chat;
