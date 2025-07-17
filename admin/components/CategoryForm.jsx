// src/components/CategoryForm.jsx

import FormBuilder from "./FormBuilder";


const CategoryForm = () => {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Category Name",
      required: true,
    },
    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      required: true,
    },
    { name: "details", label: "Details", type: "text", placeholder: "Details" },
    { name: "link", label: "Link", type: "text", placeholder: "Link" },
  ];

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to create category");

      alert("Category created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return <FormBuilder fields={fields} onSubmit={handleSubmit} />;
};

export default CategoryForm;
