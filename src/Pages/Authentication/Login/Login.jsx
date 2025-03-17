import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth.js";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import config from "../../../config.jsx";

const isValidToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log(decoded);
    return decoded.exp > currentTime; // Check if token is expired
  } catch (error) {
    return false;
  }
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("users");
  if (token) {
    console.log("valid token");
    return token;
  }
  return null;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userDetails, setUserDetails, setIsAuthenticated, setIsAdmin } =
    useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  function setLocalStorage(token, name) {
    // localStorage.setItem("token", token);
    localStorage.setItem("users", "abc");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalStorage();
  const currentPath = window.location.pathname;

  if (currentPath === "/") {
    // If already on "/", refresh the page
    window.location.reload();
  } else {
    // Otherwise, navigate to "/"
    navigate("/");
  }    // console.log({
    //   user: email,
    //   password,
    // });
    // try {
    //   let response = await axios.post(
    //    `${config.API_URL}/api/auth/login`,
    //     {
    //       user: email,
    //       password,
    //     }
    //   );
    //   console.log(response.data);
    //   const authToken = response.data;
    //   const decodedToken = parseJwt(authToken);

    //   if (decodedToken.role == "admin") {
    //     setIsAdmin(true);
    //   } else {
    //     setIsAdmin(false);
    //   }

    //   setUserDetails({
    //     name: decodedToken.name,
    //     userName: decodedToken.user,
    //     id: decodedToken._id,
    //     role: decodedToken.role,
    //   });
    //   console.log(decodedToken);
    //   setIsAuthenticated(true);
    //   setLocalStorage(authToken, decodedToken.name);
    //   toast.success("successfully Logged In");
    //   navigate("/");
    // } catch (error) {
    //   console.log("login error", error);
    //   if (error.response) {
    //     toast.error(error.response.data);
    //   } else {
    //     toast.error(error.message);
    //   }
    // }
  }

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      return {};
    }
  };

  function handleSignup() {
    navigate("signup");
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-600">
      <div className="w-full md:pt-24  pb-0 max-w-md">
        <div className="bg-gray-800 shadow-md rounded-xl md:px-8 px-4  pb-10 mb-4">
          <form onSubmit={handleSubmit}>
            <div className=" flex items-center justify-center pt-10">
              <div className="bg-gray-900 rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center">
                    <svg
                      className="text-gray-400 w-12 h-12"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                      <svg
                        className="text-gray-400 w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                      <svg
                        className="text-gray-400 w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-gray-600 h-3 w-3"
                      />
                      <label className="ml-2 text-gray-400 text-sm">
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-gray-500 text-sm hover:text-gray-400"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full">
                    LOGIN
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className=" text-center">
            <span className="text-gray-600">Don't have an account?</span>{" "}
            <Link
              to="/signup"
              className="text-indigo-500 hover:text-indigo-700 font-semibold"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
