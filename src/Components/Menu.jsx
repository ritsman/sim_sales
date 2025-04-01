import { Menu } from "semantic-ui-react";
import { useEffect, useReducer } from "react";
import { NavLink } from "react-router-dom";

export default function Menubar({ activeItem, handleItemClick }) {
  return (
    <>
      <div className="flex space-x-4 ">
        <NavLink
          to="dashboard"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "dashboard")}
          >
            Dashboard
          </p>
        </NavLink>
        <NavLink
          to="gallery"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "gallery")}
          >
            Gallery
          </p>
        </NavLink>
        <NavLink
          to="sales"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "sales")}
          >
            Sales
          </p>
        </NavLink>
        <NavLink
          to="workorder"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "workorder")}
          >
            Work Order
          </p>
        </NavLink>
        <NavLink
          to="material"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "material")}
          >
            Material
          </p>
        </NavLink>
        <NavLink
          to="inventory"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "inventory")}
          >
            Inventory
          </p>
        </NavLink>
        <NavLink
          to="finance"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "finance")}
          >
            Finance
          </p>
        </NavLink>
        <NavLink
          to="master"
          className={({ isActive }) =>
            ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
          }
        >
          <p
            className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            onClick={(e) => handleItemClick(e, "master")}
          >
            Master
          </p>
        </NavLink>
      </div>
    </>
  );
}

//  <Menu.Item
//    name="dashboard"
//    active={activeItem === "dashboard"}
//    onClick={handleItemClick}
//  >
//    Dashboard
//  </Menu.Item>;
