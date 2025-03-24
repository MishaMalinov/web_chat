import { useState } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Button } from "react-bootstrap";
// import Search from "./Search";

const Header = ({ user, interlocutor, onProfileClick, onUserInfoClick,setShowSearchModal }) => {
  // const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center p-3 shadow">
        {/* Left - My Profile */}
        <div className="d-flex align-items-center">
          <span className="profile-link d-none d-md-flex" onClick={onProfileClick}>
            <FaUserCircle size={40} className="me-2" />
            <span>{user.name}</span>
          </span>
        </div>

        {/* Center - Global Search Button */}
        <Button variant="outline-primary" className="me-3 d-none d-md-block" onClick={() => setShowSearchModal(true)}>
          <FaSearch size={20} className="me-2" /> Global Search
        </Button>

        {/* Right - Interlocutor Profile */}
        <div className="d-flex align-items-center user-info-link" onClick={onUserInfoClick}>
          {interlocutor && (
            <>
              <FaUserCircle size={40} className="me-2" />
              <span>{interlocutor.name}</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
