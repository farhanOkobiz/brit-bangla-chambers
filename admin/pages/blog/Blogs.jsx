import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useAxios } from "../../services/useAxios";

const BASE_URL = "http://localhost:5000/api/v1";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, ok } = await useAxios(`/blog/get-all-blog`);

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
    try {
      const res = await useAxios(`${BASE_URL}/blog/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setBlogs((prev) => prev.filter((b) => b._id !== id));
      alert("Blog deleted successfully");
    } catch (error) {
      alert("Error deleting blog: " + error.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section
      className="relative py-16 bg-center bg-cover overflow-hidden text-white flex items-center justify-center"
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
                  src="https://cdn.pixabay.com/photo/2022/03/07/10/47/bird-7053394_640.jpg"
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />

                {/* Edit/Delete Icons on top-right */}
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={() => handleEdit(blog._id)}
                    title="Edit"
                    className="p-1 rounded-full shadow text-blue-600 cursor-pointer"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    title="Delete"
                    className="p-1 rounded-full shadow text-red-600 cursor-pointer"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6 text-gray-800 text-left">
                <p className="text-sm text-gray-500 mb-2">
                  By <span className="font-semibold">{blog.author_model}</span>{" "}
                  ·{" "}
                  {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-xl font-semibold">{blog.title}</h3>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Read More
                  </Link>
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
