import { useAuth } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Chat from "../pages/chat/Chat";
import NotFound from "../pages/notfound/NotFound";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import LoadingScreen from "../pages/loading/LoadingScreen";

const AppRoutes = () => {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Private routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chat/:chat_id" element={<Chat />} />
                </Route>

                {/* 404 catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;