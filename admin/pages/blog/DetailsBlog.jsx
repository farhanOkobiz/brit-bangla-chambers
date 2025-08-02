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
      className="relative mt-10 lg:mt-6 bg-center bg-cover overflow-hidden text-white flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/blogs/blog.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-white/90 bg-opacity-60" />

      <div className="relative z-10 w-full px-4 mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 flex flex-col lg:flex-row-reverse justify-between gap-6">
            <div className=" flex-1">
              <img
                src={fullImageUrl}
                alt={blog.title || "Blog Image"}
                className="object-cover w-full"
                style={{ width: 700, height: 224 }}
              />
            </div>
            <div className=" flex-2 pb-6 text-gray-800 ">
              <h2 className="text-x3l md:text-4xl font-bold mb-4 text-gray-700 uppercase">
                {blog.title}
              </h2>

              <div
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <p className=" text-gray-500 mb-2 mt-4 text-left">
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

              <div className="mt-2 flex gap-2 items-center">
                <h4 className="font-semibold text-gray-700">Tags:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {blog.tags?.length > 0 ? (
                    blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className=" bg-gray-100 rounded-full text-gray-600"
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailsBlog;
