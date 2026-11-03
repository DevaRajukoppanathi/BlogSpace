
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import BlogCard from "./components/BlogCard";
import BlogForm from "./components/BlogForm";
import Login from "./components/login";
import Register from "./components/Register";
import Profile from "./components/Profile";

import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewPost, setViewPost] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState(null);

  // Explore or My Blogs
  const [activeTab, setActiveTab] = useState("explore");

  // Handle successful login
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    setAuthMode(null);
    setActiveTab("explore");

    alert("Login successful!");
  };

  // Handle successful registration
  const handleRegister = () => {
    setAuthMode("login");
    alert("Registration successful! Please log in.");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
    setAuthMode(null);
    setActiveTab("explore");

    alert("Logged out successfully!");
  };

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      setError("");

      const response = await axios.get(`${API_URL}/posts`);

      setBlogs(response.data);
    } catch (err) {
      setError("Unable to load blogs. Check your backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Run when component loads
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on selected tab and search
  const filteredBlogs = blogs
    .filter((post) => {
      // My Blogs filter
      if (activeTab === "my" && user) {
        const postUserId =
          post.user?._id || post.user;

        if (String(postUserId) !== String(user.id)) {
          return false;
        }
      }

      // Search filter
      const search = searchTerm.toLowerCase();

      return (
        (post.title || "").toLowerCase().includes(search) ||
        (post.author || "").toLowerCase().includes(search) ||
        (post.content || "").toLowerCase().includes(search)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

  // Open create form
  const handleCreate = () => {
  if (!token) {
    setShowProfile(false);
    setShowForm(false);
    setAuthMode("login");
    alert("Please login first to create a blog.");
    return;
  }

  setAuthMode(null);
  setShowProfile(false);
  setSelectedPost(null);
  setViewPost(null);
  setShowForm(true);
};

  // Open edit form
  const handleEdit = (post) => {
    setSelectedPost(post);
    setViewPost(null);
    setShowForm(true);
  };

  // Create or update blog
  const handleSubmit = async (formData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (selectedPost) {
        await axios.put(
          `${API_URL}/posts/${selectedPost._id}`,
          {
            title: formData.title,
            content: formData.content
          },
          config
        );

        alert("Blog updated successfully!");
      } else {
        const data = new FormData();

        data.append("title", formData.title);
        data.append("content", formData.content);

        if (formData.image) {
          data.append("image", formData.image);
        }

        await axios.post(
          `${API_URL}/posts`,
          data,
          config
        );

        alert("Blog published successfully!");
      }

      setShowForm(false);
      setSelectedPost(null);

      await fetchBlogs();

    } catch (err) {
      alert(
        err.response?.data?.message || "Something went wrong."
      );
      console.error(err);
    }
  };

  // Delete a blog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBlogs((previousBlogs) =>
        previousBlogs.filter((blog) => blog._id !== id)
      );

      if (viewPost?._id === id) {
        setViewPost(null);
      }

      alert("Blog deleted successfully!");

    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to delete blog."
      );
      console.error(err);
    }
  };

  return (
    <div>
                <Navbar
              onCreate={handleCreate}
              onLogin={() => {
                setShowForm(false);
                setShowProfile(false);
                setAuthMode("login");
              }}
              onRegister={() => {
                setShowForm(false);
                setShowProfile(false);
                setAuthMode("register");
              }}
              onLogout={handleLogout}
              onProfile={() => {
                setAuthMode(null);
                setShowForm(false);
                setShowProfile(true);
              }}
              user={user}
            />



            {showProfile && user && (
  <div className="modal-overlay">
    <div className="modal-content">
      <Profile
        user={user}
        blogs={blogs}
        onClose={() => setShowProfile(false)}
        onMyBlogs={() => setActiveTab("my")}
      />
    </div>
  </div>
)}

      <main>
        {/* Hero section */}
        <section className="hero" id="home">
          <div className="hero-content">

            <span className="hero-label">
              WELCOME TO BLOGSPACE
            </span>

            <h1>
              Ideas worth
              <span> sharing.</span>
            </h1>

            <p>
              Discover stories, share your knowledge,
              and express your ideas with the world.
            </p>

            <button
              className="primary-button"
              onClick={handleCreate}
            >
              Start Writing →
            </button>

          </div>
        </section>

        {/* Blog section */}
        <section className="blogs-section" id="blogs">

          <div className="section-heading">

            <div>
              <span className="section-label">
                OUR STORIES
              </span>

              <h2>
                {activeTab === "my" ? "My Blogs" : "Latest Blogs"}
              </h2>
            </div>

            <div className="blog-search-actions">

              <input
                type="text"
                className="search-input"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                className="primary-button"
                onClick={handleCreate}
              >
                + New Blog
              </button>

            </div>

          </div>

          {/* Blog navigation tabs */}
          <div className="blog-tabs">

            <button
              className={
                activeTab === "explore"
                  ? "blog-tab active"
                  : "blog-tab"
              }
              onClick={() => setActiveTab("explore")}
            >
              Explore
            </button>

            {user && (
              <button
                className={
                  activeTab === "my"
                    ? "blog-tab active"
                    : "blog-tab"
                }
                onClick={() => setActiveTab("my")}
              >
                My Blogs
              </button>
            )}

          </div>

          {/* Loading */}
          {loading && (
            <p className="status-message">
              Loading blogs...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* No blogs in database */}
          {!loading && !error && blogs.length === 0 && (
            <div className="empty-state">
              <h3>No blogs published yet</h3>

              <p>
                Be the first person to share a story!
              </p>

              <button
                className="primary-button"
                onClick={handleCreate}
              >
                Create Your First Blog
              </button>
            </div>
          )}

          {/* Display blogs */}
          {!loading && !error && filteredBlogs.length > 0 && (
            <div className="blog-grid">

              {filteredBlogs.map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  onView={setViewPost}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  user={user}
                />
              ))}

            </div>
          )}

          {/* Empty My Blogs or search result */}
          {!loading &&
            !error &&
            blogs.length > 0 &&
            filteredBlogs.length === 0 && (

              <div className="empty-state">

                {activeTab === "my" && !searchTerm ? (
                  <>
                    <h3>You haven't published any blogs yet</h3>
                    <p>Start sharing your ideas with the world!</p>
                    <button
                      className="primary-button"
                      onClick={handleCreate}
                    >
                      Create Your First Blog
                    </button>
                  </>
                ) : (
                  <>
                    <h3>No matching blogs found</h3>
                    <p>
                      Try searching with another title or author name.
                    </p>
                  </>
                )}

              </div>
          )}

        </section>

        {/* Login and Register forms */}
        {authMode && (
          <div className="modal-overlay">
            <div className="modal-content">

              {authMode === "login" && (
                <Login
                  onLogin={handleLogin}
                  onCancel={() => setAuthMode(null)}
                  onSwitchRegister={() => setAuthMode("register")}
                />
              )}

              {authMode === "register" && (
                <Register
                  onRegister={handleRegister}
                  onCancel={() => setAuthMode(null)}
                  onSwitchLogin={() => setAuthMode("login")}
                />
              )}

            </div>
          </div>
        )}

        {/* Create and edit form */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">

              <BlogForm
                selectedPost={selectedPost}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedPost(null);
                }}
              />

            </div>
          </div>
        )}

        {/* View blog details */}
        {viewPost && (
          <div className="modal-overlay">

            <div className="modal-content detail-modal">

              <button
                className="close-button"
                onClick={() => setViewPost(null)}
              >
                ✕
              </button>

              {viewPost.image && (
                <img
                  src={`${API_URL}/uploads/${encodeURIComponent(viewPost.image)}`}
                  alt={viewPost.title}
                  className="detail-image"
                />
              )}

              <p className="blog-author">
                By {viewPost.author}
              </p>

              <h2>{viewPost.title}</h2>

              <p className="detail-content">
                {viewPost.content}
              </p>

              {user &&
                viewPost.user &&
                String(viewPost.user?._id || viewPost.user) ===
                  String(user.id) && (
                  <button
                    className="primary-button"
                    onClick={() => handleEdit(viewPost)}
                  >
                    Edit Blog
                  </button>
                )}

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-left">
          <h3>BlogSpace</h3>
          <p>Share your thoughts. Inspire the world.</p>
          <p>© 2026 BlogSpace. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <p>Developed by: Koppanathi Deva Raju</p>

          <p>
            Email Contact:{" "}
            <a href="mailto:koppanathidevaraju131@gmail.com">
              koppanathidevaraju131@gmail.com
            </a>
          </p>
        </div>

      </footer>

    </div>
  );
}

export default App;
