
function Navbar({
  onCreate,
  onLogin,
  onRegister,
  user,
  onLogout,
  onProfile
}) {
  return (
    <nav className="navbar">
      <a href="/" className="brand">
        <span className="brand-icon">B</span>
        BlogSpace
      </a>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#blogs">Explore</a>

        {user ? (
          <>
            <span>Hi, {user.name}</span>

            <button
              className="nav-button"
              onClick={onProfile}
            >
              Profile
            </button>

            <button
              className="nav-button"
              onClick={onCreate}
            >
              + Create Blog
            </button>

            <button
              className="nav-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="nav-button"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              className="nav-button"
              onClick={onRegister}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
