
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateInterviewQuestions } from "../services/api";

function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("AI/ML Engineer");

  const [experienceLevel, setExperienceLevel] =
    useState("Fresher");

  const [skills, setSkills] = useState(
    "Python, SQL, Machine Learning"
  );

  const [technologies, setTechnologies] = useState(
    "Pandas, scikit-learn, FastAPI"
  );

  const [topics, setTopics] = useState(
    "Machine Learning, Pandas, SQL, FastAPI"
  );

  const [numberOfQuestions, setNumberOfQuestions] =
    useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // GENERATE INTERVIEW
  // ============================================================

  const handleGenerateInterview = async () => {
    setError("");

    if (!role.trim()) {
      setError("Please select a role.");
      return;
    }

    if (numberOfQuestions < 1) {
      setError("Please select the number of questions.");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        role: role.trim(),

        experience_level: experienceLevel,

        skills: skills
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),

        technologies: technologies
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),

        topics: topics
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),

        number_of_questions:
          Number(numberOfQuestions),
      };

      console.log(
        "Interview Request:",
        requestData
      );

      const response =
        await generateInterviewQuestions(
          requestData
        );

      console.log(
        "Backend response:",
        response
      );

      // ========================================================
      // VALIDATE BACKEND RESPONSE
      // ========================================================

      if (!response) {
        throw new Error(
          "No response received from backend."
        );
      }

      if (!response.data) {
        throw new Error(
          "Backend response does not contain data."
        );
      }

      if (
        !response.data.questions ||
        !Array.isArray(
          response.data.questions
        ) ||
        response.data.questions.length === 0
      ) {
        throw new Error(
          "Backend did not return interview questions."
        );
      }

      // ========================================================
      // SAVE INTERVIEW DATA
      // ========================================================

      sessionStorage.setItem(
        "interviewData",
        JSON.stringify(response.data)
      );

      sessionStorage.removeItem(
        "interviewAnswers"
      );

      sessionStorage.removeItem(
        "interviewResult"
      );

      console.log(
        "Interview saved successfully:",
        response.data
      );

      // ========================================================
      // NAVIGATE TO INTERVIEW
      // ========================================================

      navigate(
        "/interview/questions"
      );

    } catch (err) {
      console.error(
        "Generate Interview Error:",
        err
      );

      setError(
        err.message ||
          "Failed to generate interview."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE QUESTION COUNT
  // ============================================================

  const handleQuestionCount = (number) => {
    console.log(
      "Selected number of questions:",
      number
    );

    setNumberOfQuestions(number);
    setError("");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="setup-page">

      <div className="setup-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="setup-header">

          <div className="setup-badge">
            AI INTERVIEWER
          </div>

          <h1>
            Configure Your Interview
          </h1>

          <p>
            Customize your technical interview
            based on your role, experience,
            skills and technologies.
          </p>

        </div>


        {/* =====================================================
            MAIN CARD
        ====================================================== */}

        <div className="setup-card">

          {/* ROLE */}

          <div className="form-group">

            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              disabled={loading}
            >

              <option value="AI/ML Engineer">
                AI/ML Engineer
              </option>

              <option value="Generative AI Engineer">
                Generative AI Engineer
              </option>

              <option value="Machine Learning Engineer">
                Machine Learning Engineer
              </option>

              <option value="Python Developer">
                Python Developer
              </option>

              <option value="Java Developer">
                Java Developer
              </option>

              <option value="Full Stack Developer">
                Full Stack Developer
              </option>

              <option value="Backend Developer">
                Backend Developer
              </option>

              <option value="Frontend Developer">
                Frontend Developer
              </option>

              <option value="Software Engineer">
                Software Engineer
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>

              <option value="Data Analyst">
                Data Analyst
              </option>

              <option value="DevOps Engineer">
                DevOps Engineer
              </option>

              <option value="Cloud Engineer">
                Cloud Engineer
              </option>

            </select>

          </div>


          {/* EXPERIENCE LEVEL */}

          <div className="form-group">

            <label htmlFor="experience">
              Experience Level
            </label>

            <select
              id="experience"
              value={experienceLevel}
              onChange={(e) =>
                setExperienceLevel(
                  e.target.value
                )
              }
              disabled={loading}
            >

              <option value="Fresher">
                Fresher
              </option>

              <option value="Junior">
                Junior
              </option>

              <option value="Mid-Level">
                Mid-Level
              </option>

              <option value="Senior">
                Senior
              </option>

            </select>

          </div>


          {/* SKILLS */}

          <div className="form-group">

            <label htmlFor="skills">
              Skills
            </label>

            <input
              id="skills"
              type="text"
              value={skills}
              onChange={(e) =>
                setSkills(e.target.value)
              }
              placeholder="Python, SQL, Machine Learning"
              disabled={loading}
            />

            <span className="field-help">
              Separate multiple skills with commas.
            </span>

          </div>


          {/* TECHNOLOGIES */}

          <div className="form-group">

            <label htmlFor="technologies">
              Technologies
            </label>

            <input
              id="technologies"
              type="text"
              value={technologies}
              onChange={(e) =>
                setTechnologies(
                  e.target.value
                )
              }
              placeholder="Pandas, scikit-learn, FastAPI"
              disabled={loading}
            />

            <span className="field-help">
              Example: Pandas, scikit-learn, FastAPI
            </span>

          </div>


          {/* TOPICS */}

          <div className="form-group">

            <label htmlFor="topics">
              Interview Topics
            </label>

            <textarea
              id="topics"
              rows="3"
              value={topics}
              onChange={(e) =>
                setTopics(e.target.value)
              }
              placeholder="Machine Learning, Pandas, SQL, FastAPI"
              disabled={loading}
            />

            <span className="field-help">
              Enter the topics you want the AI
              interviewer to focus on.
            </span>

          </div>


          {/* NUMBER OF QUESTIONS */}

          <div className="form-group">

            <label>
              Number of Questions
            </label>

            <div className="question-options">

              {[5, 10, 15, 20].map(
                (number) => (

                  <button
                    key={number}
                    type="button"
                    className={
                      numberOfQuestions === number
                        ? "question-option active"
                        : "question-option"
                    }
                    onClick={() =>
                      handleQuestionCount(
                        number
                      )
                    }
                    disabled={loading}
                  >
                    {number}
                  </button>

                )
              )}

            </div>

            <span className="selected-question-text">
              {numberOfQuestions} questions selected
            </span>

          </div>


          {/* ERROR */}

          {error && (
            <div className="setup-error">
              {error}
            </div>
          )}


          {/* GENERATE BUTTON */}

          <button
            type="button"
            className="generate-button"
            onClick={
              handleGenerateInterview
            }
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Generating Questions...
              </>
            ) : (
              <>
                Generate Interview

                <span className="button-arrow">
                  →
                </span>
              </>
            )}

          </button>


          {/* FOOTER */}

          <p className="setup-footer">
            Your interview questions will be
            generated using the configured AI
            knowledge base.
          </p>

        </div>

      </div>

    </div>
  );
}

export default InterviewSetup;

