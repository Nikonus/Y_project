import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // While checking auth status, prevent flicker
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the requested page
  return <Outlet />;
};

export default ProtectedRoute;
