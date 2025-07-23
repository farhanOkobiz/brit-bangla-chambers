"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams, useRouteError } from "react-router-dom";
import { useAxios } from "../../services/useAxios";

function EditBlog() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: [""],
    published_at: "",
    status: "draft",
    author: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await useAxios(`blog/get-single-blog/${id}`);
        const blog = res.data?.data;

        setFormData({
          title: blog.title || "",
          content: blog.content || "",
          image: blog.image || "",
          tags: blog.tags || [""],
          published_at: blog.published_at?.slice(0, 10) || "",
          status: blog.status || "",
          author: blog.author || "",
        });
      } catch (error) {
        Swal.fire("Error", "Failed to load blog", "error");
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setFormData({ ...formData, tags: value.split(",") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await useAxios(`/blog/edit-blog/${id}`, {
        method: "PUT",
        data: formData,
      });

      if (res.ok) {
        Swal.fire("Success", "Blog updated successfully", "success");
        navigate("/admin/dashboard/blogs");
      }
    } catch (err) {
      Swal.fire("Error", err?.message || "Failed to update blog", "error");
    }
  };

  console.log("formData.author:", formData.author);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            name="content"
            rows={6}
            value={formData.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags.join(",")}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Published At</label>
          <input
            type="date"
            name="published_at"
            value={formData.published_at}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Author</label>
          <select
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Author</option>
            <option value="Advocate">Advocate</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
