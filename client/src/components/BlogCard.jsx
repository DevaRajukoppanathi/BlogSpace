
function BlogCard({ post, onView, onEdit, onDelete, user }) {
  const imageUrl = post.image
    ? `https://blogspace-backend-5tdb.onrender.com/uploads/${encodeURIComponent(post.image)}`
    : null;

  // Check whether the logged-in user owns this blog
  const isOwner =
    user && post.user && String(post.user) === String(user.id);

  return (
    <div className="blog-card">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={post.title}
          className="blog-image"
        />
      ) : (
        <div className="image-placeholder">
          No image available
        </div>
      )}

      <div className="blog-card-content">
        <p className="blog-author">
          By {post.author || "Anonymous"}
        </p>

        <h3>{post.title}</h3>

        <p className="blog-excerpt">{post.content}</p>

        <button
          className="read-button"
          onClick={() => onView(post)}
        >
          Read More →
        </button>

        {isOwner && (
          <div className="card-actions">
            <button onClick={() => onEdit(post)}>
              Edit
            </button>

            <button
              className="delete-button"
              onClick={() => onDelete(post._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogCard;
