// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react/prop-types
const ProtectedAdminRoute = ({ element: Component }) => {
  const token = localStorage.getItem("user-token");
  const isAuthenticated = !!token;

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Failed to decode token", error);
      return true;
    }
  };

  if (!isAuthenticated || isTokenExpired(token)) {
    localStorage.removeItem("user-token"); // Remove expired token
    localStorage.removeItem("user-details"); // Remove expired token
    return <Navigate to="/" replace />;
  }

  return Component;
};

export default ProtectedAdminRoute;
