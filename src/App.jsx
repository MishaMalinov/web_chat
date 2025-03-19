import { useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/app.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Chat from "./pages/chat/Chat";
import Profile from "./components/Profile";
// import Settings from "./pages/Settings";
import NotFound from "./pages/notfound/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {

  useEffect(() => {
    const preventSwipeBack = (event) => {
      if (event.touches[0].clientX < 50 && event.touches[0].clientY > 60) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventSwipeBack, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventSwipeBack);
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Only for authenticated users */}
        <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:username" element={<Chat />} />
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
