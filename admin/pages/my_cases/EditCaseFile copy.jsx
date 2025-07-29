<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
  <div className="max-w-4xl mx-auto">
    {/* Header Section */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/20">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
          Edit Case File
        </h2>
      </div>
    </div>

    {/* Main Form Container */}
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1">Case Information</h3>
          <p className="text-blue-100 text-sm">
            Update case details and track progress
          </p>
        </div>
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="p-8 space-y-8">
        {/* Hidden Client ID */}
        <input type="hidden" name="client_id" value={formData.client_id} />

        {/* Basic Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Case Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Case Summary *
            </label>
            <textarea
              rows={4}
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Case Type
            </label>
            <input
              type="text"
              value={formData.case_type}
              onChange={(e) => handleInputChange("case_type", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Court Name
            </label>
            <input
              type="text"
              value={formData.court_name}
              onChange={(e) => handleInputChange("court_name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Parties Information */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            Parties Information
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Plaintiff
              </h5>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.plaintiff_name}
                  onChange={(e) =>
                    handleInputChange("plaintiff_name", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.plaintiff_contact}
                  onChange={(e) =>
                    handleInputChange("plaintiff_contact", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Defendant
              </h5>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.defendant_name}
                  onChange={(e) =>
                    handleInputChange("defendant_name", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.defendant_contact}
                  onChange={(e) =>
                    handleInputChange("defendant_contact", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white text-gray-900 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Status *
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 font-medium appearance-none cursor-pointer"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  statusOptions.find((opt) => opt.value === formData.status)
                    ?.color || "bg-gray-100 text-gray-800 border-gray-200"
                }`}
              >
                {
                  statusOptions.find((opt) => opt.value === formData.status)
                    ?.label
                }
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Next Hearing Date
            </label>
            <input
              type="date"
              value={formData.next_hearing_date}
              onChange={(e) =>
                handleInputChange("next_hearing_date", e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Verdict Information */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Verdict Summary
            </label>
            <textarea
              rows={3}
              value={formData.verdict_summary}
              onChange={(e) =>
                handleInputChange("verdict_summary", e.target.value)
              }
              placeholder="Enter verdict details when case is concluded..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Verdict Date
            </label>
            <input
              type="date"
              value={formData.verdict_date}
              onChange={(e) =>
                handleInputChange("verdict_date", e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-95 text-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Update Case File
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>;
