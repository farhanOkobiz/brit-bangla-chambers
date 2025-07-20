import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "../auth/AuthContext";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </React.StrictMode>
);
