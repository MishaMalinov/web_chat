import { Modal, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useChat } from "../context/ChatContext";
import "../assets/user-info.css"; // Import the new stylesheet

const UserInfo = ({ show, handleClose }) => {
  const { selectedUser } = useChat();
  
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="userinfo-container">
        {/* Avatar Section */}
        <div className="userinfo-avatar text-center">
          {selectedUser?.avatar ? (
            <img src={selectedUser.avatar} alt="User Avatar" className="userinfo-avatar-img" />
          ) : (
            <FaUserCircle size={100} className="userinfo-avatar-icon" />
          )}
        </div>

        {/* Username */}
        {selectedUser?.username && (
          <div className="userinfo-detail">
            <label className="userinfo-label">Username</label>
            <p className="userinfo-text">@{selectedUser.username}</p>
          </div>
        )}

        {/* Full Name */}
        {selectedUser?.name && (
          <div className="userinfo-detail">
            <label className="userinfo-label">Full Name</label>
            <p className="userinfo-text">{selectedUser.name}</p>
          </div>
        )}
        {/* Bio */}
        {selectedUser?.bio && (
          <div className="userinfo-detail">
            <label className="userinfo-label">Bio</label>
            <p className="userinfo-text">{selectedUser.bio}</p>
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
