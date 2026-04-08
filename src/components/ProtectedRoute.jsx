import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/ema-admin";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to={ADMIN_PATH} replace />;
  return children;
};

export default ProtectedRoute;
