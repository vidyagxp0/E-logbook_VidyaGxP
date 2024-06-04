// ProtectedRoute.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem("user-token"); // Replace with your actual auth check
  return isAuthenticated ? Component : <Navigate to="/" replace />;
};

export default ProtectedRoute;
