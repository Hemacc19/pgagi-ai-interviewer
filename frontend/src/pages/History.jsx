
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getInterviewHistory } from "../services/api";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInterviewHistory();

      setHistory(response.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load interview history."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="history-page">

        <div className="history-container">

          <div className="history-header">

            <h1>
              Interview History
            </h1>

            <p>
              Review your previous AI-powered
              interview performances.
            </p>

          </div>

          <div className="interview-loading">

            <div className="big-spinner"></div>

            <h2>
              Loading History...
            </h2>

            <p>
              Fetching your previous interviews.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="history-page">

        <div className="history-container">

          <div className="history-header">

            <h1>
              Interview History
            </h1>

            <p>
              Review your previous interview
              performances.
            </p>

          </div>

          <div className="history-empty">

            <div className="empty-icon">
              !
            </div>

            <h2>
              Unable to Load History
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="result-primary-button"
              onClick={loadHistory}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // EMPTY HISTORY
  // ============================================================

  if (history.length === 0) {
    return (
      <div className="history-page">

        <div className="history-container">

          <div className="history-header">

            <h1>
              Interview History
            </h1>

            <p>
              Review your previous AI-powered
              interview performances.
            </p>

          </div>

          <div className="history-empty">

            <div className="empty-icon">
              ✓
            </div>

            <h2>
              No Interviews Yet
            </h2>

            <p>
              Complete your first interview to
              see your results and performance
              history here.
            </p>

            <button
              type="button"
              className="result-primary-button"
              onClick={() =>
                navigate("/interview")
              }
            >
              Start Interview
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // HISTORY
  // ============================================================

  return (
    <div className="history-page">

      <div className="history-container">

        {/* HEADER */}

        <div className="history-header">

          <h1>
            Interview History
          </h1>

          <p>
            Review your previous AI-powered
            interview performances.
          </p>

        </div>


        {/* HISTORY LIST */}

        <div className="history-list">

          {history.map((item, index) => (

            <div
              className="history-card"
              key={
                item.session_id ||
                index
              }
              style={{
                animationDelay: `${index * 0.08}s`,
              }}
            >

              {/* INTERVIEW INFO */}

              <div className="history-info">

                <h3>
                  {item.role ||
                    "Technical Interview"}
                </h3>

                <p>
                  {item.experience_level ||
                    "Fresher"}
                  {" · "}
                  {item.total_questions || 0}
                  {" Questions"}
                </p>

                <p>
                  Status:{" "}
                  {item.status ||
                    "Completed"}
                </p>

                {item.created_at && (
                  <p>
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>
                )}

              </div>


              {/* SCORE */}

              <div className="history-score">

                <strong>
                  {item.percentage ?? 0}%
                </strong>

                <span>
                  {item.average_score ?? 0}
                  /10 Average
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* START NEW INTERVIEW */}

        <div className="result-actions">

          <button
            type="button"
            className="result-primary-button"
            onClick={() =>
              navigate("/interview")
            }
          >
            Start New Interview
          </button>

        </div>

      </div>

    </div>
  );
}

export default History;

