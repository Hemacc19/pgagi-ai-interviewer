
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const existingUser =
        localStorage.getItem("registeredUser");

      if (existingUser) {
        const user = JSON.parse(existingUser);

        if (
          user.email.toLowerCase() ===
          email.trim().toLowerCase()
        ) {
          setError(
            "An account with this email already exists."
          );
          return;
        }
      }

      const user = {
        name: name.trim(),
        email: email.trim(),
        password: password,
      };

      localStorage.setItem(
        "registeredUser",
        JSON.stringify(user)
      );

      alert(
        "Registration successful! Please login."
      );

      navigate("/login");

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <div className="auth-logo">
            AI
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Create your PGAGI AI Interviewer
            account.
          </p>

        </div>


        {/* FORM */}
        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          {/* NAME */}
          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
              autoComplete="name"
            />

          </div>


          {/* EMAIL */}
          <div className="form-group">

            <label htmlFor="register-email">
              Email Address
            </label>

            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}
          <div className="form-group">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Create a password"
              autoComplete="new-password"
            />

          </div>


          {/* CONFIRM PASSWORD */}
          <div className="form-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
            />

          </div>


          {/* ERROR */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* LOGIN LINK */}
        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;

