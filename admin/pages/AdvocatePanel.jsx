// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import AdvocateLayout from "./AdvocateLayout";
import { Card } from "antd";

function AdvocatePanel() {
  return (
    <AdvocateLayout>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </AdvocateLayout>
  );
}

export default AdvocatePanel;
