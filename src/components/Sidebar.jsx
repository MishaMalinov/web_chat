import { useState,useRef } from "react";
import { FaUserCircle } from "react-icons/fa";


const Sidebar = ({ users, onSelectUser, isOpen }) => {
  const [search, setSearch] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth < 768 ? "100%" : 250); // Default width
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase())
  )
  // Handle Mouse Down (Start Resizing)
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevents selecting text while resizing

    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
  };

  // Handle Mouse Move (Resize)
  const handleMouseMove = (e) => {
    e.preventDefault(); // Prevents selecting text while resizing

    if (isResizing.current) { 
      const newWidth = e.clientX; // Get X coordinate
      if (newWidth > 180 && newWidth < 600) { // Limit min/max width
        setSidebarWidth(newWidth);
      }
    }
  };

  // Handle Mouse Up (Stop Resizing)
  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={sidebarRef}
      className={`sidebar p-3 shadow ${isOpen ? "show-sidebar" : "hide-sidebar"}`}
      style={{ width: sidebarWidth }}
    >
      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User List */}
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

      {/* Resizable Handle */}
      <div className="resize-handle" onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default Sidebar;