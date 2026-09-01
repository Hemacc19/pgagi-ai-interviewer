import re


SKILLS = [
    "Python",
    "Java",
    "C++",
    "C#",
    "JavaScript",
    "TypeScript",
    "SQL",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Data Science",
    "NLP",
    "Computer Vision",
    "Statistics",
    "Data Analysis"
]

TECHNOLOGIES = [
    "FastAPI",
    "Flask",
    "Django",
    "React",
    "Node.js",
    "Spring Boot",
    "Spring",
    "Hibernate",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Docker",
    "AWS",
    "Git",
    "GitHub"
]


def find_matches(text: str, items: list[str]) -> list[str]:
    """
    Find known skills/technologies in resume text.
    """

    text_lower = text.lower()

    matches = []

    for item in items:
        pattern = r"\b" + re.escape(item.lower()) + r"\b"

        if re.search(pattern, text_lower):
            matches.append(item)

    return matches


def analyze_resume(resume_text: str) -> dict:
    """
    Extract skills and technologies from resume text.
    """

    skills = find_matches(resume_text, SKILLS)
    technologies = find_matches(resume_text, TECHNOLOGIES)

    return {
        "skills": skills,
        "technologies": technologies
    }