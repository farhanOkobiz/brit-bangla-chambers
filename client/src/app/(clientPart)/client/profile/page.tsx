"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { apiFetch } from "@/api/apiFetch";
import UpdateClientInfo from "@/components/Profile/UpdateClientInfo";
import Image from "next/image";
import { toast } from "react-toastify";

interface UserData {
  _id: string;
  role: string;
  full_name: string;
  email: string;
  phone: string;
  otp_verified: boolean;
  created_at: string;
  __v: number;
}

interface Consultation {
  doctorId: string;
  date: string;
  notes: string;
}

interface ClientData {
  _id: string;
  user_id: UserData;
  nid_number: string;
  date_of_birth: string;
  gender: string;
  profile_photo: string;
  present_address: string;
  permanent_address: string;
  consultation_history: Consultation[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProfileData {
  user: UserData;
  client: ClientData;
}

export default function ClientProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const IMAGE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5001";
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetch("/client/profile", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        setProfileData(response?.data);
      } catch {
        toast.warning("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedClientData: ClientData) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        client: updatedClientData,
        user: updatedClientData.user_id,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const { user, client } = profileData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {client.profile_photo ? (
                  <Image
                    src={`${IMAGE_URL}${client.profile_photo} `}
                    alt={user.full_name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-700">
                      {getInitials(user.full_name)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.full_name}
                </h2>
                <p className="text-gray-600 capitalize">{user.role}</p>

                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  {/* Verification Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.otp_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.otp_verified ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {user.otp_verified ? "Verified" : "Unverified"}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {client.status}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <UpdateClientInfo
                clientData={client}
                onUpdate={handleProfileUpdate}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{user.full_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Gender
                </label>
                <p className="text-gray-900 font-medium capitalize">
                  {client.gender}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date of Birth
                </label>
                <p className="text-gray-900 font-medium">
                  {formatDate(client.date_of_birth)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  NID Number
                </label>
                <p className="text-gray-900 font-medium">{client.nid_number}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <p className="text-gray-900 font-medium">{user.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Account Created
                </label>
                <p className="text-gray-900 font-medium">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Present Address
                </label>
                <p className="text-gray-900 font-medium">
                  {client.present_address}
                </p>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Permanent Address
                </label>
                <p className="text-gray-900 font-medium">
                  {client.permanent_address}
                </p>
              </div>
            </div>
          </div>

          {/* Consultation History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consultation History
              </h3>
            </div>
            <div className="p-6">
              {client.consultation_history.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No consultation history available
                  </p>
                  <button className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                    Book Consultation
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {client.consultation_history.map((consultation, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      {/* Consultation details would go here */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                    user.otp_verified
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.otp_verified ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </div>
                <p className="font-medium">Phone Verification</p>
                <p className="text-sm text-gray-500">
                  {user.otp_verified ? "Verified" : "Not Verified"}
                </p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                    client.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <Clock className="h-6 w-6" />
                </div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm text-gray-500 capitalize">
                  {client.status}
                </p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 bg-blue-100 text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="font-medium">Member Since</p>
                <p className="text-sm text-gray-500">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
