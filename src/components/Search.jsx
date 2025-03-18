import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

const Search = ({ show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const users  = [];
  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <li key={u.id} className="list-group-item d-flex align-items-center">
                <FaUserCircle size={30} className="me-2" />
                <span>{u.name}</span>
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
