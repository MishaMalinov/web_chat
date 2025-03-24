import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({userData}) => {
  console.log("private room")
  console.log(userData)
  return userData ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
