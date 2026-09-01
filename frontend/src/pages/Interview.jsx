
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { submitInterviewResult } from "../services/api";

function Interview() {
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD INTERVIEW DATA
  // ============================================================

  useEffect(() => {
    const stored = sessionStorage.getItem("interviewData");

    console.log("INTERVIEW DATA:", stored);

    if (!stored) {
      setError("No interview questions found.");
      return;
    }

    try {
      const data = JSON.parse(stored);

      if (
        !data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        setError("No interview questions found.");
        return;
      }

      setInterview(data);

      setAnswers(
        Array(data.questions.length).fill("")
      );

    } catch (err) {
      console.error("INTERVIEW DATA ERROR:", err);
      setError("Invalid interview data.");
    }
  }, []);

  // ============================================================
  // ANSWER CHANGE
  // ============================================================

  const handleAnswerChange = (value) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentIndex] = value;

    setAnswers(updatedAnswers);
  };

  // ============================================================
  // NEXT
  // ============================================================

  const handleNext = () => {
    if (
      interview &&
      currentIndex < interview.questions.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ============================================================
  // PREVIOUS
  // ============================================================

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ============================================================
  // SUBMIT INTERVIEW
  // ============================================================

  const handleSubmit = async () => {
    if (!interview) return;

    setLoading(true);
    setError("");

    try {
      /*
       * This request structure matches the Swagger
       * /api/result/submit endpoint.
       */

      const requestData = {
        session_id: 1,

        role: interview.role,

        experience_level:
          interview.experience_level || "Fresher",

        answers: interview.questions.map(
          (question, index) => ({
            question_id: index + 1,

            question: question.question,

            answer: answers[index] || "",
          })
        ),
      };

      console.log(
        "================================================"
      );

      console.log("SUBMIT REQUEST:");
      console.log(
        JSON.stringify(requestData, null, 2)
      );

      console.log(
        "================================================"
      );

      const response =
        await submitInterviewResult(requestData);

      console.log("BACKEND RESULT:");
      console.log(
        JSON.stringify(response, null, 2)
      );

      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (!response) {
        throw new Error(
          "No response received from backend."
        );
      }

      if (!response.data) {
        throw new Error(
          "Backend did not return result data."
        );
      }

      // ========================================================
      // SAVE RESULT
      // ========================================================

      sessionStorage.setItem(
        "interviewResult",
        JSON.stringify(response.data)
      );

      console.log(
        "RESULT SAVED:",
        response.data
      );

      // ========================================================
      // GO TO RESULT PAGE
      // ========================================================

      navigate("/result", {
        state: {
          result: response.data,
        },
      });

    } catch (err) {
      console.error(
        "================================================"
      );

      console.error("SUBMIT ERROR:", err);

      console.error(
        "================================================"
      );

      let errorMessage =
        "Failed to submit interview.";

      // Axios error from backend
      if (err.response) {
        console.error(
          "STATUS:",
          err.response.status
        );

        console.error(
          "BACKEND ERROR:",
          err.response.data
        );

        if (
          err.response.data &&
          err.response.data.detail
        ) {
          errorMessage =
            typeof err.response.data.detail ===
            "string"
              ? err.response.data.detail
              : JSON.stringify(
                  err.response.data.detail
                );
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // NO INTERVIEW
  // ============================================================

  if (error && !interview) {
    return (
      <div className="interview-page">

        <div className="interview-empty-card">

          <div className="empty-icon">
            !
          </div>

          <h2>
            {error}
          </h2>

          <p>
            Please start a new interview
            to continue.
          </p>

          <button
            className="primary-action"
            onClick={() =>
              navigate("/interview")
            }
          >
            Start New Interview
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (!interview) {
    return (
      <div className="interview-page">

        <div className="interview-loading">

          <div className="big-spinner"></div>

          <h2>
            Loading Interview...
          </h2>

          <p>
            Preparing your questions.
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // CURRENT QUESTION
  // ============================================================

  const question =
    interview.questions[currentIndex];

  const totalQuestions =
    interview.questions.length;

  const progress =
    ((currentIndex + 1) /
      totalQuestions) *
    100;

  const currentAnswer =
    answers[currentIndex] || "";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="interview-page">

      <div className="interview-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="interview-top">

          <div>

            <div className="interview-label">
              TECHNICAL INTERVIEW
            </div>

            <h1>
              {interview.role}
            </h1>

            <p>
              {interview.experience_level ||
                "Fresher"}{" "}
              · AI-Powered Interview
            </p>

          </div>

          <div className="question-counter">

            <strong>
              {currentIndex + 1}
            </strong>

            <span>
              / {totalQuestions}
            </span>

          </div>

        </div>

        {/* =====================================================
            PROGRESS
        ====================================================== */}

        <div className="progress-section">

          <div className="progress-info">

            <span>
              Interview Progress
            </span>

            <strong>
              {Math.round(progress)}%
            </strong>

          </div>

          <div className="progress-track">

            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
              }}
            ></div>

          </div>

        </div>

        {/* =====================================================
            QUESTION CARD
        ====================================================== */}

        <div className="question-card">

          <div className="question-meta">

            <span className="question-number">
              Question {currentIndex + 1}
            </span>

            {question.difficulty && (
              <span className="difficulty-badge">
                {question.difficulty}
              </span>
            )}

            {question.category && (
              <span className="category-badge">
                {question.category}
              </span>
            )}

          </div>

          <h2 className="question-title">
            {question.question}
          </h2>

          {/* =================================================
              ANSWER
          ================================================== */}

          <div className="answer-section">

            <div className="answer-header">

              <label>
                Your Answer
              </label>

              <span>
                {currentAnswer.length} characters
              </span>

            </div>

            <textarea
              className="answer-box"
              value={currentAnswer}
              onChange={(e) =>
                handleAnswerChange(
                  e.target.value
                )
              }
              placeholder={
                "Type your answer here...\n\n" +
                "Try to explain your approach clearly " +
                "and include examples where appropriate."
              }
              disabled={loading}
            />

          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="interview-error">
              {error}
            </div>
          )}

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div className="interview-navigation">

            {/* PREVIOUS */}

            <button
              type="button"
              className="secondary-action"
              onClick={handlePrevious}
              disabled={
                currentIndex === 0 ||
                loading
              }
            >
              ← Previous
            </button>

            {/* QUESTION COUNTER */}

            <div className="navigation-middle">

              <span>
                Question{" "}
                {currentIndex + 1}{" "}
                of{" "}
                {totalQuestions}
              </span>

            </div>

            {/* NEXT / SUBMIT */}

            {currentIndex <
            totalQuestions - 1 ? (

              <button
                type="button"
                className="primary-action next-button"
                onClick={handleNext}
                disabled={loading}
              >
                Next →
              </button>

            ) : (

              <button
                type="button"
                className="submit-action"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Evaluating..."
                  : "Submit Interview ✓"}
              </button>

            )}

          </div>

        </div>

        {/* =====================================================
            TIP
        ====================================================== */}

        <div className="interview-tip">

          <span className="tip-icon">
            💡
          </span>

          <div>

            <strong>
              Interview Tip
            </strong>

            <p>
              Explain your answer clearly.
              For technical questions, mention
              the approach, reasoning and a
              practical example when possible.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Interview;

