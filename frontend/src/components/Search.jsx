import axios from "axios";
import { useState,useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

const Search = ({ show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  // Filter users based on search input
  // const filteredUsers = users.filter((user) =>
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/search-users?query=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 1) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Global Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Search Input */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* User List */}
        <ul className="list-group">
          {users.length > 0 ? (
            users.map((u) => (
              <li key={u.id} className="list-group-item d-flex align-items-center">
                <FaUserCircle size={30} className="me-2" />
                <span>{u.username}</span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center text-muted">No users found</li>
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Search;
