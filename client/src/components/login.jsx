
import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onCancel, onSwitchRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const response = await axios.post(
        "https://blogspace-backend-5tdb.onrender.com/login",
        { email, password }
      );

      onLogin(response.data);

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p>Login to your BlogSpace account.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

     <p className="auth-switch">
  Don't have an account?{" "}
  <button type="button" onClick={onSwitchRegister}>
    Register
  </button>
</p>

           <button
                    type="button"
                    className="auth-cancel"
                    onClick={onCancel}
                    >
                    Cancel
            </button>
    </div>
  );
}

export default Login;
