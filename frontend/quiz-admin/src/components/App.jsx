import { useAuth } from "./auth/AuthContext";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
