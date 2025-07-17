// src/components/SubcategoryForm.jsx
import FormBuilder from "./FormBuilder";
import { useEffect, useState } from "react";

const SubcategoryForm = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories to populate dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

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
    {
      name: "name",
      label: "Subcategory Name",
      type: "text",
      placeholder: "Enter subcategory name",
      required: true,
    },
    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Write description...",
    },
    {
      name: "link",
      label: "Link",
      type: "text",
      placeholder: "Optional link",
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to create subcategory");

      alert("Subcategory created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return <FormBuilder fields={fields} onSubmit={handleSubmit} />;
};

export default SubcategoryForm;
