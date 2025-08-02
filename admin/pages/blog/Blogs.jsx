import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { UseAxios } from "../../services/UseAxios";
import Swal from "sweetalert2";
import { UseAuth } from "../../auth/AuthContext";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { role } = UseAuth();

  const imageUrl = import.meta.env.VITE_API_IMAGE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, ok } = await UseAxios(`/blog/get-all-blog`);

        if (!ok) throw new Error("Failed to fetch blogs");

        setBlogs(data?.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await UseAxios(`/blog/delete-blog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setBlogs((prev) => prev.filter((b) => b._id !== id));

      Swal.fire("Deleted!", "Blog has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", `Error deleting blog: ${error.message}`, "error");
    }
  };

  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section
      className="relative py-2 md:p-10 bg-center bg-cover overflow-hidden text-white flex items-center justify-center"
      style={{ backgroundImage: `url('/images/blogs/blog.jpg')` }}
    >
      <div className="absolute inset-0 bg-white/90 bg-opacity-60" />

      <div className="relative z-10 max-w-7xl w-full px-4 mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700 uppercase">
          our blog
        </h2>

        <p className="text-lg text-gray-300 mb-4 uppercase tracking-wider">
          <span className="text-4xl md:text-5xl font-bold text-gray-900">
            Recent Articles
          </span>
        </p>

        <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={`${imageUrl}${blog?.image}`}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />

                {/* Edit/Delete Icons on top-right */}
                {role === "admin" && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <Link
                      to={`/admin/dashboard/edit-blog/${blog._id}`}
                      title="Edit"
                      className="p-1 rounded-full shadow text-blue-600 cursor-pointer"
                    >
                      <FiEdit size={18} />
                    </Link>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      title="Delete"
                      className="p-1 rounded-full shadow text-red-600 cursor-pointer"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="p-6 text-gray-800 text-left">
                <p className="text-sm text-gray-500 mb-2">
                  By <span className="font-semibold">{blog.author_model}</span>
                  {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-xl font-semibold">{blog.title}</h3>

                {/* ✅ Status show here */}
                <p
                  className={`mt-2 text-sm font-medium ${
                    blog.status === "published"
                      ? "text-green-600"
                      : blog.status === "draft"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  Status: {blog.status || "N/A"}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  {role === "admin" && (
                    <Link
                      to={`/admin/dashboard/details-blog/${blog._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Read More
                    </Link>
                  )}
                  {role === "advocate" && (
                    <Link
                      to={`/advocate/dashboard/details-blog/${blog._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Read More
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blogs;
