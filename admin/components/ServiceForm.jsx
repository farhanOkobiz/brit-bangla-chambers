"use client";

import { useState, useEffect } from "react";
import { useAxios } from "../services/UseAxios";
import DataList from "./common/DataList";
import FormModal from "./common/FormModal";

const ServiceForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const useAxiosHook = useAxios;

  // Dynamic fields that update based on available categories and subcategories
  const getFields = () => [
    {
      name: "category",
      label: "Select Category",
      type: "select",
      required: true,
      options: categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })),
    },
    {
      name: "subcategory",
      label: "Select Subcategory",
      type: "select",
      required: true,
      options: subcategories.map((sub) => ({
        label: sub.name,
        value: sub._id,
      })),
    },
    {
      name: "title",
      label: "Service Title",
      type: "text",
      required: true,
      placeholder: "Enter service title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Enter service description...",
    },
    {
      name: "serviceImage",
      label: "Service Image",
      type: "file",
      accept: "image/*",
      required: false,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
        { label: "Archived", value: "archived" },
      ],
    },
  ];

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const res = await useAxiosHook("/specialization/get-all-categories", {
        method: "GET",
      });

      if (res.ok) {
        console.log("Fetched categories:", res.data);
        setCategories(res.data || []);
      } else {
        console.error("Failed to fetch categories:", res.data);
        alert("Failed to fetch categories. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching categories. Please check your connection.");
    }
  };

  const fetchSubcategories = async () => {
    try {
      console.log("Fetching subcategories...");
      const res = await useAxiosHook("/sub-category/get-all-sub-categories", {
        method: "GET",
      });

      if (res.ok) {
        console.log("Fetched subcategories:", res.data);
        setSubcategories(res.data || []);
      } else {
        console.error("Failed to fetch subcategories:", res.data);
        alert("Failed to fetch subcategories. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      alert("Error fetching subcategories. Please check your connection.");
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      console.log("Fetching services...");
      const res = await useAxiosHook("/service/get-all-service", {
        method: "GET",
      });

      if (res.ok) {
        console.log("Fetched services:", res.data);
        setServices(res.data || []);
      } else {
        console.error("Failed to fetch services:", res.data);
        alert("Failed to fetch services. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      alert("Failed to fetch services. Please check your connection.");
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Component mounted, fetching initial data...");
      await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
        fetchServices(),
      ]);
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      console.log("=== SERVICE SUBMISSION DEBUG ===");
      console.log("Submitting service data:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Validate required fields
      const requiredFields = [
        "category",
        "subcategory",
        "title",
        "description",
        "status",
      ];
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

      const url = editingService
        ? `/service/update-service/${editingService._id}`
        : "/service/create-service";
      const method = editingService ? "PUT" : "POST";

      console.log(`Making ${method} request to ${url}`);

      const res = await useAxiosHook(url, {
        method,
        data: formData,
      });

      console.log("Service submission response:", res);

      if (res.ok) {
        alert(
          editingService
            ? "Service updated successfully!"
            : "Service created successfully!"
        );
        setEditingService(null);
        setShowCreateForm(false);
        // Refresh the services list
        await fetchServices();
        return true;
      } else {
        console.error("Service submission failed:", res);
        const errorMessage =
          res.data?.message || res.data?.error || "Something went wrong!";
        alert(errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error submitting service:", error);
      alert("Failed to submit service. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service) => {
    console.log("Editing service:", service);

    // Transform service data for form
    const transformedService = {
      ...service,
      // Handle populated vs non-populated category/subcategory
      category:
        typeof service.category === "object"
          ? service.category._id
          : service.category,
      subcategory:
        typeof service.subcategory === "object"
          ? service.subcategory._id
          : service.subcategory,
    };

    console.log("Transformed service for editing:", transformedService);
    setEditingService(transformedService);
    setShowCreateForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      console.log("Deleting service:", serviceId);
      const res = await useAxiosHook(`/service/delete-service/${serviceId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Service deleted successfully!");
        await fetchServices();
      } else {
        console.error("Delete failed:", res.data);
        alert(
          res.data?.error || res.data?.message || "Failed to delete service"
        );
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const handleToggleForm = () => {
    setShowCreateForm(!showCreateForm);
    if (editingService) {
      setEditingService(null);
    }
  };

  const renderServiceItem = (item) => {
    console.log("Rendering service item:", item);

    // Handle both populated and non-populated data
    let categoryName = "Unknown Category";
    let subcategoryName = "Unknown Subcategory";

    // Check if category is populated (object) or just an ID (string)
    if (item.category) {
      if (typeof item.category === "object" && item.category.name) {
        // Category is populated
        categoryName = item.category.name;
      } else if (typeof item.category === "string") {
        // Category is just an ID, find it in categories array
        const foundCategory = categories.find(
          (cat) => cat._id === item.category
        );
        categoryName = foundCategory
          ? foundCategory.name
          : `Category ID: ${item.category}`;
      }
    }

    // Check if subcategory is populated (object) or just an ID (string)
    if (item.subcategory) {
      if (typeof item.subcategory === "object" && item.subcategory.name) {
        // Subcategory is populated
        subcategoryName = item.subcategory.name;
      } else if (typeof item.subcategory === "string") {
        // Subcategory is just an ID, find it in subcategories array
        const foundSubcategory = subcategories.find(
          (sub) => sub._id === item.subcategory
        );
        subcategoryName = foundSubcategory
          ? foundSubcategory.name
          : `Subcategory ID: ${item.subcategory}`;
      }
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Image */}
        <div className="flex-shrink-0">
          {item.serviceImage ? (
            <img
              src={item.serviceImage || "/placeholder.svg"}
              alt={item.title}
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
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
            {item.title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
            <p className="text-blue-600 text-sm font-medium">{categoryName}</p>
            <span className="hidden sm:inline text-gray-400">•</span>
            <p className="text-green-600 text-sm font-medium">
              {subcategoryName}
            </p>
          </div>
          {item.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                item.status === "active"
                  ? "bg-green-100 text-green-800"
                  : item.status === "inactive"
                  ? "bg-red-100 text-red-800"
                  : item.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </span>
            <p className="text-xs text-gray-400">
              Created:{" "}
              {new Date(item.createdAt || item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state if categories or subcategories are not loaded yet
  if (categories.length === 0 || subcategories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading categories and subcategories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile spacing for fixed header */}
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Services
              </h1>
              <p className="text-gray-600 mt-1">Create and manage services</p>
            </div>
            <div className="text-sm text-gray-500">
              Categories: {categories.length} | Subcategories:{" "}
              {subcategories.length}
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Form Modal */}
            <FormModal
              title="Service"
              fields={getFields()}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              editingItem={editingService}
              onCancel={handleCancelEdit}
              showForm={showCreateForm}
              onToggleForm={handleToggleForm}
              buttonText="Add Service"
            />

            {/* Services List */}
            <DataList
              title="Services List"
              data={services}
              loading={loadingServices}
              onEdit={handleEdit}
              onDelete={handleDelete}
              renderItem={renderServiceItem}
              emptyMessage="Create your first service to get started."
              searchPlaceholder="Search services..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
