
const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// GENERATE INTERVIEW QUESTIONS
// ============================================================

export async function generateInterviewQuestions(data) {

  console.log(
    "Sending interview request:",
    data
  );

  const response = await fetch(
    `${API_BASE_URL}/api/interview/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  console.log(
    "Generate API response:",
    result
  );

  if (!response.ok) {

    throw new Error(
      result.detail ||
      "Failed to generate interview questions"
    );

  }

  return result;
}


// ============================================================
// SUBMIT INTERVIEW RESULT
// ============================================================

export async function submitInterviewResult(data) {

  console.log(
    "Sending result:",
    data
  );

  const response = await fetch(
    `${API_BASE_URL}/api/result/submit`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  console.log(
    "Result API response:",
    result
  );

  if (!response.ok) {

    throw new Error(
      result.detail ||
      "Failed to submit interview"
    );

  }

  return result;
}


// ============================================================
// GET INTERVIEW HISTORY
// ============================================================

export async function getInterviewHistory() {

  const response = await fetch(
    `${API_BASE_URL}/api/result/history`,
    {
      method: "GET",

      headers: {
        "Accept": "application/json"
      }
    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.detail ||
      "Failed to get interview history"
    );

  }

  return result;
}


// ============================================================
// GET DETAILED INTERVIEW RESULT
// ============================================================

export async function getInterviewResult(
  sessionId
) {

  const response = await fetch(
    `${API_BASE_URL}/api/result/${sessionId}`,
    {
      method: "GET",

      headers: {
        "Accept": "application/json"
      }
    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.detail ||
      "Failed to get interview result"
    );

  }

  return result;
}
