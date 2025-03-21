import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: "Ritesh",
    pwd: "1234",
  });
  const [userDetails, setUserDetails] = useState({
    email: "",
    userId: "",
    allowedPages: [],
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        userDetails,
        setUserDetails,
        isAuthenticated,
        setIsAuthenticated,
        setIsAdmin,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
