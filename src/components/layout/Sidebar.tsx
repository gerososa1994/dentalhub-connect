import { Calendar, Home, Users, FileText, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Pacientes", path: "/patients" },
  { icon: Calendar, label: "Citas", path: "/appointments" },
  { icon: FileText, label: "Historiales", path: "/records" },
  { icon: Settings, label: "Configuración", path: "/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white border-r">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary transition-colors",
                isActive && "bg-primary-50 text-primary"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};