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
  const token = localStorage.getItem("simToken");
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

  function setLocalStorage(token, email) {
    localStorage.setItem("simToken", token);
    localStorage.setItem("simUser", email);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let response = await axios.post(
       `${config.API_URL}/api/auth/login`,
        {
          email: email,
          password,
        }
      );
      console.log(response.data);
      const authToken = response.data.token;
      const decodedToken = parseJwt(authToken);

      setUserDetails({
        email: decodedToken.email,
        id: decodedToken.userId,
        allowedPages: decodedToken.allowedPages,
      });
      console.log(decodedToken);
      setIsAuthenticated(true);
      setLocalStorage(authToken, decodedToken.email);
      toast.success("successfully Logged In");
      navigate("/");
    } catch (error) {
      console.log("login error", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
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
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="w-full md:pt-8 pb-0 max-w-md">
        <div className="bg-[#0d4a2b] shadow-xl rounded-xl md:px-8 px-6 pb-8 mb-4 border border-gray-200">
          {/* Logo section */}
          <div className="flex justify-center pt-8 pb-6">
            <div className="flex items-center">
              <div className="text-gray-200 uppercase text-2xl font-bold">
                Login
              </div>
            </div>
          </div>

          <form>
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              {/* <div className="text-green-800 text-xl font-semibold mb-6 text-center">
                Login to your account
              </div> */}

              {/* Username input */}
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="flex items-center bg-white rounded-md px-3 py-3 border border-green-600">
                  <svg
                    className="text-green-600 w-5 h-5 mr-3"
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    className="bg-white text-gray-800 placeholder-gray-400 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="flex items-center bg-white rounded-md px-3 py-3 border border-green-600">
                  <svg
                    className="text-green-600 w-5 h-5 mr-3"
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white text-gray-800 placeholder-gray-400 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-green-600" />
                  <label className="ml-2 text-gray-600 text-sm">
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-green-600 text-sm hover:text-green-800"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login button */}
              <button
                onClick={handleSubmit}
                className="bg-[#310b6b] hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-full transition duration-200"
              >
                LOGIN
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <span className="text-gray-200 text-sm">
              Don't have an account ?
            </span>{" "}
            <Link
              to="/signup"
              className="text-green-400 hover:text-green-500 text-sm font-medium"
            >
              Register Here
            </Link>
          </div>
        </div>

        {/* <div className="text-center text-gray-500 text-xs">
          © 2025 Sales Management System. All rights reserved.
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
