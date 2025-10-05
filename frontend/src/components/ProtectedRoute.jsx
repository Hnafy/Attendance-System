// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie'

export default function ProtectedRoute({ children }) {
    let token = Cookies.get("token");
  const location = useLocation();

  if (!token) {
    // redirect to login but save where the user came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
