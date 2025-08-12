
import { Outlet } from "react-router-dom";
import StaffLayout from "./StaffLayout";

function StaffPanel() {
  return (
    <StaffLayout>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </StaffLayout>
  );
}

export default StaffPanel;
