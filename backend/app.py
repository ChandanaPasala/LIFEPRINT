
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# ==========================================
# LIFEPRINT BACKEND CONFIGURATION
# ==========================================

# Project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from LIFEPRINT/.env
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = Flask(__name__)

# Secure secret key from environment
app.secret_key = os.environ.get("LIFEPRINT_SECRET_KEY")

if not app.secret_key:
    raise RuntimeError(
        "LIFEPRINT_SECRET_KEY is missing. "
        "Please create a .env file in the project root."
    )

# Session configuration
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

# CORS configuration
# ==========================================
# CORS CONFIGURATION
# ==========================================

FRONTEND_URL = os.environ.get(
    "FRONTEND_URL",
    "http://127.0.0.1:5500"
)

CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        FRONTEND_URL
    ]
)

# ==========================================
# SQLITE DATABASE CONFIGURATION
# ==========================================

DATABASE_DIR = os.path.join(BASE_DIR, "database")

os.makedirs(DATABASE_DIR, exist_ok=True)

DATABASE_PATH = os.path.join(DATABASE_DIR, "lifeprint.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def initialize_database():

    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            education TEXT,
            branch TEXT,
            skills TEXT,
            interest TEXT,
            career TEXT,
            hours TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
        # STEP 9: CREATE LEARNING PROGRESS TABLE

    connection.execute("""
        CREATE TABLE IF NOT EXISTS learning_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER NOT NULL,
            career TEXT NOT NULL,
            task_index INTEGER NOT NULL,
            task_text TEXT NOT NULL,
            completed INTEGER DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(profile_id, career, task_index)
        )
    """)


    connection.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # STEP 15.5: LINK PROFILES TO REGISTERED USERS

    profile_columns = connection.execute(
        "PRAGMA table_info(profiles)"
    ).fetchall()

    column_names = [column["name"] for column in profile_columns]

    if "user_id" not in column_names:
        connection.execute("""
            ALTER TABLE profiles
            ADD COLUMN user_id INTEGER REFERENCES users(id)
        """)



    connection.commit()
    connection.close()


initialize_database()


# ==========================================
# STEP 15.5: LOGIN PROTECTION FUNCTION
# ==========================================

def login_required():
    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please log in to continue."
        }), 401

    return None


# Career skill requirements
CAREER_SKILLS = {
    "frontend developer": [
        "html",
        "css",
        "javascript",
        "git",
        "responsive design"
    ],

    "web developer": [
        "html",
        "css",
        "javascript",
        "python",
        "git"
    ],

    "ai engineer": [
        "python",
        "machine learning",
        "mathematics",
        "data science",
        "deep learning"
    ],

    "data scientist": [
        "python",
        "statistics",
        "data analysis",
        "machine learning",
        "sql"
    ],

    "ui/ux designer": [
        "figma",
        "ui design",
        "ux research",
        "wireframing",
        "prototyping"
    ]
}


@app.route("/")
def home():
    return "LIFEPRINT Skill DNA Engine is running!"


@app.route("/analyze", methods=["POST"])
def analyze_skills():
    auth_error = login_required()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}

    skills = data.get("skills", [])
    career = data.get("career", "")

    if not isinstance(skills, list) or not isinstance(career, str):
        return jsonify({"error": "Invalid profile information"}), 400

    # Clean the user's skills
    user_skills = [
        skill.strip().lower()
        for skill in skills
        if isinstance(skill, str) and skill.strip()
    ]

    selected_career = career.strip().lower()

    # Find the required skills for the selected career
    required_skills = CAREER_SKILLS.get(selected_career)

    if required_skills is None:
        return jsonify({
            "error": "Career not available yet. Try Frontend Developer, Web Developer, AI Engineer, Data Scientist or UI/UX Designer."
        }), 400

    # Compare existing skills with required skills
    matched_skills = [
        skill for skill in required_skills
        if skill in user_skills
    ]

    missing_skills = [
        skill for skill in required_skills
        if skill not in user_skills
    ]

    # Calculate readiness percentage
    readiness = round(
        (len(matched_skills) / len(required_skills)) * 100
    )

    result = {
        "career": career,
        "readiness": readiness,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "total_required": len(required_skills),
        "message": "Keep learning and improving your skills!"
    }

    return jsonify(result)


@app.route("/career-match", methods=["POST"])
def career_match():
    auth_error = login_required()
    if auth_error:
        return auth_error
    data = request.get_json(silent=True) or {}

    skills = data.get("skills", [])

    if not isinstance(skills, list):
        return jsonify({"error": "Skills must be a list"}), 400

    # Clean the student's skills
    user_skills = {
        skill.strip().lower()
        for skill in skills
        if isinstance(skill, str) and skill.strip()
    }

    career_results = []

    # Compare the student's skills with every career
    for career, required_skills in CAREER_SKILLS.items():

        matched = [
            skill for skill in required_skills
            if skill in user_skills
        ]

        missing = [
            skill for skill in required_skills
            if skill not in user_skills
        ]

        score = round(
            (len(matched) / len(required_skills)) * 100
        )

        career_results.append({
            "career": career.title(),
            "match_score": score,
            "matched_skills": matched,
            "missing_skills": missing
        })

    # Highest matching career appears first
    career_results.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    return jsonify({
        "total_careers": len(career_results),
        "careers": career_results
    })


@app.route("/future-scenario", methods=["POST"])
def future_scenario():
    auth_error = login_required()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}

    skills = data.get("skills", [])
    career = data.get("career", "")
    scenario_skill = data.get("scenario_skill", "").strip().lower()

    try:
        hours_per_day = float(data.get("hours_per_day", 0))
        weeks = int(data.get("weeks", 0))
        projects = int(data.get("projects", 0))
    except (ValueError, TypeError):
        return jsonify({"error": "Please enter valid numbers"}), 400

    if not isinstance(skills, list) or not isinstance(career, str):
        return jsonify({"error": "Invalid profile information"}), 400

    if not all(isinstance(skill, str) for skill in skills):
        return jsonify({"error": "Skills must contain text values"}), 400

    if not scenario_skill:
        return jsonify({"error": "Please enter a skill to learn"}), 400

    if not (0 < hours_per_day <= 12):
        return jsonify({"error": "Daily hours must be between 1 and 12"}), 400

    if not (1 <= weeks <= 52):
        return jsonify({"error": "Weeks must be between 1 and 52"}), 400

    if not (0 <= projects <= 20):
        return jsonify({"error": "Projects must be between 0 and 20"}), 400

    required_skills = CAREER_SKILLS.get(career.strip().lower())

    if required_skills is None:
        return jsonify({"error": "Please choose a supported career"}), 400

    user_skills = {
        skill.strip().lower()
        for skill in skills
        if skill.strip()
    }

    matched = [
        skill for skill in required_skills
        if skill in user_skills
    ]

    current_readiness = round(
        len(matched) / len(required_skills) * 100
    )

    if scenario_skill not in required_skills:
        return jsonify({
            "error": "Choose a skill required for your selected career."
        }), 400

    if scenario_skill in user_skills:
        return jsonify({
            "error": "You already have this skill. Choose a missing skill."
        }), 400

    # Simulation assumptions:
    # 40 learning hours = estimated completion of one skill
    # Each planned project adds 10 equivalent learning hours

    learning_hours = hours_per_day * 7 * weeks
    project_hours = projects * 10
    total_hours = learning_hours + project_hours

    skill_progress = min(
        100,
        round(total_hours / 40 * 100)
    )

    projected_readiness = round(
        current_readiness +
        (skill_progress / 100) * (100 / len(required_skills))
    )

    projected_readiness = min(100, projected_readiness)

    return jsonify({
        "career": career,
        "scenario_skill": scenario_skill.title(),
        "current_readiness": current_readiness,
        "learning_hours": round(learning_hours, 1),
        "project_hours": project_hours,
        "total_hours": round(total_hours, 1),
        "skill_progress": skill_progress,
        "projected_readiness": projected_readiness,
        "assumption": "40 learning hours per skill; each project contributes 10 equivalent learning hours."
    })


# ==========================================
# STEP 15.5: SAVE PROFILE FOR LOGGED-IN USER
# ==========================================

@app.route("/save-profile", methods=["POST"])
def save_profile():

    auth_error = login_required()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()

    if not name:
        return jsonify({
            "success": False,
            "error": "Name is required."
        }), 400

    skills = data.get("skills", "")

    if isinstance(skills, list):
        skills = ", ".join(str(skill) for skill in skills)

    user_id = session["user_id"]
    profile_id = data.get("profile_id")

    connection = get_db_connection()

    try:

        saved_id = None

        # Update only a profile owned by this logged-in user.
        if profile_id:

            profile = connection.execute("""
                SELECT id
                FROM profiles
                WHERE id = ? AND user_id = ?
            """, (profile_id, user_id)).fetchone()

            if profile:

                connection.execute("""
                    UPDATE profiles
                    SET name = ?,
                        education = ?,
                        branch = ?,
                        skills = ?,
                        interest = ?,
                        career = ?,
                        hours = ?
                    WHERE id = ? AND user_id = ?
                """, (
                    name,
                    data.get("education", ""),
                    data.get("branch", ""),
                    skills,
                    data.get("interest", ""),
                    data.get("career", ""),
                    str(data.get("hours", "")),
                    profile_id,
                    user_id
                ))

                saved_id = profile_id

        # Create a new profile if no owned profile was found.
        if saved_id is None:

            cursor = connection.execute("""
                INSERT INTO profiles
                (
                    user_id,
                    name,
                    education,
                    branch,
                    skills,
                    interest,
                    career,
                    hours
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                name,
                data.get("education", ""),
                data.get("branch", ""),
                skills,
                data.get("interest", ""),
                data.get("career", ""),
                str(data.get("hours", ""))
            ))

            saved_id = cursor.lastrowid

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Your profile has been saved successfully!",
            "profile_id": saved_id
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

    finally:
        connection.close()


# ==========================================
# GET PROFILE FOR CURRENTLY LOGGED-IN USER
# ==========================================

@app.route("/my-profile", methods=["GET"])
def get_my_profile():

    auth_error = login_required()
    if auth_error:
        return auth_error

    user_id = session["user_id"]

    connection = get_db_connection()

    try:
        profile = connection.execute("""
            SELECT id, name, education, branch, skills,
                   interest, career, hours
            FROM profiles
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        """, (user_id,)).fetchone()

        if profile is None:
            return jsonify({
                "success": True,
                "profile": None
            }), 200

        profile_data = dict(profile)

        profile_data["profile_id"] = profile_data.pop("id")

        profile_data["skills"] = [
            skill.strip()
            for skill in (profile_data["skills"] or "").split(",")
            if skill.strip()
        ]

        return jsonify({
            "success": True,
            "profile": profile_data
        }), 200

    finally:
        connection.close()

# ==========================================
# STEP 15.5: SAVE USER-OWNED LEARNING PROGRESS
# ==========================================

@app.route("/save-progress", methods=["POST"])
def save_progress():

    auth_error = login_required()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}

    profile_id = data.get("profile_id")
    career = str(data.get("career", "")).strip().lower()
    tasks = data.get("tasks", [])
    completed_tasks = data.get("completed_tasks", [])

    if not profile_id or not career:
        return jsonify({
            "error": "Profile ID and career are required."
        }), 400

    if not isinstance(tasks, list) or not isinstance(completed_tasks, list):
        return jsonify({
            "error": "Invalid learning progress data."
        }), 400

    connection = get_db_connection()

    try:

        # Verify that this profile belongs to the logged-in user.
        profile = connection.execute("""
            SELECT id
            FROM profiles
            WHERE id = ? AND user_id = ?
        """, (profile_id, session["user_id"])).fetchone()

        if not profile:
            return jsonify({
                "error": "Profile not found or access denied."
            }), 403

        connection.execute("""
            DELETE FROM learning_progress
            WHERE profile_id = ? AND career = ?
        """, (profile_id, career))

        saved_count = 0

        for index in completed_tasks:

            if not isinstance(index, int) or isinstance(index, bool):
                continue

            if index < 0 or index >= len(tasks):
                continue

            task_text = tasks[index]

            if not isinstance(task_text, str):
                continue

            connection.execute("""
                INSERT INTO learning_progress
                (profile_id, career, task_index, task_text, completed)
                VALUES (?, ?, ?, ?, 1)
            """, (
                profile_id,
                career,
                index,
                task_text
            ))

            saved_count += 1

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Learning progress saved successfully!",
            "completed_count": saved_count
        }), 200

    except Exception as error:

        connection.rollback()

        return jsonify({
            "error": str(error)
        }), 500

    finally:
        connection.close()


# ==========================================
# STEP 15.5: LOAD USER-OWNED LEARNING PROGRESS
# ==========================================

@app.route("/get-progress/<int:profile_id>/<path:career>", methods=["GET"])
def get_progress(profile_id, career):

    auth_error = login_required()
    if auth_error:
        return auth_error

    connection = get_db_connection()

    try:

        # Check profile ownership before loading progress.
        profile = connection.execute("""
            SELECT id
            FROM profiles
            WHERE id = ? AND user_id = ?
        """, (profile_id, session["user_id"])).fetchone()

        if not profile:
            return jsonify({
                "error": "Profile not found or access denied."
            }), 403

        rows = connection.execute("""
            SELECT task_index, task_text
            FROM learning_progress
            WHERE profile_id = ? AND career = ?
            ORDER BY task_index
        """, (profile_id, career.lower())).fetchall()

        completed_tasks = [
            row["task_index"] for row in rows
        ]

        return jsonify({
            "completed_tasks": completed_tasks,
            "completed_count": len(completed_tasks)
        }), 200

    finally:
        connection.close()
  

# ==========================================
# STEP 12: PERSONALIZED LEARNING ADVISOR
# ==========================================

SKILL_RECOMMENDATIONS = {

    "html": {
        "action": "Learn HTML elements, forms, tables and semantic tags.",
        "practice": "Create a personal portfolio webpage."
    },

    "css": {
        "action": "Learn Flexbox, Grid, colours, spacing and responsive design.",
        "practice": "Design a responsive landing page."
    },

    "javascript": {
        "action": "Learn variables, functions, arrays, objects and DOM events.",
        "practice": "Build an interactive to-do list."
    },

    "git": {
        "action": "Learn repositories, commits, branches and GitHub basics.",
        "practice": "Upload one of your projects to GitHub."
    },

    "responsive design": {
        "action": "Learn media queries and mobile-first layouts.",
        "practice": "Make your website work on mobile, tablet and desktop."
    },

    "python": {
        "action": "Learn variables, conditions, loops, functions and data structures.",
        "practice": "Create a simple student marks calculator."
    },

    "machine learning": {
        "action": "Understand supervised learning, unsupervised learning and model evaluation.",
        "practice": "Build a basic classification project using a sample dataset."
    },

    "mathematics": {
        "action": "Practise algebra, probability, statistics and linear algebra fundamentals.",
        "practice": "Solve basic mathematical problems used in machine learning."
    },

    "data science": {
        "action": "Learn data cleaning, exploration and visualization.",
        "practice": "Explore a small student performance dataset."
    },

    "deep learning": {
        "action": "Understand neural networks, layers, activation functions and training.",
        "practice": "Experiment with a beginner neural-network example."
    },

    "statistics": {
        "action": "Learn mean, median, mode, probability and standard deviation.",
        "practice": "Analyse a small dataset and summarize its statistics."
    },

    "data analysis": {
        "action": "Learn data cleaning, interpretation and visualization.",
        "practice": "Create a report from a sample dataset."
    },

    "sql": {
        "action": "Learn SELECT, INSERT, UPDATE, DELETE and JOIN queries.",
        "practice": "Create a small student database and query it."
    },

    "figma": {
        "action": "Learn frames, components, auto layout and design tools.",
        "practice": "Design a mobile app screen in Figma."
    },

    "ui design": {
        "action": "Study typography, colours, spacing and visual hierarchy.",
        "practice": "Redesign a simple website homepage."
    },

    "ux research": {
        "action": "Learn user interviews, personas and usability testing.",
        "practice": "Ask a few people to test a simple app design."
    },

    "wireframing": {
        "action": "Learn how to plan page layouts before designing them.",
        "practice": "Create a wireframe for a student portal."
    },

    "prototyping": {
        "action": "Learn how to connect screens and create interactive prototypes.",
        "practice": "Create a clickable prototype for a mobile app."
    }
}


@app.route("/learning-recommendations", methods=["POST"])
def learning_recommendations():
    auth_error = login_required()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}

    career = str(data.get("career", "")).strip().lower()
    user_skills = data.get("skills", [])

    if not career:
        return jsonify({"error": "Please provide a career goal."}), 400

    if career not in CAREER_SKILLS:
        return jsonify({"error": "Career not found."}), 400

    if isinstance(user_skills, str):
        user_skills = user_skills.split(",")

    if not isinstance(user_skills, list):
        return jsonify({"error": "Skills must be a list."}), 400

    user_skills = [
        str(skill).strip().lower()
        for skill in user_skills
        if str(skill).strip()
    ]

    required_skills = CAREER_SKILLS[career]

    matched_skills = [
        skill for skill in required_skills
        if skill.lower() in user_skills
    ]

    missing_skills = [
        skill for skill in required_skills
        if skill.lower() not in user_skills
    ]

    recommendations = []

    for skill in missing_skills:

        recommendation = SKILL_RECOMMENDATIONS.get(
            skill.lower(),
            {
                "action": "Study the fundamentals and understand the important concepts.",
                "practice": "Complete a small beginner-level practical exercise."
            }
        )

        recommendations.append({
            "skill": skill,
            "action": recommendation["action"],
            "practice": recommendation["practice"]
        })

    return jsonify({
        "career": career,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendations": recommendations,
        "message": (
            "Great work! You have matched all listed career skills."
            if not missing_skills
            else "Focus on the recommended skills one by one."
        )
    }), 200


# ==========================================
# STEP 15.2 - USER SIGNUP API
# ==========================================

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Please fill in all required fields."
        }), 400

    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({
            "success": False,
            "message": "Please enter a valid email address."
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 8 characters."
        }), 400

    if len(name) > 100 or len(email) > 254 or len(password) > 128:
        return jsonify({
            "success": False,
            "message": "One or more fields are too long."
        }), 400

    password_hash = generate_password_hash(password)

    connection = get_db_connection()

    try:
        cursor = connection.execute("""
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        """, (name, email, password_hash))

        connection.commit()

        user_id = cursor.lastrowid

        session.clear()
        session["user_id"] = user_id
        session["user_name"] = name

        return jsonify({
            "success": True,
            "message": "Your LIFEPRINT account has been created successfully!",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }), 201

    except sqlite3.IntegrityError:
        return jsonify({
            "success": False,
            "message": "This email is already registered. Please log in."
        }), 409

    finally:
        connection.close()


# ==========================================
# STEP 15.2 - USER LOGIN API
# ==========================================

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Please enter your email and password."
        }), 400

    connection = get_db_connection()

    try:
        user = connection.execute("""
            SELECT id, name, email, password_hash
            FROM users
            WHERE email = ?
        """, (email,)).fetchone()

        if user is None or not check_password_hash(
            user["password_hash"], password
        ):
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        session.clear()
        session["user_id"] = user["id"]
        session["user_name"] = user["name"]

        return jsonify({
            "success": True,
            "message": "Login successful. Welcome back!",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }), 200

    finally:
        connection.close()


# ==========================================
# STEP 15.2 - CHECK LOGIN STATUS
# ==========================================

@app.route("/auth-status", methods=["GET"])
def auth_status():
    if "user_id" not in session:
        return jsonify({
            "authenticated": False
        }), 200

    return jsonify({
        "authenticated": True,
        "user": {
            "id": session["user_id"],
            "name": session.get("user_name", "")
        }
    }), 200


# ==========================================
# STEP 15.2 - USER LOGOUT API
# ==========================================

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({
        "success": True,
        "message": "You have logged out successfully."
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
