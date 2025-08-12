import { useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import { toast } from "react-toastify";
import { UseAuth } from "../../auth/AuthContext";

function CreateBlog() {
  const { role } = UseAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "draft",
    author_model: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile) {
        toast.error("Please upload an image.");
        setLoading(false);
        return;
      }

      const { title, content, tags, status, author_model } = formData;

      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("content", content);
      formDataToSend.append("status", status);
      formDataToSend.append("author_model", author_model);
      formDataToSend.append("author", "Advocate");
      formDataToSend.append(
        "tags",
        JSON.stringify(tags.split(",").map((tag) => tag.trim()))
      );
      formDataToSend.append("image", imageFile);

      await UseAxios("/blog/create-blog", {
        method: "POST",
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Blog created successfully!");

      // Reset form
      setFormData({
        title: "",
        content: "",
        tags: "",
        status: "draft",
        author_model: "Advocate",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Create blog error:", error);
      toast.error(error.response?.data?.message || "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 mx-6 py-6 px-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Create New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blog Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Blog Title"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content..."
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Status */}
        {role === "admin" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        )}

        {/* Author Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <select
            name="author_model"
            value={formData.author_model}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {role === "admin" && <option value="Admin">Admin</option>}
            {role === "advocate" && <option value="Advocate">Advocate</option>}
             {role === "staff" && <option value="Staff">Staff</option>}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium text-lg px-4 py-3 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBlog;
