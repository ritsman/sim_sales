import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { ProgressBarComponent } from "@syncfusion/ej2-react-progressbar";
import "../../css/Master/master.css";
import { registerLicense } from "@syncfusion/ej2-base";

import "../../css/Master/master-common.css";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NAaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjW39WcHJQRmNaUEx/WQ=="
);

export default function Master() {
  const { auth, setAuth, userDetails } = useAuth();
  // console.log("++++++++++++++++++++");
  // console.log(auth);
  // console.log("++++++++++++++++++++++++++");
  const handleC = () => {
    setAuth({
      user: "Kej",
      pwd: "89",
    });
  };
  function Logged({ user, comp }) {
    if (user === "admin") {
      return <>{comp}</>;
    } else {
      return <>{comp}</>;
    }
  }
  return <Logged user={userDetails.role} comp={<Outlet />} />;
}
