import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { userData } = useAuth();
  return userData ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
