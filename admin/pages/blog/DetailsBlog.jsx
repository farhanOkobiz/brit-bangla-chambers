import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UseAxios } from "../../services/UseAxios";
import { useEffect, useState } from "react";

function DetailsBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const imageUrl = import.meta.env.VITE_API_IMAGE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await UseAxios(`/blog/get-single-blog/${id}`);
        setBlog(response?.data?.data || null);
      } catch {
        toast.error("Failed to fetch blog");
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  const fullImageUrl = blog.image
    ? `${imageUrl?.endsWith("/") ? imageUrl.slice(0, -1) : imageUrl}/${
        blog.image.startsWith("/") ? blog.image.slice(1) : blog.image
      }`
    : "/fallback-image.png";

  return (
    <section
      className="relative py-2 md:p-10 bg-center bg-cover overflow-hidden text-white flex items-center justify-center mt-4"
      style={{
        backgroundImage: `url('/images/blogs/blog.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-white/90 bg-opacity-60" />

      <div className="relative z-10 w-full px-2 mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden text-left p-6 text-gray-800">
          {/* Floating image */}
          <img
            src={fullImageUrl}
            alt={blog.title || "Blog Image"}
            className=" float-none md:float-right w-full sm:w-[300px] md:w-[400px] lg:w-[350px] ml-4 mb-4 rounded shadow"
          />

          {/* Text wraps around the image */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700 uppercase">
            {blog.title}
          </h2>

          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl text-justify"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Author and Date */}
          <p className="text-gray-500 mb-2 mt-4 clear-both">
            By{" "}
            <span className="font-semibold">
              {blog.author || blog.author_model}
            </span>{" "}
            &bull;{" "}
            {new Date(blog.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Tags */}
          <div className="mt-2 flex gap-2 items-center flex-wrap">
            <h4 className="font-semibold text-gray-700">Tags:</h4>
            {blog.tags?.length > 0 ? (
              blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 rounded-full text-gray-600 px-2 py-1 text-sm"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <p>No tags available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailsBlog;
