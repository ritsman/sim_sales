import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ACTIVE_COLOR = "bg-[#29a36c]"; // Active background color
const INACTIVE_COLOR = "bg-[#145236]"; // Inactive background color
const HOVER_COLOR = "hover:bg-[#0c3f26]"; // Hover background color

export default function Menubar({ handleItemClick }) {
  const menuItems = [
    { name: "home", icon: <FaHome className="text-white" /> },
    { name: "dashboard" },
    { name: "scheduler" },
    { name: "gallery" },
    { name: "sales" },
    { name: "workorder" },
    { name: "material" },
    { name: "inventory" },
    { name: "finance" },
    { name: "master" },
    { name: "shipment" },
  ];

  return (
    <div className="flex space-x-4">
      {menuItems.map(({ name, icon }) => (
        <NavLink
          key={name}
          to={name === "home" ? "/" : name}
          className={({ isActive }) =>
            `${isActive ? ACTIVE_COLOR : INACTIVE_COLOR} rounded-md`
          }
        >
          <p
            className={`flex items-center gap-2 text-white px-2 py-1 rounded-md transition-colors duration-200 ${HOVER_COLOR}`}
{/*             onClick={(e) => handleItemClick(e, name === "home" ? "/" : name)} */}
          >
            {icon} {name.charAt(0).toUpperCase() + name.slice(1)}
          </p>
        </NavLink>
      ))}
    </div>
  );
}
