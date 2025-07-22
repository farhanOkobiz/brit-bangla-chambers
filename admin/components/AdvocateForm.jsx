"use client";

import { useState, useEffect } from "react";
import { useAxios } from "../services/useAxios";
import DataList from "./common/DataList";
import FormModal from "./common/FormModal";

const AdvocateForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [advocates, setAdvocates] = useState([]);
  const [loadingAdvocates, setLoadingAdvocates] = useState(true);
  const [editingAdvocate, setEditingAdvocate] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fields = [
    // Basic User Info
    {
      name: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter full name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter email address",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: true,
      placeholder: "Enter phone number",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter password",
    },

    // Advocate Specific Info
    {
      name: "designation",
      label: "Designation",
      type: "text",
      placeholder: "e.g., Senior Advocate, Barrister",
    },
    {
      name: "bar_council_enroll_num",
      label: "Bar Council Enrollment Number",
      type: "text",
      placeholder: "Enter enrollment number",
    },
    {
      name: "experience_years",
      label: "Years of Experience",
      type: "number",
      placeholder: "0",
    },
    {
      name: "bio",
      label: "Biography",
      type: "textarea",
      placeholder: "Brief professional biography...",
    },
    {
      name: "slug",
      label: "Profile Slug",
      type: "text",
      placeholder: "unique-profile-url",
    },

    // Contact & Address
    {
      name: "office_address",
      label: "Office Address",
      type: "textarea",
      placeholder: "Enter office address",
    },
    {
      name: "contact_phone",
      label: "Contact Phone",
      type: "text",
      placeholder: "Contact phone number",
    },
    {
      name: "contact_facebook",
      label: "Facebook Profile",
      type: "text",
      placeholder: "https://facebook.com/...",
    },
    {
      name: "contact_linkedin",
      label: "LinkedIn Profile",
      type: "text",
      placeholder: "https://linkedin.com/in/...",
    },

    // Available Hours
    {
      name: "monday_hours",
      label: "Monday Hours",
      type: "text",
      placeholder: "9:00 AM - 5:00 PM",
    },
    {
      name: "tuesday_hours",
      label: "Tuesday Hours",
      type: "text",
      placeholder: "9:00 AM - 5:00 PM",
    },
    {
      name: "wednesday_hours",
      label: "Wednesday Hours",
      type: "text",
      placeholder: "9:00 AM - 5:00 PM",
    },
    {
      name: "thursday_hours",
      label: "Thursday Hours",
      type: "text",
      placeholder: "9:00 AM - 5:00 PM",
    },
    {
      name: "friday_hours",
      label: "Friday Hours",
      type: "text",
      placeholder: "9:00 AM - 5:00 PM",
    },
    {
      name: "saturday_hours",
      label: "Saturday Hours",
      type: "text",
      placeholder: "9:00 AM - 1:00 PM",
    },
    {
      name: "sunday_hours",
      label: "Sunday Hours",
      type: "text",
      placeholder: "Closed",
    },

    // Professional Settings
    {
      name: "consultation_available",
      label: "Consultation Available",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
    {
      name: "base_fee",
      label: "Base Consultation Fee",
      type: "number",
      placeholder: "0",
    },
    {
      name: "show_fee_publicly",
      label: "Show Fee Publicly",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },

    // Status & Features
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      name: "featured",
      label: "Featured Advocate",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },

    // Profile Photo
    {
      name: "profilePhoto",
      label: "Profile Photo",
      type: "file",
      accept: "image/*",
      required: false,
    },
  ];

  const fetchAdvocates = async () => {
    try {
      setLoadingAdvocates(true);
       const res = await useAxios("/advocate/all", {
        method: "GET"}); // Moved useAxios call here to ensure it's at the top level
      

      if (res.ok) {
        console.log("Fetched advocates:", res.data);
        setAdvocates(res.data || []);
      } else {
        console.error("Failed to fetch advocates:", res.data);
      }
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setLoadingAdvocates(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      console.log("=== FORM SUBMISSION DEBUG ===");
      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Validate required fields before sending
      const requiredFields = ["full_name", "email", "phone", "password"];
      const missingFields = [];

      for (const field of requiredFields) {
        if (!formData.get(field)) {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        alert(`Please fill in required fields: ${missingFields.join(", ")}`);
        return false;
      }

      // Transform form data for API
      const transformedData = new FormData();

      // Add all form fields to FormData, including empty strings
      const fieldMappings = {
        // Basic user fields
        full_name: formData.get("full_name") || "",
        email: formData.get("email") || "",
        phone: formData.get("phone") || "",
        password: editingAdvocate ? undefined : formData.get("password") || "",

        // Advocate fields
        designation: formData.get("designation") || "",
        bar_council_enroll_num: formData.get("bar_council_enroll_num") || "",
        experience_years: formData.get("experience_years") || "0",
        bio: formData.get("bio") || "",
        slug: formData.get("slug") || "",
        office_address: formData.get("office_address") || "",
        consultation_available:
          formData.get("consultation_available") || "false",
        status: formData.get("status") || "pending",
        featured: formData.get("featured") || "false",
      };

      // Add basic fields
      Object.entries(fieldMappings).forEach(([key, value]) => {
        if (value !== undefined) {
          transformedData.append(key, value);
        }
      });

      // Contact object
      const contact = {
        phone: formData.get("contact_phone") || "",
        facebook: formData.get("contact_facebook") || "",
        linkedin: formData.get("contact_linkedin") || "",
      };
      transformedData.append("contact", JSON.stringify(contact));

      // Available hours object
      const available_hours = {
        monday: formData.get("monday_hours") || "",
        tuesday: formData.get("tuesday_hours") || "",
        wednesday: formData.get("wednesday_hours") || "",
        thursday: formData.get("thursday_hours") || "",
        friday: formData.get("friday_hours") || "",
        saturday: formData.get("saturday_hours") || "",
        sunday: formData.get("sunday_hours") || "",
      };
      transformedData.append(
        "available_hours",
        JSON.stringify(available_hours)
      );

      // Fee structure
      const fee_structure = {
        base_fee: Number.parseInt(formData.get("base_fee")) || 0,
        show_publicly: formData.get("show_fee_publicly") === "true",
      };
      transformedData.append("fee_structure", JSON.stringify(fee_structure));

      // Profile photo
      if (formData.get("profilePhoto")) {
        transformedData.append("profilePhoto", formData.get("profilePhoto"));
      }

      console.log("Transformed FormData entries:");
      for (const pair of transformedData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const url = editingAdvocate
        ? `/advocate/update/${editingAdvocate._id}`
        : "/advocate/create";
      const method = editingAdvocate ? "PUT" : "POST";

      // Moved useAxios call here to ensure it's at the top level
      const res = await useAxios(url, {
        method,
        data: transformedData,
      });

      console.log("Advocate submission response:", res);

      if (res.ok) {
        alert(
          editingAdvocate
            ? "Advocate updated successfully!"
            : "Advocate created successfully!"
        );
        setEditingAdvocate(null);
        setShowCreateForm(false);
        await fetchAdvocates();
        return true;
      } else {
        console.error("Advocate submission failed:", res);
        alert(res.data?.message || res.data?.error || "Something went wrong!");
        return false;
      }
    } catch (error) {
      console.error("Error submitting advocate:", error);
      alert("Failed to submit advocate. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (advocate) => {
    console.log("Editing advocate:", advocate);

    // Transform advocate data for form
    const transformedAdvocate = {
      ...advocate,
      // User fields
      full_name: advocate.user_id?.full_name || "",
      email: advocate.user_id?.email || "",
      phone: advocate.user_id?.phone || "",

      // Contact fields
      contact_phone: advocate.contact?.phone || "",
      contact_facebook: advocate.contact?.facebook || "",
      contact_linkedin: advocate.contact?.linkedin || "",

      // Available hours
      monday_hours: advocate.available_hours?.monday || "",
      tuesday_hours: advocate.available_hours?.tuesday || "",
      wednesday_hours: advocate.available_hours?.wednesday || "",
      thursday_hours: advocate.available_hours?.thursday || "",
      friday_hours: advocate.available_hours?.friday || "",
      saturday_hours: advocate.available_hours?.saturday || "",
      sunday_hours: advocate.available_hours?.sunday || "",

      // Fee structure
      base_fee: advocate.fee_structure?.base_fee || 0,
      show_fee_publicly: advocate.fee_structure?.show_publicly || false,

      // Convert booleans to strings for select fields
      consultation_available:
        advocate.consultation_available?.toString() || "false",
      featured: advocate.featured?.toString() || "false",
    };

    setEditingAdvocate(transformedAdvocate);
    setShowCreateForm(true);
  };

  const handleDelete = async (advocateId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this advocate? This will also delete the associated user account."
      )
    ) {
      return;
    }

    try {
       // Moved useAxios call here to ensure it's at the top level
      const res = await useAxios(`/advocate/profile/${advocateId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Advocate deleted successfully!");
        await fetchAdvocates();
      } else {
        alert(res.data?.error || "Failed to delete advocate");
      }
    } catch (error) {
      console.error("Error deleting advocate:", error);
      alert("Failed to delete advocate. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingAdvocate(null);
  };

  const handleToggleForm = () => {
    setShowCreateForm(!showCreateForm);
    if (editingAdvocate) {
      setEditingAdvocate(null);
    }
  };

  const renderAdvocateItem = (item) => {
    console.log("Rendering advocate item:", item);

    return (
      <div className="flex items-center space-x-4">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          {item.profile_photo_url ? (
            <img
              src={item.profile_photo_url || "/placeholder.svg"}
              alt={item.user_id?.full_name || "Advocate"}
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Photo</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {item.user_id?.full_name || "Unknown Name"}
          </h3>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-blue-600 text-sm font-medium">
              {item.designation || "Advocate"}
            </p>
            {item.experience_years && (
              <>
                <span className="text-gray-400">•</span>
                <p className="text-green-600 text-sm font-medium">
                  {item.experience_years} years exp.
                </p>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600 text-sm">
              {item.user_id?.email || "No email"}
            </p>
            {item.user_id?.phone && (
              <>
                <span className="text-gray-400">•</span>
                <p className="text-gray-600 text-sm">{item.user_id.phone}</p>
              </>
            )}
          </div>
          {item.bar_council_enroll_num && (
            <p className="text-gray-600 text-sm mt-1">
              Bar Council: {item.bar_council_enroll_num}
            </p>
          )}
          <div className="flex items-center space-x-4 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : item.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </span>
            {item.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Featured
              </span>
            )}
            {item.consultation_available && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Available for Consultation
              </span>
            )}
            <p className="text-xs text-gray-400">
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advocates</h1>
            <p className="text-gray-600 mt-1">
              Create and manage advocate profiles
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Form Modal */}
          <FormModal
            title="Advocate"
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            editingItem={editingAdvocate}
            onCancel={handleCancelEdit}
            showForm={showCreateForm}
            onToggleForm={handleToggleForm}
            buttonText="Add Advocate"
          />

          {/* Advocates List */}
          <DataList
            title="Advocates List"
            data={advocates}
            loading={loadingAdvocates}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderItem={renderAdvocateItem}
            emptyMessage="Create your first advocate profile to get started."
            searchPlaceholder="Search advocates..."
          />
        </div>
      </div>
    </div>
  );
};

export default AdvocateForm;
