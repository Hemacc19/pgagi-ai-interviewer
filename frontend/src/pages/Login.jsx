
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // Get registered user from localStorage
      const storedUser =
        localStorage.getItem("registeredUser");

      // Check whether user is registered
      if (!storedUser) {
        setError(
          "No account found. Please register first."
        );
        return;
      }

      const user = JSON.parse(storedUser);

      // Check email
      if (
        user.email.toLowerCase() !==
        email.trim().toLowerCase()
      ) {
        setError("Invalid email or password.");
        return;
      }

      // Check password
      if (user.password !== password) {
        setError("Invalid email or password.");
        return;
      }

      // ========================================================
      // LOGIN SUCCESS
      // ========================================================

      // Save logged-in user
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          name: user.name,
          email: user.email,
        })
      );

      console.log(
        "Login successful:",
        user.email
      );

      // ========================================================
      // GO DIRECTLY TO INTERVIEW SETUP
      // ========================================================

      navigate("/interview");

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="auth-header">

          <div className="auth-logo">
            AI
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your PGAGI AI Interviewer
            account.
          </p>

        </div>


        {/* =====================================================
            LOGIN FORM
        ====================================================== */}

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
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

            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* =====================================================
            REGISTER LINK
        ====================================================== */}

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;

