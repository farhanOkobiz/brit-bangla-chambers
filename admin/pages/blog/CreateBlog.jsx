import { useState } from "react";
import { useAxios } from "../../services/useAxios";
import { toast } from "react-toastify";

function CreateBlog() {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    slug: "",
    content: "",
    tags: "",
    status: "draft",
    author: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        author: "Advocate", // or "Admin" depending on login
      };

      await useAxios("/blog/create-blog", {
        method: "POST",
        data: payload,
      });

      toast.success("Blog created successfully!");
      setFormData({
        image: "",
        title: "",
        slug: "",
        content: "",
        tags: "",
        status: "draft",
        author: "",
      });
    } catch (error) {
      console.error("Create blog error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded"
        />
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Blog Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Slug (unique)"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Blog Content"
          rows={6}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select
          name="author_model"
          value={formData.author_model}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Admin">Admin</option>
          <option value="Advocate">Advocate</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
