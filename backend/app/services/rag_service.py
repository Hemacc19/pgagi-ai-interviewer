
from pathlib import Path
from typing import List, Optional, Dict, Any

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

VECTOR_STORE_DIR = BASE_DIR / "vector_store" / "ai_ml"


# ============================================================
# EMBEDDING MODEL
# ============================================================

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"


# ============================================================
# GLOBAL VECTOR STORE
# ============================================================

_vector_store = None


# ============================================================
# LOAD VECTOR STORE
# ============================================================

def get_vector_store():
    """
    Load the existing LangChain FAISS vector store.

    Expected files:

        backend/
        └── vector_store/
            └── ai_ml/
                ├── index.faiss
                └── index.pkl
    """

    global _vector_store

    if _vector_store is not None:
        return _vector_store

    index_file = VECTOR_STORE_DIR / "index.faiss"
    pickle_file = VECTOR_STORE_DIR / "index.pkl"

    if not index_file.exists():
        raise FileNotFoundError(
            f"FAISS index not found: {index_file}"
        )

    if not pickle_file.exists():
        raise FileNotFoundError(
            f"FAISS metadata file not found: {pickle_file}"
        )

    print("Loading embedding model...")

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME
    )

    print("Loading FAISS vector store...")

    _vector_store = FAISS.load_local(
        str(VECTOR_STORE_DIR),
        embeddings,
        allow_dangerous_deserialization=True
    )

    print("FAISS vector store loaded successfully.")

    return _vector_store


# ============================================================
# DYNAMIC QUERY BUILDER
# ============================================================

def build_dynamic_query(
    role: str,
    experience_level: Optional[str] = None,
    skills: Optional[List[str]] = None,
    technologies: Optional[List[str]] = None,
    topics: Optional[List[str]] = None,
) -> str:
    """
    Build a dynamic query for the interview RAG system.

    Example:

        build_dynamic_query(
            role="AI/ML Engineer",
            experience_level="Fresher",
            skills=[
                "Python",
                "Machine Learning",
                "Pandas"
            ],
            technologies=[
                "FastAPI",
                "Scikit-learn"
            ],
            topics=[
                "SQL"
            ]
        )
    """

    parts = []

    if role:
        parts.append(f"Role: {role}")

    if experience_level:
        parts.append(
            f"Experience Level: {experience_level}"
        )

    if skills:
        valid_skills = [
            str(skill).strip()
            for skill in skills
            if skill and str(skill).strip()
        ]

        if valid_skills:
            parts.append(
                "Skills: " + ", ".join(valid_skills)
            )

    if technologies:
        valid_technologies = [
            str(technology).strip()
            for technology in technologies
            if technology and str(technology).strip()
        ]

        if valid_technologies:
            parts.append(
                "Technologies: "
                + ", ".join(valid_technologies)
            )

    if topics:
        valid_topics = [
            str(topic).strip()
            for topic in topics
            if topic and str(topic).strip()
        ]

        if valid_topics:
            parts.append(
                "Topics: " + ", ".join(valid_topics)
            )

    return "\n".join(parts)


# ============================================================
# SEARCH KNOWLEDGE BASE
# ============================================================

def search_knowledge_base(
    query: str,
    top_k: int = 5
) -> List[Dict[str, Any]]:
    """
    Search the AI/ML knowledge base.

    Returns the most relevant documents.
    """

    if not query or not query.strip():
        return []

    vector_store = get_vector_store()

    documents_with_scores = (
        vector_store.similarity_search_with_score(
            query,
            k=top_k
        )
    )

    results = []

    for document, score in documents_with_scores:

        metadata = document.metadata or {}

        results.append(
            {
                "score": float(score),
                "text": document.page_content,
                "page": metadata.get("page"),
                "source": metadata.get(
                    "source",
                    metadata.get("file", "")
                ),
                "metadata": metadata,
            }
        )

    return results


# ============================================================
# BUILD CONTEXT
# ============================================================

def build_context(
    results: List[Dict[str, Any]],
    max_chars: int = 12000
) -> str:
    """
    Convert retrieved documents into LLM context.
    """

    if not results:
        return ""

    context_parts = []
    current_length = 0

    for i, result in enumerate(results, start=1):

        text = result.get("text", "").strip()

        if not text:
            continue

        source = result.get("source", "")
        page = result.get("page")

        header = f"[Retrieved Document {i}]"

        if source:
            header += f"\nSource: {source}"

        if page is not None:
            header += f"\nPage: {page}"

        section = (
            f"{header}\n"
            f"{text}\n"
        )

        if current_length + len(section) > max_chars:
            break

        context_parts.append(section)

        current_length += len(section)

    return "\n\n".join(context_parts)


# ============================================================
# COMPLETE RAG RETRIEVAL
# ============================================================

def retrieve_context(
    role: str,
    experience_level: Optional[str] = None,
    skills: Optional[List[str]] = None,
    technologies: Optional[List[str]] = None,
    topics: Optional[List[str]] = None,
    top_k: int = 5,
    max_chars: int = 12000,
) -> Dict[str, Any]:
    """
    Complete RAG retrieval pipeline.

    Configuration
          ↓
    Dynamic Query
          ↓
    FAISS Search
          ↓
    Relevant Documents
          ↓
    Context
    """

    query = build_dynamic_query(
        role=role,
        experience_level=experience_level,
        skills=skills,
        technologies=technologies,
        topics=topics,
    )

    results = search_knowledge_base(
        query=query,
        top_k=top_k
    )

    context = build_context(
        results=results,
        max_chars=max_chars
    )

    return {
        "query": query,
        "results": results,
        "context": context,
    }


# ============================================================
# SIMPLE RAG SEARCH
# ============================================================

def search_rag(
    query: str,
    top_k: int = 5
) -> str:
    """
    Simple function that returns only the
    retrieved context.
    """

    results = search_knowledge_base(
        query=query,
        top_k=top_k
    )

    return build_context(results)


# ============================================================
# HEALTH CHECK
# ============================================================

def rag_health_check() -> Dict[str, Any]:
    """
    Check whether the RAG vector store is available.
    """

    try:

        vector_store = get_vector_store()

        index_size = vector_store.index.ntotal

        return {
            "status": "ready",
            "vector_store": str(VECTOR_STORE_DIR),
            "vectors": index_size,
            "embedding_model": EMBEDDING_MODEL_NAME,
        }

    except Exception as e:

        return {
            "status": "error",
            "error": str(e),
            "vector_store": str(VECTOR_STORE_DIR),
        }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 60)
    print("PGAGI AI INTERVIEWER - RAG SERVICE TEST")
    print("=" * 60)

    try:

        health = rag_health_check()

        print("\nRAG Health:")
        print(health)

        if health["status"] == "ready":

            query = build_dynamic_query(
                role="AI/ML Engineer",
                experience_level="Fresher",
                skills=[
                    "Python",
                    "Machine Learning",
                    "Pandas"
                ],
                technologies=[
                    "FastAPI",
                    "Scikit-learn"
                ],
                topics=[
                    "SQL"
                ]
            )

            print("\nDynamic Query:")
            print("-" * 60)
            print(query)

            results = search_knowledge_base(
                query=query,
                top_k=5
            )

            print("\nRetrieved Documents:")
            print("-" * 60)

            for i, result in enumerate(results, start=1):

                print(f"\nDocument {i}")
                print(
                    f"Score: {result['score']:.4f}"
                )
                print(
                    f"Page: {result.get('page')}"
                )
                print(
                    f"Source: {result.get('source')}"
                )
                print(
                    result["text"][:500]
                )

    except Exception as e:

        print("\nRAG TEST FAILED")
        print("-" * 60)
        print(str(e))

