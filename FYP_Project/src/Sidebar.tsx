import RoleSelector from "./RoleSelector";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import './title.css'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
  Building2,
  Plus,
  LogOut,
  Star,
  Bookmark,
  FileText
} from "lucide-react";
import { useState } from "react";
export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const role = localStorage.getItem("role") || "jobseeker";

  const menu =
    role === "jobseeker"
      ? [
        {
          label: "Dashboard",
          path: "/jobSeeker/Dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Profile",
          path: "/profile",
          icon: User,
        },
        {
          label: "My Applications",
          path: "/jobSeeker/applications",
          icon: FileText,
        },
        {
          label: "Saved Jobs",
          path: "/jobSeeker/savedJobs",
          icon: Bookmark,
        },
        {
          label: "My Reviews",
          path: "/jobSeeker/myReviews",
          icon: Star,
        },
      ]
      : [
        {
          label: "Dashboard",
          path: "/employer",
          icon: LayoutDashboard,
        },
        {
          label: "View My Companies",
          path: "/viewMyCompanies",
          icon: Building2,
        },
        {
          label: "Add Company",
          path: "/addcompanies",
          icon: Plus,
        },
      ];

  const handleLogout = () => {
    // clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // redirect to login
    navigate("/login");
  };

  return (
    <Card
      className={`
    ${collapsed ? "w-20" : "w-64"}
    h-screen
    rounded-none
    border-r
    p-4
    flex
    flex-col
    sticky
    top-0
    transition-all
    duration-300
  `}
    >
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Role Switcher */}
      {!collapsed && <RoleSelector />}

      <Separator />

      {collapsed ? (
        <div className="flex justify-center py-2">
          <div className="rounded-md bg-muted px-2 py-1 text-[10px] font-semibold uppercase">
            {role === "jobseeker" ? "JS" : "EMP"}
          </div>
        </div>
      ) : (
        <h2 className="text-lg font-semibold capitalize text-black! dark:text-white!">
          {role} Panel
        </h2>
      )}
      {/* Menu */}
      <div className="flex flex-col gap-2 flex-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Button
              key={item.path}
              variant="ghost"
              className={
                collapsed
                  ? "justify-center px-2"
                  : "justify-start gap-2"
              }
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-5 w-5 shrink-0" />

              {!collapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </div>

      {/* LOGOUT BUTTON */}
      <Separator />

      <Button
        variant="destructive"
        onClick={handleLogout}
        className={collapsed ? "px-2" : "w-full"}
      >
        <LogOut className="h-5 w-5" />

        {!collapsed && <span>Logout</span>}
      </Button>

    </Card>
  );
}