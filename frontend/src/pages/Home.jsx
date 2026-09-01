
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <div className="home-container">

        <section className="home-hero">

          <div className="home-badge">
            AI-POWERED INTERVIEW PLATFORM
          </div>

          <h1>
            PGAGI AI
            <span>Interviewer</span>
          </h1>

          <p className="home-description">
            Practice technical interviews, answer AI-generated
            questions, and receive intelligent feedback on your
            performance.
          </p>


          {/* LOGIN / REGISTER */}
          <div className="home-auth-actions">

            <Link
              to="/login"
              className="home-login-button"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="home-register-button"
            >
              Register
            </Link>

          </div>


          {/* START INTERVIEW */}
          <div className="home-actions">

            <Link
              to="/interview"
              className="home-primary-button"
            >
              Start Interview
              <span>→</span>
            </Link>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Home;

