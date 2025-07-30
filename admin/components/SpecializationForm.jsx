"use client";

import { useState, useEffect } from "react";
import { useAxios } from "../services/UseAxios"; // Fixed: Changed from default import to named import
import DataList from "./common/DataList";
import FormModal from "./common/FormModal";

const SpecializationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [Specialization, setSpecialization] = useState([]);
  const [loadingSpecialization, setLoadingSpecialization] = useState(true);
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fields = [
    {
      name: "name",
      label: "Specialization Name",
      type: "text",
      required: true,
    },
    {
      name: "details", // Changed from "description" to "details" to match the database field
      label: "Description",
      type: "textarea",
      placeholder: "Enter Specialization description...",
    },
    {
      name: "link",
      label: "Website Link",
      type: "text",
      placeholder: "https://xyz.com/...",
    },
    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      required: false,
    },
  ];

  const fetchSpecialization = async () => {
    try {
      setLoadingSpecialization(true);
      const res = await useAxios("/specialization/get-all-Specialization", {
        method: "GET",
      });

      if (res.ok) {
        console.log("Fetched Specialization:", res.data);
        setSpecialization(res.data || []);
      } else {
        console.error("Failed to fetch Specialization:", res.data);
      }
    } catch (error) {
      console.error("Error fetching Specialization:", error);
    } finally {
      setLoadingSpecialization(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // Log what we're sending
      console.log("Submitting form data:");
      for (const pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      const url = editingSpecialization
        ? `/specialization/update-Specialization/${editingSpecialization._id}`
        : "/specialization/create-specialization";
      const method = editingSpecialization ? "PUT" : "POST";

      const res = await useAxios(url, {
        method,
        data: formData,
      });

      if (res.ok) {
        alert(
          editingSpecialization
            ? "Specialization updated successfully!"
            : "Specialization created successfully!"
        );
        setEditingSpecialization(null);
        setShowCreateForm(false);

        // Immediately refresh the Specialization list
        await fetchSpecialization();

        return true; // Indicate success
      } else {
        alert(res.data?.error || "Something went wrong!");
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Error submitting Specialization:", error);
      alert("Failed to submit Specialization. Please try again.");
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (Specialization) => {
    console.log("Editing Specialization:", Specialization);
    setEditingSpecialization(Specialization);
    setShowCreateForm(true);
  };

  const handleDelete = async (SpecializationId) => {
    if (
      !window.confirm("Are you sure you want to delete this Specialization?")
    ) {
      return;
    }

    try {
      const res = await useAxios(
        `/specialization/delete-Specialization/${SpecializationId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Specialization deleted successfully!");
        // Immediately refresh the Specialization  list
        await fetchSpecialization();
      } else {
        alert(res.data?.error || "Failed to delete Specialization");
      }
    } catch (error) {
      console.error("Error deleting Specialization:", error);
      alert("Failed to delete Specialization. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingSpecialization(null);
  };

  const handleToggleForm = () => {
    setShowCreateForm(!showCreateForm);
    if (editingSpecialization) {
      setEditingSpecialization(null);
    }
  };

  const renderSpecializationItem = (item) => (
    <div className="flex items-center space-x-4">
      {/* Image */}
      <div className="flex-shrink-0">
        {item.image ? (
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.name}
        </h3>
        {item.details && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {item.details}
          </p>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm mt-1 inline-block"
          >
            View Link →
          </a>
        )}
        <p className="text-xs text-gray-400 mt-2">
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  // Ensure all hooks are called at the top level
  useEffect(() => {
    fetchSpecialization();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Specialization</h1>
            <p className="text-gray-600 mt-1">
              Create and manage Specialization
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Form Modal */}
          <FormModal
            title="Specialization"
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            editingItem={editingSpecialization}
            onCancel={handleCancelEdit}
            showForm={showCreateForm}
            onToggleForm={handleToggleForm}
            buttonText="Add Specialization"
          />

          {/* Specialization  List */}
          <DataList
            title="Specialization  List"
            data={Specialization}
            loading={loadingSpecialization}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderItem={renderSpecializationItem}
            emptyMessage="Create your first Specialization to get started."
            searchPlaceholder="Search Specialization..."
          />
        </div>
      </div>
    </div>
  );
};

export default SpecializationForm;
