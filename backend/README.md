# PGAGI AI Interviewer

An AI-powered technical interview platform that generates role-specific interview questions, evaluates candidate answers, and provides detailed performance feedback using Retrieval-Augmented Generation (RAG).

## Features

* AI-generated technical interview questions
* Role and experience-level based interviews
* RAG-based question generation using a knowledge base
* FAISS vector database for semantic search
* AI-powered answer evaluation
* Question-wise scoring and feedback
* Overall interview score and percentage
* Interview history
* Candidate registration and login
* Professional React-based user interface
* FastAPI REST backend
* Swagger API documentation

## Technology Stack

### Frontend

* React.js
* React Router
* JavaScript
* HTML
* CSS
* Fetch API

### Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Pydantic
* SQLite

### AI / RAG

* Groq LLM
* LangChain
* LangGraph
* Sentence Transformers
* FAISS
* PyPDF

### Database

* SQLite
* SQLAlchemy ORM

## Project Structure

```text
PGAGI AI Interviewer
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── services
│   │   ├── utils
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   │
│   ├── knowledge_base
│   │   └── ai_ml
│   │
│   ├── vector_store
│   ├── uploads
│   ├── interview.db
│   ├── requirements.txt
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

## How the System Works

```text
User
  │
  ▼
React Frontend
  │
  ▼
Interview Setup
  │
  ▼
FastAPI Backend
  │
  ▼
RAG Pipeline
  │
  ├── Knowledge Base
  ├── Embeddings
  └── FAISS Vector Search
  │
  ▼
Groq LLM
  │
  ▼
Interview Questions
  │
  ▼
Candidate Answers
  │
  ▼
AI Evaluation
  │
  ▼
Score + Feedback
  │
  ▼
Result / History
```

## Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Create and activate a virtual environment if required:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
GROQ_API_KEY=your_groq_api_key
```

Do not commit `.env` to GitHub.

## Run the Backend

From the project root:

```bash
cd backend
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend will normally run at:

```text
http://localhost:3000
```

## API Endpoints

### Generate Interview

```text
POST /api/interview/generate
```

Generates interview questions based on the selected role and experience level.

Example request:

```json
{
  "role": "AI Developer",
  "experience_level": "Fresher"
}
```

### Submit Interview Result

```text
POST /api/result/submit
```

Evaluates candidate answers and returns scores and feedback.

### Interview History

```text
GET /api/result/history
```

Returns previous interview results.

### Detailed Result

```text
GET /api/result/{session_id}
```

Returns the detailed result for a specific interview session.

## Example Evaluation Result

```json
{
  "candidate_id": 1,
  "session_id": 1,
  "role": "AI Developer",
  "experience_level": "Fresher",
  "total_questions": 5,
  "total_score": 34,
  "average_score": 6.8,
  "percentage": 68,
  "result": "Good"
}
```

## RAG Knowledge Base

The system uses a Retrieval-Augmented Generation pipeline.

The process is:

1. Load documents from the knowledge base.
2. Extract text from PDF documents.
3. Split documents into smaller chunks.
4. Generate embeddings.
5. Store embeddings in FAISS.
6. Retrieve relevant content for an interview request.
7. Send retrieved context to the LLM.
8. Generate relevant interview questions.

This helps generate questions based on the provided technical knowledge base instead of relying only on general LLM knowledge.

## Interview Evaluation

After the candidate submits the interview:

1. Candidate answers are sent to the backend.
2. The evaluation service analyzes each answer.
3. Each answer receives a score.
4. AI-generated feedback is provided.
5. Strengths and improvement areas are identified.
6. Total score and percentage are calculated.
7. The result is stored and displayed to the candidate.

## Security

Sensitive environment variables should never be committed to GitHub.

The following files and directories should remain excluded:

```text
.env
venv/
__pycache__/
node_modules/
*.db
```

## Future Enhancements

* JWT-based authentication
* Candidate profiles
* Resume-based interview generation
* Voice-based interviews
* Real-time AI interviewer
* Interview difficulty adaptation
* Advanced analytics dashboard
* PostgreSQL production database
* Cloud deployment
* Admin dashboard

## Author

Hema Chajagoud

Computer Science Engineering

## License

This project is developed for educational and project demonstration purposes.
