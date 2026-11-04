
import { useState } from "react";
import axios from "axios";

function Register({ onRegister, onCancel, onSwitchLogin }) {
  const [name, setName] = useState("");
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
        "https://blogspace-backend-5tdb.onrender.com/register",
        { name, email, password }
      );

      onRegister(response.data);

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="auth-container">
      <h2>Create Account</h2>
      <p>Join BlogSpace and start sharing your ideas.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create a password (minimum 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p  className="auth-switch">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchLogin}>
          Login
        </button>
      </p>

      <button type="button"   className="auth-cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default Register;
