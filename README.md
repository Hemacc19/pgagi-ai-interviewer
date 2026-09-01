# PGAGI AI Interviewer

An AI-powered technical interview platform that simulates real-world interviews using **Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and semantic search**.

The platform allows candidates to select a role and experience level, answer AI-generated technical questions, and receive automated evaluation, scores, feedback, and interview history.

---

## 🚀 Features

* 🔐 User Registration and Login
* 🤖 AI-powered technical interview
* 🎯 Role-based interview questions
* 📊 Experience-level based questions
* 📚 Retrieval-Augmented Generation (RAG)
* 🔎 FAISS semantic search
* 🧠 Groq LLM integration
* 📝 AI-powered answer evaluation
* ⭐ Question-wise scoring
* 📈 Overall interview score and percentage
* 💡 AI-generated feedback
* 📜 Interview history
* 📄 Resume upload support
* ⚡ FastAPI REST APIs
* 🎨 Modern React user interface
* 📖 Swagger API documentation

---

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* React Router
* HTML5
* CSS3
* Fetch API
* Vite

### Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Pydantic
* SQLite

### AI / Machine Learning

* Groq LLM
* LangChain
* LangGraph
* Sentence Transformers
* FAISS
* Transformers
* PyTorch
* Scikit-learn

### RAG Pipeline

* PyPDF
* Sentence Transformers
* FAISS Vector Database
* LangChain
* LangGraph

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Interview Service │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     RAG Pipeline    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        Knowledge Base    Embeddings         FAISS
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Groq LLM       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Interview Questions │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Candidate Answers   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AI Evaluation     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Score + Feedback    │
                    └─────────────────────┘
```

---

## 📁 Project Structure

```text
pgagi-ai-interviewer/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── interview.py
│   │   │   ├── result.py
│   │   │   └── resume.py
│   │   │
│   │   ├── services/
│   │   │   ├── interview_service.py
│   │   │   ├── question_service.py
│   │   │   ├── rag_service.py
│   │   │   └── resume_service.py
│   │   │
│   │   ├── utils/
│   │   │   └── pdf_parser.py
│   │   │
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   │
│   ├── knowledge_base/
│   │   └── ai_ml/
│   │
│   ├── vector_store/
│   ├── uploads/
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── Result.jsx
│   │   │   └── History.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔄 How It Works

### 1. User Registration

The candidate creates an account using the registration page.

### 2. Login

The candidate logs into the platform.

### 3. Interview Setup

The candidate selects:

* Technical role
* Experience level
* Interview configuration

### 4. RAG Question Generation

The backend retrieves relevant information from the technical knowledge base using:

```text
PDF
 ↓
Text Extraction
 ↓
Text Chunking
 ↓
Embeddings
 ↓
FAISS Vector Search
 ↓
Relevant Context
```

### 5. AI Question Generation

The retrieved context is provided to the Groq LLM to generate relevant technical interview questions.

### 6. Candidate Interview

The candidate answers the generated questions through the React interface.

### 7. AI Evaluation

The backend evaluates each answer and generates:

* Score
* Feedback
* Strengths
* Areas for improvement

### 8. Results

The final result includes:

* Total questions
* Total score
* Average score
* Percentage
* Overall result
* Question-wise feedback

### 9. Interview History

Previous interview results can be viewed through the history page.

---

## 🧠 RAG Pipeline

The project uses Retrieval-Augmented Generation to make interview questions more relevant to the technical knowledge base.

```text
Knowledge Base
      ↓
PDF Processing
      ↓
Text Extraction
      ↓
Chunk Creation
      ↓
Sentence Embeddings
      ↓
FAISS Vector Store
      ↓
Semantic Search
      ↓
Relevant Context
      ↓
Groq LLM
      ↓
Interview Questions
```

This approach allows the system to retrieve relevant technical information before generating interview questions.

---

## 🔌 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Interview

```text
POST /api/interview/generate
```

Generates technical interview questions based on the selected role and experience level.

### Results

```text
POST /api/result/submit
GET /api/result/history
GET /api/result/{session_id}
```

### Resume

```text
POST /api/resume/upload
```

---

## 📊 Example Result

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

---

# ⚙️ Installation

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
GROQ_API_KEY=your_groq_api_key
```

Never commit your `.env` file to GitHub.

---

## ▶️ Run Backend

From the project root:

```bash
cd backend
```

Run:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔐 Security

The following files should never be committed to GitHub:

```text
.env
venv/
node_modules/
__pycache__/
*.db
```

API keys and other secrets must be stored in environment variables.

---

## 🚀 Future Enhancements

* JWT-based authentication
* PostgreSQL production database
* Resume-based personalized interviews
* Voice-based interviews
* Real-time AI interviewer
* Adaptive interview difficulty
* Advanced candidate analytics
* Admin dashboard
* Interview performance charts
* Cloud deployment
* Multi-language interview support

---

## 👩‍💻 Author

**Hema Chajagoud**

Computer Science Engineering

---

## 📄 License

This project is developed for educational and project demonstration purposes.
