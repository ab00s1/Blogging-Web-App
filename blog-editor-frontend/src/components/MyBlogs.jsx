import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  // Redirect to landing if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    // Fetch all blogs and filter by user
    fetch("https://blog-editor-service.onrender.com/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data.filter((b) => b.authorEmail === userEmail));
        } else {
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load blogs");
        setLoading(false);
      });
  }, [userEmail]);

  const handleEdit = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`https://blog-editor-service.onrender.com/api/blog/${blogId}`, {
        method: "DELETE",
      });
      setBlogs((blogs) => blogs.filter((b) => b._id !== blogId));
    } catch {
      alert("Failed to delete blog");
    }
  };

  const handlePublish = async (blogId) => {
    const blog = blogs.find((b) => b._id === blogId);
    if (!blog.title || !blog.tag || !blog.content) {
      alert("All fields (title, tag, content) are required to publish a blog.");
      return;
    }
    try {
      await fetch(`https://blog-editor-service.onrender.com/api/blog/${blogId}/publish`, {
        method: "PUT",
      });
      setBlogs((blogs) =>
        blogs.map((b) => (b._id === blogId ? { ...b, status: "published" } : b))
      );
    } catch {
      alert("Failed to publish blog");
    }
  };

  // Filter blogs by tag if searchTag is set
  const filteredBlogs = searchTag
    ? blogs.filter((blog) => {
        if (!blog.tag) return false;
        if (Array.isArray(blog.tag)) {
          return blog.tag.some((t) =>
            t.toLowerCase().includes(searchTag.toLowerCase())
          );
        } else if (typeof blog.tag === 'string') {
          return blog.tag.toLowerCase().includes(searchTag.toLowerCase());
        }
        return false;
      })
    : blogs;

  if (loading)
    return (
      <div className="text-center py-16 text-orange-600">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  if (error)
    return <div className="text-center py-16 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
          My Blogs
        </h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="border border-orange-200 rounded-full px-4 py-1.5 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-orange-50/50 placeholder:text-orange-300 transition-all duration-300"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredBlogs.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-orange-50/50 rounded-xl border border-orange-100">
            No blogs found.
          </div>
        )}
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-3 border border-orange-100"
          >
            <div className="flex justify-between items-center">
              <h2
                className="text-xl font-semibold cursor-pointer hover:text-orange-600 transition-colors"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                {blog.title}
              </h2>
              <span className="text-sm text-gray-500 bg-orange-50 px-3 py-1 rounded-full">
                By {blog.author}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              {/* Support array or string for tags */}
              {Array.isArray(blog.tag) && blog.tag.length > 0 && (
                blog.tag.map((t, i) => (
                  <span key={i} className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium border border-orange-200">
                    #{t}
                  </span>
                ))
              )}
              {typeof blog.tag === 'string' && blog.tag && (
                <span className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium border border-orange-200">
                  #{blog.tag}
                </span>
              )}
              {blog.status === "draft" && (
                <span className="inline-block bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">
                  Draft
                </span>
              )}
            </div>
            <p className="text-gray-600 line-clamp-2">
              {blog.content?.slice(0, 120)}
              {blog.content?.length > 120 ? "..." : ""}
            </p>
            <div className="flex gap-6 items-center pt-3 border-t border-orange-100">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <span className="text-orange-500">👍</span> {blog.likes || 0} Likes
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <span className="text-orange-500">💬</span>{" "}
                {Array.isArray(blog.comments) ? blog.comments.length : 0} Comments
              </span>
              <Button
                variant="link"
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="text-orange-600 hover:text-orange-700 ml-auto"
              >
                Read More →
              </Button>
            </div>
            <div className="flex gap-3 items-center pt-3">
              <Button
                variant="outline"
                onClick={() => handleEdit(blog._id)}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(blog._id)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
              {blog.status === "draft" && (
                <Button
                  onClick={() => handlePublish(blog._id)}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-600 hover:to-amber-500 ml-auto"
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
