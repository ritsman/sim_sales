import { NavLink } from "react-router-dom";

const ACTIVE_COLOR = "bg-[#29a36c]"; // Active background color
const INACTIVE_COLOR = "bg-[#145236]"; // Inactive background color
const HOVER_COLOR = "bg-[#0c3f26]"; // Hover background color1F7D53

export default function Menubar({ handleItemClick }) {
  const menuItems = [
    "dashboard",
    "gallery",
    "sales",
    "workorder",
    "material",
    "inventory",
    "finance",
    "master",
  ];

  return (
    <div className="flex space-x-4">
      {menuItems.map((item) => (
        <NavLink
          key={item}
          to={item}
          className={({ isActive }) =>
            `${isActive ? ACTIVE_COLOR : INACTIVE_COLOR} rounded-md`
          }
        >
          <p
            className={`text-white px-4 py-2 rounded-md transition-colors duration-200 ${
              // Apply hover effect using Tailwind CSS
              `hover:${HOVER_COLOR}`
            }`}
            onClick={(e) => handleItemClick(e, item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)} {/* Capitalize the first letter */}
          </p>
        </NavLink>
      ))}
    </div>
  );
}
