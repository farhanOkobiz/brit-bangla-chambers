"use client";

export default function ClientDashboardPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Client Dashboard</h1>
        <p className="text-lg text-gray-700 text-center mb-4">
          Welcome to your dashboard! Here you can manage your profile, view your activity, and access client-only features.
        </p>
        <div className="grid grid-cols-1 gap-6 mt-8">
          <div className="bg-gray-50 rounded-xl p-6 shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Overview</h2>
            <p className="text-gray-600">View and update your personal information.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-gray-600">See your latest actions and updates.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Support</h2>
            <p className="text-gray-600">Contact support or get help with your account.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
