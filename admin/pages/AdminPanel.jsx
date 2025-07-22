import AdminLayout from "./AdminLayout";
import { Outlet } from "react-router-dom";

function AdminPanel() {
  return (
    <AdminLayout>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </AdminLayout>
  );
}

export default AdminPanel;
