import {
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaChartLine,
  FaFileAlt,
  FaDollarSign,
  FaGavel,
  FaCogs,
} from "react-icons/fa";

const stats = [
  {
    title: "Total Users",
    value: "1,245",
    change: "+12%",
    trend: "up",
    subtitle: "Active this month",
    color: "blue",
    progress: 75,
  },
  {
    title: "Active Advocates",
    value: "87",
    change: "+8.5%",
    trend: "up",
    subtitle: "Verified advocates",
    color: "green",
    badge: "15.3%",
  },
  {
    title: "Pending Requests",
    value: "24",
    change: "-2.4%",
    trend: "down",
    subtitle: "Awaiting approval",
    color: "orange",
  },
  {
    title: "Monthly Revenue",
    value: "$12,340",
    change: "+5.2%",
    trend: "up",
    subtitle: "This month",
    color: "purple",
  },
];

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "Registered as new user",
    time: "2 hours ago",
    type: "user",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Applied for advocate verification",
    time: "4 hours ago",
    type: "advocate",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Submitted service request",
    time: "6 hours ago",
    type: "service",
  },
  {
    id: 4,
    user: "Sarah Wilson",
    action: "Updated profile information",
    time: "8 hours ago",
    type: "profile",
  },
];

const quickActions = [
  {
    title: "Add New User",
    icon: <FaUsers />,
    color: "blue",
    path: "/admin/users",
  },
  {
    title: "Manage Advocates",
    icon: <FaGavel />,
    color: "green",
    path: "/admin/advocates",
  },
  {
    title: "View Services",
    icon: <FaCogs />,
    color: "purple",
    path: "/admin/services",
  },
  // {
  //   title: "Analytics",
  //   icon: <FaChartLine />,
  //   color: "orange",
  //   path: "/admin/analytics",
  // },
];

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile spacing for fixed header */}
      <div className="pt-16 lg:pt-0">
        {/* Header - Hidden on mobile since we have the top navbar */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, Admin! Here's what's happening today.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full lg:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                    <svg
                      className="h-5 w-5 lg:h-6 lg:w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5-5-5h5v-12"
                      />
                    </svg>
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src="/placeholder.svg?height=32&width=32"
                    alt="Admin"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                    Admin User
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Page Title */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, Admin!</p>
        </div>

        <div className="p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div
                    className={`p-2 lg:p-3 rounded-lg ${
                      stat.color === "blue"
                        ? "bg-blue-100"
                        : stat.color === "green"
                        ? "bg-green-100"
                        : stat.color === "orange"
                        ? "bg-orange-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {stat.color === "blue" && (
                      <FaUsers className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                    )}
                    {stat.color === "green" && (
                      <FaGavel className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                    )}
                    {stat.color === "orange" && (
                      <FaFileAlt className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
                    )}
                    {stat.color === "purple" && (
                      <FaDollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                    )}
                  </div>
                  {stat.badge && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {stat.badge}
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <h3 className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl lg:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    <span
                      className={`flex items-center text-xs lg:text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <FaArrowUp className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
                      ) : (
                        <FaArrowDown className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                </div>

                <p className="text-xs lg:text-sm text-gray-500">
                  {stat.subtitle}
                </p>

                {stat.progress && (
                  <div className="mt-3 lg:mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="text-center">
                  <div
                    className={`inline-flex p-3 rounded-full mb-3 group-hover:scale-110 transition-transform ${
                      action.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : action.color === "green"
                        ? "bg-green-100 text-green-600"
                        : action.color === "purple"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    <span className="text-xl">{action.icon}</span>
                  </div>
                  <h3 className="text-sm lg:text-base font-semibold text-gray-900">
                    {action.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Chart Placeholder */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  User Growth
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="h-4 w-4 lg:h-5 lg:w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <div className="h-48 lg:h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <FaChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Chart visualization would go here
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  Recent Activities
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        activity.type === "user"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "advocate"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "service"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {activity.type === "user" && <FaUsers />}
                      {activity.type === "advocate" && <FaGavel />}
                      {activity.type === "service" && <FaCogs />}
                      {activity.type === "profile" && <FaFileAlt />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
