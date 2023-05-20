import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRouteElement({ component: Component, ...props }) {
  return props.isLoggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to="/sign-in" />
  );
}

export default ProtectedRouteElement;
