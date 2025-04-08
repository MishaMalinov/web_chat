import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useChat } from "../context/ChatContext";

const Header = ({ userData, onProfileClick, onUserInfoClick,setShowSearchModal }) => {
  const {selectedUser} = useChat();
  return (
    <>
      <div className="header d-flex justify-content-between align-items-center p-3 shadow">
        {/* Left - My Profile */}
        <div className="d-flex align-items-center">
          <span className="profile-link d-none d-md-flex" onClick={onProfileClick}>
            {userData && userData.avatar ? (<img src={userData.avatar} alt="Avatar" className="avatar-img"/>):(<FaUserCircle size={40} className="me-2" />)}
            
            <span className="truncated-text" title={userData.name??userData.username}>{userData.name??userData.username}</span>
          </span>
        </div>

        {/* Center - Global Search Button */}
        <Button variant="outline-primary" className="me-3 d-none d-md-block" onClick={() => setShowSearchModal(true)}>
          <FaSearch size={20} className="me-2" /> Global Search
        </Button>

        {/* Right - Interlocutor Profile */}
        <div>
          {selectedUser && selectedUser.username !== userData.username && (
            <div className="d-flex align-items-center profile-link" onClick={onUserInfoClick}>
              {selectedUser.avatar ? (<img src={selectedUser.avatar} alt="Avatar" className="avatar-img"/>):(<FaUserCircle size={40} className="me-2" />)}
              <span>{selectedUser.name}</span>
            </div>
          )}
          {selectedUser && selectedUser.username === userData.username && (
            <div className="d-flex align-items-center profile-link">
              Saved Messages
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
