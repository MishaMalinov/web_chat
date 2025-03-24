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
import fetchProfile from "./utils/useFetchProfile";
import PublicRoute from "./components/PublicRoute";
import LoadingScreen from "./pages/loading/LoadingScreen";

const App = () => {
  // const [userData,setUserData] = useState(null);
  
  const [fetched, setFetched] = useState(true);
  preventSwipe();
  const {userData,loading} = fetchProfile();

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
          <Route path="/chat" element={<Chat userData={userData}/>} />
          <Route path="/chat/:username" element={<Chat userData={userData}/>} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
