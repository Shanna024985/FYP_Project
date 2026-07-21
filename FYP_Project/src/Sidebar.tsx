import RoleSelector from "./RoleSelector";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import './title.css'
export default function Sidebar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "jobseeker";

  const menu =
    role === "jobseeker"
      ? [
          { label: "Dashboard", path: "/jobSeeker/Dashboard" },
          { label: "Profile", path: "/profile" }
          // TODO: Jobseeker future features:
          // { label: "Applications", path: "/jobSeeker/applications" },
          // { label: "Saved Jobs", path: "/jobSeeker/saved" },
        ]
      : [
          { label: "Dashboard", path: "/employer" },
          { label: "Add Company", path: "/addcompanies" },

          // TODO: Employer future features:
          // { label: "Applicants", path: "/jobApplicants" },
          // { label: "Company Profile", path: "/company" },
        ];

  const handleLogout = () => {
    // clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // redirect to login
    navigate("/login");
  };

  return (
    <Card className="w-64 h-screen rounded-none border-r p-4 flex flex-col sticky top-0">

      {/* Role Switcher */}
      <RoleSelector />

      <Separator />

      {/* Role Title */}
      <h2 className="text-lg font-semibold capitalize title-black">
        {role} Panel
      </h2>

      {/* Menu */}
      <div className="flex flex-col gap-2 flex-1">
        {menu.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="justify-start"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* LOGOUT BUTTON */}
      <Separator />

      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-full"
      >
        Logout
      </Button>

    </Card>
  );
}