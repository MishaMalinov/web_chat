import { Modal, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import "../assets/user-info.css"; // Import the new stylesheet

const UserInfo = ({ show, handleClose }) => {
  const [user, setUser] = useState({
    avatar: null,
    fullName: "John Doe", // Full name
    username: "JohnDoe",
    email: "johndoe@example.com"
  });




  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="userinfo-container">
        {/* Avatar Section */}
        <div className="userinfo-avatar text-center">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="userinfo-avatar-img" />
          ) : (
            <FaUserCircle size={100} className="userinfo-avatar-icon" />
          )}
        </div>

        {/* Full Name */}
        {user.fullName && (
          <div className="userinfo-detail">
            <label className="userinfo-label">Full Name</label>
            <p className="userinfo-text">{user.fullName}</p>
          </div>
        )}

        {/* Username */}
        <div className="userinfo-detail">
          <label className="userinfo-label">Username</label>
          <p className="userinfo-text">@{user.username}</p>
        </div>

        {/* Email */}
        {user.email && (
          <div className="userinfo-detail">
            <label className="userinfo-label">Email</label>
            <p className="userinfo-text">{user.email}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserInfo;
