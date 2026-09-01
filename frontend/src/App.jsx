
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InterviewSetup from "./pages/InterviewSetup";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import History from "./pages/History";

import "./App.css";


// ============================================================
// NAVBAR
// ============================================================

function Navbar() {
  const location = useLocation();

  // Don't show navbar on Login/Register pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  return (
    <header className="app-navbar">

      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="brand">

          <div className="brand-icon">
            AI
          </div>

          <div>
            <div className="brand-name">
              PGAGI
            </div>

            <div className="brand-subtitle">
              AI Interviewer
            </div>
          </div>

        </Link>


        {/* NAVIGATION */}
        <nav className="main-navigation">

          <Link
            to="/"
            className={
              location.pathname === "/"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </Link>


          <Link
            to="/interview"
            className={
              location.pathname.startsWith("/interview")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Interview
          </Link>


          <Link
            to="/history"
            className={
              location.pathname === "/history"
                ? "nav-link active"
                : "nav-link"
            }
          >
            History
          </Link>

        </nav>

      </div>

    </header>
  );
}


// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <main className="app-content">

        <Routes>

          {/* ==================================================
              FIRST PAGE
              ================================================== */}

          {/* 
             When user opens:
             http://localhost:3000/

             Show Login page first.
          */}

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />


          {/* ==================================================
              AUTHENTICATION
              ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ==================================================
              HOME
              ================================================== */}

          <Route
            path="/home"
            element={<Home />}
          />


          {/* ==================================================
              INTERVIEW
              ================================================== */}

          <Route
            path="/interview"
            element={<InterviewSetup />}
          />

          <Route
            path="/interview/questions"
            element={<Interview />}
          />


          {/* ==================================================
              RESULT
              ================================================== */}

          <Route
            path="/result"
            element={<Result />}
          />


          {/* ==================================================
              HISTORY
              ================================================== */}

          <Route
            path="/history"
            element={<History />}
          />


          {/* ==================================================
              INVALID URL
              ================================================== */}

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>

      </main>

    </BrowserRouter>
  );
}


export default App;

