import AdvocateSideBar from "../components/AdvocateSidebar";

const AdvocateLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdvocateSideBar />
      <main className="flex-1 p-4 ml-0 md:ml-64">{children}</main>
    </div>
  );
};

export default AdvocateLayout;
