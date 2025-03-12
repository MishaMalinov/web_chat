import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";


const Sidebar = ({ users, onSelectUser, isOpen }) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`sidebar p-3 shadow ${isOpen ? "show-sidebar" : "hide-sidebar"}`}>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="list-group">
        {filteredUsers.map(user => (
          <li
            key={user.id}
            className="list-group-item d-flex align-items-center"
            onClick={() => onSelectUser(user)}
          >
            <FaUserCircle size={30} className="me-2" />
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
