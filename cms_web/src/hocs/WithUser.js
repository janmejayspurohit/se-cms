import React from "react";
import { Outlet } from "react-router-dom";
import api from "../services/api";
import { redirectToLogin, useAuth } from "../services/auth";

function WithUser() {
  const { user = null, token } = useAuth();
  api.setHeader(token);

  return user && user.role === "user" ? <Outlet /> : redirectToLogin();
}

export default WithUser;
