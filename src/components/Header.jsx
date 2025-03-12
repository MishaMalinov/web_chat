import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // For user icons
// import '../styles/Chat.css';

const Header = ({ user, interlocutor }) => {
  return (
    <div className="header d-flex justify-content-between align-items-center p-3 shadow">
      <div className="d-flex align-items-center">
        <Link to="/profile" className="d-flex align-items-center text-decoration-none text-dark">
          <FaUserCircle size={40} className="me-2" />
          <span>{user.name}</span>
        </Link>
      </div>
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
