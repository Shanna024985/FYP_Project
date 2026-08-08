import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { toast } from "sonner";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");

        toast.error("Session expired", {
          description: "Your session has expired. Please log in again.",
          action: {
            label: "Login",
            onClick: () => navigate("/login"),
          },
        });

        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);

      localStorage.removeItem("token");
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