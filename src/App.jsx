import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Chat from "./pages/chat/Chat";
import ChatRoom from "./pages/ChatRoom";
import Profile from "./components/Profile";
// import Settings from "./pages/Settings";
import NotFound from "./pages/notfound/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Only for authenticated users */}
        <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
