import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { userData } = useAuth();
  return !userData ? <Outlet /> : <Navigate to="/chat" />;
};

export default PublicRoute;
