
function Profile({ user, blogs, onClose, onMyBlogs }) {
  const myBlogs = blogs.filter((post) => {
    const postUserId = post.user?._id || post.user;
    return String(postUserId) === String(user.id);
  });

  return (
    <div className="profile-container">
      <button className="close-button" onClick={onClose}>
        ✕
      </button>

      <div className="profile-avatar">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      <h2>My Profile</h2>

      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="profile-stats">
        <h3>{myBlogs.length}</h3>
        <p>Blogs Published</p>
      </div>

      <h3 className="profile-blog-heading">
        My Published Blogs
      </h3>

      {myBlogs.length > 0 ? (
        <div className="profile-blog-list">
          {myBlogs.map((blog) => (
            <div className="profile-blog-item" key={blog._id}>
              <span>{blog.title}</span>
              <small>
                {new Date(blog.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't published any blogs yet.</p>
      )}

      <button
        className="primary-button"
        onClick={() => {
          onMyBlogs();
          onClose();
        }}
      >
        View My Blogs
      </button>
    </div>
  );
}

export default Profile;
