import {
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaChartLine,
  FaFileAlt,
  FaDollarSign,
} from "react-icons/fa";

const stats = [
  {
    title: "Total Revenue",
    value: "256",
    change: "+12%",
    trend: "up",
    subtitle: "Revenue today",
    color: "blue",
    progress: 75,
  },
  {
    title: "Sales Analytics",
    value: "8451",
    change: "+8.5%",
    trend: "up",
    subtitle: "Revenue today",
    color: "green",
    badge: "15.3%",
  },
  {
    title: "Statistics",
    value: "4569",
    change: "-2.4%",
    trend: "down",
    subtitle: "Revenue today",
    color: "orange",
  },
  {
    title: "Daily Sales",
    value: "158",
    change: "+5.2%",
    trend: "up",
    subtitle: "Revenue today",
    color: "purple",
  },
];

const teamMembers = [
  { name: "Chadengle", role: "Lead Designer", avatar: "👨‍💼", status: "online" },
  {
    name: "Michael Zenaty",
    role: "Support Lead",
    avatar: "👩‍💼",
    status: "online",
  },
  {
    name: "Stillnotdavid",
    role: "Lead Developer",
    avatar: "👨‍💻",
    status: "away",
  },
  { name: "Jamesatun", role: "Designer", avatar: "👩‍🎨", status: "online" },
];

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
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
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <svg
                  className="h-6 w-6"
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
                className="h-8 w-8 rounded-full"
                src="/placeholder.svg?height=32&width=32"
                alt="Admin"
              />
              <span className="text-sm font-medium text-gray-700">Nowak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
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
                    <FaDollarSign className="h-6 w-6 text-blue-600" />
                  )}
                  {stat.color === "green" && (
                    <FaChartLine className="h-6 w-6 text-green-600" />
                  )}
                  {stat.color === "orange" && (
                    <FaFileAlt className="h-6 w-6 text-orange-600" />
                  )}
                  {stat.color === "purple" && (
                    <FaUsers className="h-6 w-6 text-purple-600" />
                  )}
                </div>
                {stat.badge && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stat.badge}
                  </span>
                )}
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  <span
                    className={`flex items-center text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <FaArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <FaArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500">{stat.subtitle}</p>

              {stat.progress && (
                <div className="mt-4">
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Daily Sales
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-center h-48">
              <div className="relative w-32 h-32">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray="60, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-60"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-85"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Online Store</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Offline Store</span>
              </div>
            </div>
          </div>

          {/* Statistics Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Statistics
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="h-48 flex items-end justify-between space-x-2">
              {[40, 70, 45, 80, 60, 35, 90].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {2018 + index}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Revenue
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="h-48 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  points="0,100 50,80 100,90 150,60 200,70 250,40 300,50"
                />
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points="0,120 50,110 100,100 150,85 200,95 250,75 300,80"
                />
              </svg>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">This Year</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Last Year</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                    member.status === "online"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {member.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{member.role}</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
