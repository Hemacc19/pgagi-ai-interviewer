
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(null);

  useEffect(() => {
    // First: get result from router navigation
    if (location.state?.result) {
      console.log(
        "RESULT FROM ROUTER:",
        location.state.result
      );

      setResult(location.state.result);

      // Also keep a copy in sessionStorage
      sessionStorage.setItem(
        "interviewResult",
        JSON.stringify(location.state.result)
      );

      return;
    }

    // Second: get result from sessionStorage
    const stored = sessionStorage.getItem(
      "interviewResult"
    );

    console.log(
      "RESULT FROM STORAGE:",
      stored
    );

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setResult(parsed);
      } catch (error) {
        console.error(
          "Result parsing error:",
          error
        );
      }
    }
  }, [location.state]);

  const startNewInterview = () => {
    sessionStorage.removeItem(
      "interviewData"
    );

    sessionStorage.removeItem(
      "interviewResult"
    );

    navigate("/interview/setup");
  };

  // =========================
  // NO RESULT
  // =========================

  if (!result) {
    return (
      <div className="result-page">
        <div className="result-container">

          <div className="result-header">
            <h1>No Interview Result</h1>

            <p>
              There is no interview result available to display.
            </p>
          </div>

          <div className="history-empty">
            <h2>Start a New Interview</h2>

            <p>
              Complete an interview to see your performance here.
            </p>

            <button
              type="button"
              className="result-primary-button"
              onClick={startNewInterview}
            >
              Start New Interview
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="result-header">
          <h1>Interview Result</h1>

          <p>
            {result.role || "Interview"}{" "}
            {result.experience_level
              ? `• ${result.experience_level}`
              : ""}
          </p>
        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="result-summary">

          {/* Percentage */}
          <div className="result-score-card">
            <span className="result-score-label">
              Overall Score
            </span>

            <div className="result-score">
              {result.percentage ?? 0}%
            </div>

            <span className="result-score-label">
              {result.result || "Interview Completed"}
            </span>
          </div>


          {/* Questions */}
          <div className="result-stat-card">
            <strong>
              {result.total_questions ?? 0}
            </strong>

            <span>
              Questions
            </span>
          </div>


          {/* Total Score */}
          <div className="result-stat-card">
            <strong>
              {result.total_score ?? 0}
            </strong>

            <span>
              Total Score
            </span>
          </div>

        </div>


        {/* =========================
            AVERAGE SCORE
        ========================= */}

        <div className="result-summary">

          <div className="result-stat-card">
            <strong>
              {result.average_score ?? 0}
            </strong>

            <span>
              Average Score
            </span>
          </div>

          <div className="result-stat-card">
            <strong>
              {result.percentage ?? 0}%
            </strong>

            <span>
              Percentage
            </span>
          </div>

          <div className="result-stat-card">
            <strong>
              {result.evaluations?.length ?? 0}
            </strong>

            <span>
              Evaluated
            </span>
          </div>

        </div>


        {/* =========================
            DETAILED EVALUATION
        ========================= */}

        <div className="evaluation-section">

          <h2>
            Detailed Evaluation
          </h2>


          {result.evaluations?.length > 0 ? (
            result.evaluations.map(
              (evaluation, index) => (

                <div
                  className="evaluation-card"
                  key={
                    evaluation.question_number ??
                    index
                  }
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >

                  <div className="evaluation-question">
                    Question{" "}
                    {evaluation.question_number ??
                      index + 1}
                    {" : "}
                    {evaluation.question}
                  </div>


                  <div>
                    <strong>
                      Your Answer
                    </strong>
                  </div>

                  <div className="evaluation-answer">
                    {evaluation.answer ||
                      "No answer was provided."}
                  </div>


                  <div className="evaluation-score">
                    Score:{" "}
                    {evaluation.score ?? 0}/10
                  </div>


                  {evaluation.feedback && (
                    <>
                      <p>
                        <strong>
                          Feedback
                        </strong>
                      </p>

                      <div className="evaluation-answer">
                        {evaluation.feedback}
                      </div>
                    </>
                  )}


                  {evaluation.strengths?.length > 0 && (
                    <>
                      <p>
                        <strong>
                          Strengths
                        </strong>
                      </p>

                      <ul>
                        {evaluation.strengths.map(
                          (item, strengthIndex) => (
                            <li
                              key={strengthIndex}
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}


                  {evaluation.improvements?.length > 0 && (
                    <>
                      <p>
                        <strong>
                          Improvements
                        </strong>
                      </p>

                      <ul>
                        {evaluation.improvements.map(
                          (
                            item,
                            improvementIndex
                          ) => (
                            <li
                              key={
                                improvementIndex
                              }
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}

                </div>
              )
            )
          ) : (
            <div className="evaluation-card">
              <p>
                No detailed evaluation is available.
              </p>
            </div>
          )}

        </div>


        {/* =========================
            ACTIONS
        ========================= */}

        <div className="result-actions">

          <button
            type="button"
            className="result-primary-button"
            onClick={startNewInterview}
          >
            Start New Interview
          </button>

          <button
            type="button"
            className="result-secondary-button"
            onClick={() => navigate("/history")}
          >
            View History
          </button>

        </div>

      </div>
    </div>
  );
}

export default Result;

