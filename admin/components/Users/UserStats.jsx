import { FaUser, FaUserCheck, FaBan } from "react-icons/fa";

const UserStats = ({ filterTabs }) => {
  const getIconAndColor = (tabKey) => {
    switch (tabKey) {
      case "all":
        return {
          icon: <FaUser className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />,
          bgColor: "bg-blue-100",
        };
      case "active":
      case "approved":
        return {
          icon: (
            <FaUserCheck className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
          ),
          bgColor: "bg-green-100",
        };
      case "inactive":
      case "pending":
        return {
          icon: <FaUser className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600" />,
          bgColor: "bg-yellow-100",
        };
      case "banned":
      case "rejected":
        return {
          icon: <FaBan className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />,
          bgColor: "bg-red-100",
        };
      default:
        return {
          icon: <FaUser className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />,
          bgColor: "bg-gray-100",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {filterTabs.map((tab) => {
        const { icon, bgColor } = getIconAndColor(tab.key);
        return (
          <div key={tab.key} className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <div className={`p-2 lg:p-3 rounded-lg ${bgColor}`}>{icon}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{tab.label}</p>
                <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                  {tab.count}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStats;
