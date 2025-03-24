import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "../assets/profile.css";
import axios from "axios";

const Profile = ({ show, handleClose,userData }) => {
  const [user, setUser] = useState({
    avatar: null,
    username: "JohnDoe",
    email: "johndoe@example.com"
  });

  const [newAvatar, setNewAvatar] = useState(null);
  const [newName, setNewName] = useState(userData.name||"");

  const [newUsername, setNewUsername] = useState(userData.username);
  const [newEmail, setNewEmail] = useState(userData.email);

  // Handle Avatar Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Changes
  const handleSave = () => {
    setUser({
      avatar: newAvatar || user.avatar,
      username: newUsername,
      email: newEmail
    });
    alert("Profile updated successfully!");
    handleClose(); // Close modal after saving
  };

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  }
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="profile-container">
        {/* Avatar Section */}
        <div className="avatar-section">
          {newAvatar || user.avatar ? (
            <img src={newAvatar || user.avatar} alt="Avatar" className="avatar-img" />
          ) : (
            <FaUserCircle size={100} className="avatar-icon" />
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="form-control mt-2" />
        </div>

        {/* Name Input */}
        <div className="form-group mt-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        {/* Username Input */}
        <div className="form-group mt-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        {/* Email Input */}
        <div className="form-group mt-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Profile;
