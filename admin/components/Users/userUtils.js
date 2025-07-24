export const getStatusColor = (status) => {
  switch (status) {
    case "active":
    case "approved":
      return "bg-green-100 text-green-800";
    case "inactive":
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "banned":
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
