import AdminSidebar from '../components/SideBar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-4 ml-0 md:ml-64">{children}</main>
    </div>
  );
};

export default AdminLayout;