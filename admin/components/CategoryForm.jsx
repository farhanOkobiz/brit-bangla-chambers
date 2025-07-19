"use client";

import { useState, useEffect } from "react";
import { useAxios } from "../services/useAxios";
import DataList from "./common/DataList";
import FormModal from "./common/FormModal";

const CategoryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fields = [
    { name: "name", label: "Category Name", type: "text", required: true },
    {
      name: "details", // Changed from "description" to "details" to match the database field
      label: "Description",
      type: "textarea",
      placeholder: "Enter category description...",
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

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await useAxios("/category/get-all-categories", {
        method: "GET",
      });

      if (res.ok) {
        console.log("Fetched categories:", res.data);
        setCategories(res.data || []);
      } else {
        console.error("Failed to fetch categories:", res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
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

      const url = editingCategory
        ? `/category/update-category/${editingCategory._id}`
        : "/category/create-category";
      const method = editingCategory ? "PUT" : "POST";

      const res = await useAxios(url, {
        method,
        data: formData,
      });

      if (res.ok) {
        alert(
          editingCategory
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
        setEditingCategory(null);
        setShowCreateForm(false);

        // Immediately refresh the categories list
        await fetchCategories();

        return true; // Indicate success
      } else {
        alert(res.data?.error || "Something went wrong!");
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      alert("Failed to submit category. Please try again.");
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    console.log("Editing category:", category);
    setEditingCategory(category);
    setShowCreateForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const res = await useAxios(`/category/delete-category/${categoryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Category deleted successfully!");
        // Immediately refresh the categories list
        await fetchCategories();
      } else {
        alert(res.data?.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleToggleForm = () => {
    setShowCreateForm(!showCreateForm);
    if (editingCategory) {
      setEditingCategory(null);
    }
  };

  const renderCategoryItem = (item) => (
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

  const useAxiosHook = useAxios;

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Create and manage categories</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Form Modal */}
          <FormModal
            title="Category"
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            editingItem={editingCategory}
            onCancel={handleCancelEdit}
            showForm={showCreateForm}
            onToggleForm={handleToggleForm}
            buttonText="Add Category"
          />

          {/* Categories List */}
          <DataList
            title="Categories List"
            data={categories}
            loading={loadingCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderItem={renderCategoryItem}
            emptyMessage="Create your first category to get started."
            searchPlaceholder="Search categories..."
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
