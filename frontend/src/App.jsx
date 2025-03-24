import { useEffect, useState} from "react";
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
import preventSwipe from "./utils/preventSwipe";
import fetchProfile from "./utils/fetchProfile";
import PublicRoute from "./components/PublicRoute";
import LoadingScreen from "./pages/loading/LoadingScreen";

const App = () => {
  // const [userData,setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  preventSwipe();
  const userData = fetchProfile();

  useEffect(() => {
    if(userData){
      setLoading(false);
    }
  }, [userData]);

  if(loading){
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute userData={userData}/>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Protected Routes - Only for authenticated users */}
        <Route element={<PrivateRoute userData={userData}/>}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:username" element={<Chat />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
