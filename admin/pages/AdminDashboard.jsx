// src/pages/Dashboard.jsx
import { Card } from "antd";
import AdminSidebar from "../components/AdminSideBar";

function Dashboard() {
  return (
    <Card title="Dashboard">
       <div>
        <aside>
          <AdminSidebar/>
        </aside>
        <div>
          where components will go
        </div>
       </div>
    </Card>
  );
}

export default Dashboard;