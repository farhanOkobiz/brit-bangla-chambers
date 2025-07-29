"use client";

import { useState, useEffect } from "react";
import { useAxios } from "../services/useAxios";
import DataList from "../components/common/DataList";
import FormModal from "../components/common/FormModal";
import AdvocateShowcase from "../components/Admin/AdvocateShowcase";
import AdvocateEditForm from "../components/Admin/AdvocateEditForm";

const AdvocateForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [advocates, setAdvocates] = useState([]);
  const [loadingAdvocates, setLoadingAdvocates] = useState(true);
  const [editingAdvocate, setEditingAdvocate] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Field configuration - grouped and simplified
  const basicFields = [
    { name: "full_name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ];

  const professionalFields = [
    { name: "designation", label: "Designation", type: "text" },
    { name: "bar_council_enroll_num", label: "Bar Council Number", type: "text" },
    { name: "experience_years", label: "Experience (Years)", type: "number" },
    { name: "bio", label: "Biography", type: "textarea" },
    { name: "slug", label: "Profile Slug", type: "text" },
    { name: "office_address", label: "Office Address", type: "textarea" },
  ];

  const contactFields = [
    { name: "contact_phone", label: "Contact Phone", type: "text" },
    { name: "contact_facebook", label: "Facebook", type: "text" },
    { name: "contact_linkedin", label: "LinkedIn", type: "text" },
  ];

  const scheduleFields = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  ].map(day => ({
    name: `${day}_hours`,
    label: `${day.charAt(0).toUpperCase() + day.slice(1)} Hours`,
    type: "text",
    placeholder: day === "sunday" ? "Closed" : "9:00 AM - 5:00 PM"
  }));

  const settingsFields = [
    {
      name: "consultation_available",
      label: "Consultation Available",
      type: "select",
      options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }]
    },
    { name: "base_fee", label: "Base Fee", type: "number" },
    {
      name: "show_fee_publicly",
      label: "Show Fee Publicly",
      type: "select",
      options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }]
    },
    { name: "languages", label: "Languages (comma-separated)", type: "text" },
    { name: "bar_name", label: "Bar Name", type: "text" },
    { name: "membership_number", label: "Membership Number", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" }
      ]
    },
    {
      name: "featured",
      label: "Featured",
      type: "select",
      options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }]
    },
    { name: "profilePhoto", label: "Profile Photo", type: "file", accept: "image/*" }
  ];

  const fields = [...basicFields, ...professionalFields, ...contactFields, ...scheduleFields, ...settingsFields];

  const fetchAdvocates = async () => {
    try {
      setLoadingAdvocates(true);
      const res = await useAxios("/advocate/all", { method: "GET" });
      
      if (res.ok) {
        setAdvocates(res.data || []);
      } else {
        alert("Failed to fetch advocates");
      }
    } catch (error) {
      console.error("Error fetching advocates:", error);
      alert("Error fetching advocates");
    } finally {
      setLoadingAdvocates(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, []);

  // Transform form data for API submission
  const transformFormData = (formData) => {
    const transformed = new FormData();

    // Basic fields
    const basicData = {
      full_name: formData.get("full_name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      designation: formData.get("designation") || "",
      bar_council_enroll_num: formData.get("bar_council_enroll_num") || "",
      experience_years: formData.get("experience_years") || "0",
      bio: formData.get("bio") || "",
      slug: formData.get("slug") || "",
      office_address: formData.get("office_address") || "",
      consultation_available: formData.get("consultation_available") || "false",
      status: formData.get("status") || "pending",
      featured: formData.get("featured") || "false",
    };

    if (!editingAdvocate) {
      basicData.password = formData.get("password") || "";
    }

    Object.entries(basicData).forEach(([key, value]) => {
      if (value !== undefined) transformed.append(key, value);
    });

    // Contact object
    const contact = {
      phone: formData.get("contact_phone") || "",
      facebook: formData.get("contact_facebook") || "",
      linkedin: formData.get("contact_linkedin") || "",
    };
    transformed.append("contact", JSON.stringify(contact));

    // Available hours
    const available_hours = {};
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach(day => {
      available_hours[day] = formData.get(`${day}_hours`) || "";
    });
    transformed.append("available_hours", JSON.stringify(available_hours));

    // Languages array
    const languages = formData.get("languages") 
      ? formData.get("languages").split(",").map(lang => lang.trim()).filter(lang => lang)
      : [];
    transformed.append("languages", JSON.stringify(languages));

    // Bar memberships
    const barMemberships = [];
    const barName = formData.get("bar_name");
    const membershipNumber = formData.get("membership_number");
    if (barName && membershipNumber) {
      barMemberships.push({ bar_name: barName.trim(), membership_number: membershipNumber.trim() });
    }
    transformed.append("bar_memberships", JSON.stringify(barMemberships));

    // Fee structure
    const fee_structure = {
      base_fee: parseInt(formData.get("base_fee")) || 0,
      show_publicly: formData.get("show_fee_publicly") === "true",
    };
    transformed.append("fee_structure", JSON.stringify(fee_structure));

    // Profile photo
    const photo = formData.get("profilePhoto");
    if (photo && photo.size > 0) {
      transformed.append("profilePhoto", photo);
    }

    return transformed;
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // Validate required fields
      const requiredFields = ["full_name", "email", "phone", "status"];
      if (!editingAdvocate) requiredFields.push("password");

      const missingFields = requiredFields.filter(field => !formData.get(field));
      if (missingFields.length > 0) {
        alert(`Please fill required fields: ${missingFields.join(", ")}`);
        return false;
      }

      const transformedData = transformFormData(formData);
      const url = editingAdvocate ? `/advocate/update/${editingAdvocate._id}` : "/advocate/create";
      const method = editingAdvocate ? "PUT" : "POST";

      const res = await useAxios(url, { method, data: transformedData });

      if (res.ok) {
        alert(`Advocate ${editingAdvocate ? 'updated' : 'created'} successfully!`);
        setEditingAdvocate(null);
        setShowCreateForm(false);
        await fetchAdvocates();
        return true;
      } else {
        alert(res.data?.message || res.data?.error || "Something went wrong!");
        return false;
      }
    } catch (error) {
      console.error("Error submitting advocate:", error);
      alert("Failed to submit advocate");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (advocate) => {
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
      // Fee structure
      base_fee: advocate.fee_structure?.base_fee || 0,
      show_fee_publicly: advocate.fee_structure?.show_publicly || false,
      // Convert to strings for select fields
      consultation_available: advocate.consultation_available?.toString() || "false",
      featured: advocate.featured?.toString() || "false",
      // Languages
      languages: Array.isArray(advocate.languages) ? advocate.languages.join(", ") : "",
      // Bar memberships
      bar_name: advocate.bar_memberships?.[0]?.bar_name || "",
      membership_number: advocate.bar_memberships?.[0]?.membership_number || "",
    };

    // Available hours
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach(day => {
      transformedAdvocate[`${day}_hours`] = advocate.available_hours?.[day] || "";
    });

    setEditingAdvocate(transformedAdvocate);
    setShowCreateForm(true);
  };

  const handleDelete = async (advocateId) => {
    if (!window.confirm("Are you sure you want to delete this advocate?")) return;

    try {
      const res = await useAxios(`/advocate/profile/${advocateId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Advocate deleted successfully!");
        await fetchAdvocates();
      } else {
        alert(res.data?.error || "Failed to delete advocate");
      }
    } catch (error) {
      console.error("Error deleting advocate:", error);
      alert("Failed to delete advocate");
    }
  };

  const renderAdvocateItem = (item) => (
    <AdvocateShowcase item={item} onEdit={handleEdit} onDelete={handleDelete} />
  );

  return (
    <div className="min-h-screen bg-gray-50 max-w-9xl mx-auto">
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Advocates</h1>
              <p className="text-gray-600 mt-1">Create and manage advocate profiles</p>
            </div>
            <div className="text-sm text-gray-500">Total: {advocates.length}</div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="max-w-9xl min-h-screen mx-auto">
            {/* Creation Modal */}
            <FormModal
              title="Advocate"
              fields={fields}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              editingItem={null}
              onCancel={() => setShowCreateForm(false)}
              showForm={showCreateForm}
              onToggleForm={() => setShowCreateForm(!showCreateForm)}
              buttonText="Add Advocate"
              modalClassName="max-h-[95vh] min-h-[90vh] w-full max-w-7xl overflow-y-auto"
            />

            {/* Edit Modal */}
            {editingAdvocate && (
              <AdvocateEditForm
                advocate={editingAdvocate}
                onCancel={() => setEditingAdvocate(null)}
                onUpdated={async () => {
                  setEditingAdvocate(null);
                  await fetchAdvocates();
                }}
                fields={fields}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                modalClassName="max-h-[95vh] min-h-[90vh] w-full max-w-7xl overflow-y-auto"
              />
            )}

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
              itemClassName="border-b border-gray-100 py-4 hover:bg-gray-50 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateForm;