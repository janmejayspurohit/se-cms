import React from "react";
import { Outlet } from "react-router-dom";
import api from "../services/api";
import { redirectToLogin, useAuth } from "../services/auth";

function WithAdmin() {
  const { user = null, token } = useAuth();
  api.setHeader(token);

  return user && user.role === "admin" ? <Outlet /> : redirectToLogin();
}

export default WithAdmin;
