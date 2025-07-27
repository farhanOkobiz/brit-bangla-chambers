import { useAxios } from "../../services/useAxios";
// import toast from "react-toastify";
import MyCasesForm from "../../components/form/MyCasesForm";

const MyCases = () => {
  const handleFormSubmit = async (data) => {
    try {
      await useAxios("/showOwnCaseFile/createCaseFile", {
        method: "POST",
        data,
      });

      // toast.success("Case history submitted successfully!");
    } catch (err) {
      console.error(err);
      // toast.error("Error submitting case history.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add Case History</h2>
      <div className="p-6 shadow-2xl rounded-lg">
        <MyCasesForm onFinish={handleFormSubmit} />
      </div>
    </div>
  );
};

export default MyCases;
