import React from "react";
import "./index.css";

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider";
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXxfdXRdRmJeVkZ3XUo=');

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
   </React.StrictMode>
);
