// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import AdvocateLayout from "./AdvocateLayout";
import { Card } from "antd";

function AdvocatePanel() {
  return (
    <Card title="Dashboard">
      <div className="flex min-h-screen">
        <AdvocateLayout />
        <div className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </Card>
  );
}

export default AdvocatePanel;
