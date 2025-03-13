import { FaUserCircle } from "react-icons/fa";

const Header = ({ user, interlocutor, onProfileClick }) => {
  return (
    <div className="header d-flex justify-content-between align-items-center p-3 shadow">
      {/* Left - My Profile */}
      <div className="d-flex align-items-center">
        <span className="profile-link" onClick={onProfileClick}>
          <FaUserCircle size={40} className="me-2" />
          <span>{user.name}</span>
        </span>
      </div>

      {/* Right - Interlocutor Profile */}
      <div className="d-flex align-items-center">
        {interlocutor && (
          <>
            <FaUserCircle size={40} className="me-2" />
            <span>{interlocutor.name}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
