
import { useEffect, useState } from "react";

function BlogForm({ selectedPost, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // Load existing post when editing
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title || "");
      setContent(selectedPost.content || "");
    } else {
      setTitle("");
      setContent("");
    }

    setImage(null);
  }, [selectedPost]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      content,
      image
    });
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <h2>
        {selectedPost ? "Edit Blog" : "Create New Blog"}
      </h2>

      <label>Blog Title</label>
      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Blog Content</label>
      <textarea
        placeholder="Write your blog content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="7"
        required
      />

      <label>Blog Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0] || null)}
      />

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {selectedPost ? "Save Changes" : "Publish Blog"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BlogForm;
