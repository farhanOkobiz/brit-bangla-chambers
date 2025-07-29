"use client";

const UserFilters = ({ filterTabs, filter, setFilter }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-8 px-6 overflow-x-auto"
          aria-label="Tabs"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`${
                filter === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default UserFilters;
