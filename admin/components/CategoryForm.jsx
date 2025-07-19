// src/pages/CreateCategory.jsx
import FormBuilder from "../components/FormBuilder";
import { useAxios } from "../hooks/useAxios";

const CategoryForm = () => {
  const fields = [
    { name: "name", label: "Category Name", type: "text", required: true },
    { name: "details", label: "Details", type: "textarea" },
    { name: "link", label: "Facebook Link", type: "text" },
    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      required: true,
    },
  ];

  const handleSubmit = async (formData) => {
    const res = await useAxios("/api/v1/category/create-category", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // 👈 crucial for file upload
      },
    });

    if (res.ok) {
      alert("Category created successfully!");
    } else {
      alert("Error: " + res.data?.message || "Unknown error");
    }

    console.log("Response:", res);
  };

  return (
    <FormBuilder
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Create Category"
    />
  );
};

export default CategoryForm;
