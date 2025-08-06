import { useEffect, useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  MapPin,
  Home,
  Calendar,
} from "lucide-react";

// type StaffProfileInterface = {
//   fullName: string;
//   email: string;
//   phone: string;
//   nidNumber: string;
//   role: string;
//   presentAddress: string;
//   permanentAddress: string;
//   createdAt: string;
// };

function StaffProfile() {
  const [staff, setStaff] = useState(null);

useEffect(() => {
  const fetchStaff = async () => {
    try {
      const response = await UseAxios("/staff/profile");
      setStaff(response.data.staff);
      console.log("Staff Profile Data:", response);
    } catch {
      toast.error("Failed to load staff profile.");
    }
  };

  fetchStaff();
}, []);



const profileFields = [
  {
    icon: User,
    label: "Full Name",
    value: staff?.fullName,
    color: "text-blue-600",
  },
  {
    icon: Mail,
    label: "Email",
    value: staff?.email,
    color: "text-green-600",
  },
  {
    icon: Phone,
    label: "Phone",
    value: staff?.phone,
    color: "text-purple-600",
  },
  {
    icon: CreditCard,
    label: "NID Number",
    value: staff?.nidNumber,
    color: "text-orange-600",
  },
  {
    icon: Briefcase,
    label: "Role",
    value: staff?.role,
    color: "text-indigo-600",
  },
  {
    icon: MapPin,
    label: "Present Address",
    value: staff?.presentAddress,
    color: "text-red-600",
  },
  {
    icon: Home,
    label: "Permanent Address",
    value: staff?.permanentAddress,
    color: "text-teal-600",
  },
  {
    icon: Calendar,
    label: "Joined On",
    value: staff?.createdAt
      ? new Date(staff?.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A",
    color: "text-pink-600",
  },
];

  if (!staff) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow border border-gray-100">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Staff Profile</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profileFields?.map((field, index) => {
          const IconComponent = field?.icon;
          return (
            <div
              key={index}
              className="group p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 ${field?.color} bg-opacity-10 rounded-lg flex items-center justify-center group-hover:bg-opacity-20 transition-colors duration-300`}
                >
                  <IconComponent className={`w-5 h-5 ${field?.color}`} />
                </div>
                <div className="flex-grow min-w-0">
                  <dt className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    {field?.label}
                  </dt>
                  <dd className="text-gray-900 font-medium break-words leading-relaxed">
                    {field?.value || "Not provided"}
                  </dd>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StaffProfile;
