import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}