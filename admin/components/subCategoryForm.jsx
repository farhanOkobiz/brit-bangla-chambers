"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
import { useAxios } from "../services/UseAxios";
=======
import { UseAxios } from "../services/UseAxios";
>>>>>>> development
import DataList from "./common/DataList";
import FormModal from "./common/FormModal";

const SubcategoryForm = () => {
  const UseAxiosHook = UseAxios; // Ensure UseAxios is called at the top level
  const [isLoading, setIsLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fields = [
    {
      name: "categoryId",
      label: "Select Category",
      type: "select",
      required: true,
      options: categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })),
    },
    { name: "name", label: "Subcategory Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "link", label: "Link", type: "text" },
    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      required: false,
    },
  ];

  const fetchCategories = async () => {
    try {
      const res = await UseAxiosHook("/specialization/get-all-categories", {
        method: "GET",
      });

      if (res.ok) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setLoadingSubcategories(true);
      const res = await UseAxiosHook("/sub-category/get-all-sub-categories", {
        method: "GET",
      });

      if (res.ok) {
        setSubcategories(res.data || []);
      } else {
        console.error("Failed to fetch subcategories:", res.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const url = editingSubcategory
        ? `/sub-category/update-sub-category/${editingSubcategory._id}`
        : "/sub-category/create-sub-category";
      const method = editingSubcategory ? "PUT" : "POST";

      const res = await UseAxiosHook(url, {
        method,
        data: formData,
      });

      if (res.ok) {
        alert(
          editingSubcategory
            ? "Subcategory updated successfully!"
            : "Subcategory created successfully!"
        );
        setEditingSubcategory(null);
        setShowCreateForm(false);
        fetchSubcategories();
      } else {
        alert(res.data?.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      alert("Failed to submit subcategory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setShowCreateForm(true);
  };

  const handleDelete = async (subcategoryId) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    try {
      const res = await UseAxiosHook(
        `/sub-category/delete-sub-category/${subcategoryId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Subcategory deleted successfully!");
        fetchSubcategories();
      } else {
        alert(res.data?.error || "Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("Failed to delete subcategory. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingSubcategory(null);
  };

  const handleToggleForm = () => {
    setShowCreateForm(!showCreateForm);
    if (editingSubcategory) {
      setEditingSubcategory(null);
    }
  };

  // Custom renderer for subcategories to show category info
  const renderSubcategoryItem = (item) => (
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
        {item.categoryId && (
          <p className="text-blue-600 text-sm font-medium">
            Category: {item.categoryId.name || "Unknown Category"}
          </p>
        )}
        {item.description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {item.description}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subcategories</h1>
            <p className="text-gray-600 mt-1">
              Create and manage subcategories
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Form Modal */}
          <FormModal
            title="Subcategory"
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            editingItem={editingSubcategory}
            onCancel={handleCancelEdit}
            showForm={showCreateForm}
            onToggleForm={handleToggleForm}
            buttonText="Add Subcategory"
          />

          {/* Subcategories List */}
          <DataList
            title="Subcategories List"
            data={subcategories}
            loading={loadingSubcategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderItem={renderSubcategoryItem}
            emptyMessage="Create your first subcategory to get started."
            searchPlaceholder="Search subcategories..."
          />
        </div>
      </div>
    </div>
  );
};

export default SubcategoryForm;
