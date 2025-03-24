import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({userData}) => {
  return !userData ? <Outlet /> : <Navigate to="/chat" />;
};

export default PublicRoute;
