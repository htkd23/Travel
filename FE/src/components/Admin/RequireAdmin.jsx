import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    let roles = decoded.roles || [];

    // ✅ Thêm ROLE_ nếu thiếu
    roles = roles.map(role => role.startsWith("ROLE_") ? role : "ROLE_" + role);

    if (!roles.includes("ROLE_ADMIN")) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default RequireAdmin;
