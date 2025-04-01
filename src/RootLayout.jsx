import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Grid, Icon } from "semantic-ui-react";
import Menubar from "./Components/Menu";
import SidebarCom from "./Components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { toast } from "react-toastify";
import LoginPage, { getCurrentUser } from "./Pages/Authentication/Login/Login";

export default function RootLayout() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState("");
  const { userDetails, setUserDetails, setIsAuthenticated } = useAuth();

  const handleItemClick = (e, name) => {
    setActiveItem(name);
    setVisible(true);
    // navigate(`${name}`);
    // e.stopPropagation();
  };
  useEffect(() => {
    let tkn = localStorage.getItem("token");
    let token = parseJwt(tkn);
    console.log(token);
    let userName = localStorage.getItem("user");
    setUser(userName);
    setUserDetails(token);
  }, [user]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      return {};
    }
  };

  function handleLogout() {
    setUserDetails({});
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("User Logged Out");
    navigate("/");
  }

  return (
    <>
      <div className="bg-gray-800 flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src="https://cdn1.iconfinder.com/data/icons/user-interface-2311/24/menu_open_menu_menu_bar_three_lines_ui-512.png"
            className="h-10 w-10 cursor-pointer"
            onClick={() => setVisible(!visible)}
          />
        </div>
        <div className=" text-center">
          <Menubar activeItem={activeItem} handleItemClick={handleItemClick} />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white text-xl">{user}</span>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-white text-xl"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="h-screen w-screen flex">
        <SidebarCom
          visible={visible}
          change={setVisible}
          sidemenu2={activeItem}
        />
        <div className="flex-grow bg-white p-4">
          {/* Main content goes here */}
        </div>
      </div>
    </>
  );
}

export const Logged = () => {
  const { isAuthenticated } = useAuth();
  let logged = getCurrentUser();

  return <>{logged ? <RootLayout /> : <LoginPage />}</>;
};
