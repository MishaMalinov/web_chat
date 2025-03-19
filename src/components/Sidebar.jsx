import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Button } from "react-bootstrap";


const Sidebar = ({ users, onSelectUser, isOpen, setIsOpen, onProfileClick, user, onSearchClick }) => {
  const [search, setSearch] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth < 768 ? "100%" : 250); // Default width
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

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


  // Handle Touch Start
  const handleTouchStart = (e) => {

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle Touch Move
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    handleTouchEnd();
  };

  // Handle Touch End (Detect Swipe)
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const swipeDistance = touchEndX.current - touchStartX.current;
      if (swipeDistance > 80) {
        setIsOpen(true); // Open Sidebar on Right Swipe
      } else if (swipeDistance < -80) {
        setIsOpen(false);
      }
    }

  };

  // Add Touch Event Listeners on Mobile
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleTouchEvents = () => {
      if (window.innerWidth < 768) {
        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      } else {
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      }
    };

    handleTouchEvents();
    window.addEventListener("resize", handleTouchEvents);

    return () => {

      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleTouchEvents);
    };
  }, []);


  return (
    <div
      ref={sidebarRef}
      className={`sidebar p-3 shadow ${isOpen ? "show-sidebar" : "hide-sidebar"}`}
      style={{ width: sidebarWidth }}
    >
      <div className="d-flex align-items-center mb-3">
        <span className="profile-link d-md-none d-flex" onClick={onProfileClick}>
          <FaUserCircle size={40} className="me-2" />
          <span>{user.name}</span>
        </span>
      </div>

      {/* Center - Global Search Button */}
      <Button variant="outline-primary" className="mb-3 d-md-none d-block" onClick={() => onSearchClick(true)}>
        <FaSearch size={20} className="me-2" /> Global Search
      </Button>

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