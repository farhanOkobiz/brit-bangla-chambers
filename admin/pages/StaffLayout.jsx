import StaffSidebar from "../components/StaffSidebar";


const StaffLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
};

export default StaffLayout;