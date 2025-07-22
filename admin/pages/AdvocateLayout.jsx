import AdvocateSideBar from "../components/AdvocateSidebar";

const AdvocateLayout = ({ children }) => {
  return (
    <div className="">
      <AdvocateSideBar />
      <main className=" p-4 ml-0 md:ml-64">{children}</main>
    </div>
  );
};

export default AdvocateLayout;
