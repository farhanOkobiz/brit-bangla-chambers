import AdvocateSideBar from "../components/AdvocateSidebar";

const AdvocateLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdvocateSideBar />
      <main className="w-full p-4 md:ml-0 lg:ml-64 transition-all">
        {children}
      </main>
    </div>
  );
};

export default AdvocateLayout;
