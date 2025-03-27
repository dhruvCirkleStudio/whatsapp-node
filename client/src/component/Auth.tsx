import React from "react";
import { Outlet, useNavigate } from "react-router";

export default function Auth() {
  const navigate = useNavigate();
  const auth = true;

  return <>{auth ? <Outlet /> : navigate("/auth/signUp")}</>;
}
