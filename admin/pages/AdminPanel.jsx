import { Card } from "antd";
import AdminLayout from "./AdminLayout";
import { Outlet } from "react-router-dom";

function AdminPanel() {
  return (
    <Card title="Dashboard">
      <div className="flex min-h-screen">
        <AdminLayout />
        <div className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </Card>
  );
}

export default AdminPanel;