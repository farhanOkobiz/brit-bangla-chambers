// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import AdvocateLayout from "./AdvocateLayout";

function AdvocatePanel() {
  return (
    <AdvocateLayout>
      <Outlet />
    </AdvocateLayout>
  );
}

export default AdvocatePanel;
