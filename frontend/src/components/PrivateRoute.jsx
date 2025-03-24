import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({userData}) => {
  return userData ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
