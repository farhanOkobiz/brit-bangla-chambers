// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/SideBar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet /> {/* Renders nested route component like CategoryForm */}
      </main>
    </div>
  );
};

export default Dashboard;
