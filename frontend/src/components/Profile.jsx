import { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "../assets/profile.css";
import axios from "axios";
import config from '../cofing.js';
const Profile = ({ show, handleClose,userData }) => {
  const [newBio, setNewBio] = useState(userData.bio??"")
  const [newAvatar, setNewAvatar] = useState(null);
  const [newName, setNewName] = useState(userData.name??"");
  const [newUsername, setNewUsername] = useState(userData.username);
  const [newEmail, setNewEmail] = useState(userData.email);
  const avatarInputRef = useRef(null);
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
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
  
      formData.append("name", newName);
      formData.append("username", newUsername);
      formData.append("email", newEmail);
      formData.append("bio", newBio);
      if (avatarInputRef.current?.files[0]) {
        formData.append("avatar", avatarInputRef.current.files[0]);
      }
  
      await axios.post(`${config.apiUrl}/user-update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
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
          {newAvatar || userData.avatar ? (
            <img src={newAvatar || userData.avatar} alt="Avatar" className="avatar-img" />
          ) : (
            <FaUserCircle size={100} className="avatar-icon" />
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="form-control mt-2" ref={avatarInputRef}/>
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
        {/* <div className="form-group mt-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div> */}
        {/* Bio Input */}
        <div className="form-group mt-3">
          <label>Bio</label>
          <input
            type="text"
            className="form-control"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Enter your bio"
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
