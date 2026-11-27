
# LIFEPRINT – Your Future, Simulated by AI

## 1. Project Overview

LIFEPRINT is a student career-readiness and learning simulation platform.

It helps students understand their existing technical skills, explore suitable career paths, identify skill gaps and create personalized learning plans.

The platform combines a web interface, a Python Flask backend and an SQLite database.

## 2. Problem Statement

Students often find it difficult to identify the technical skills required for their desired careers.

They may not know:
- Which skills they already possess.
- Which skills they need to improve.
- Which careers match their current skills.
- What learning activities they should complete next.

LIFEPRINT addresses these challenges through skill analysis, career matching and structured learning recommendations.

## 3. Project Objectives

1. Collect and manage student profile information.
2. Analyse existing technical skills.
3. Compare skills with career requirements.
4. Simulate illustrative learning scenarios.
5. Recommend learning activities and practical projects.
6. Track student learning progress.
7. Generate a career-readiness report.

## 4. Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Webpage structure |
| CSS | Website design |
| JavaScript | Frontend functionality |
| Python | Backend programming |
| Flask | Backend API framework |
| SQLite | Database |
| VS Code | Development environment |

## 5. Main Modules

### Student Profile
Collects education, branch, interests, skills and career goals.

### Skill DNA Engine
Compares student skills with the required skills of a selected career.

### Career Matcher
Calculates compatibility scores for configured career profiles.

### Future Scenario Lab
Calculates illustrative learning scenarios using configurable assumptions.

### Learning Progress Tracker
Tracks completed learning tasks and stores progress in SQLite.

### Advanced Dashboard
Displays student information, skill analysis, career results and learning progress.

### Personalized Learning Advisor
Suggests missing skills and related practice activities.

### Project Recommendation Engine
Provides beginner and intermediate project ideas based on career goals.

### Career Readiness Report
Generates a downloadable report with student information and analysis results.

## 6. System Architecture

Student
   |
   v
HTML, CSS and JavaScript Frontend
   |
   v
Python Flask REST APIs
   |
   v
Career Matching and Recommendation Logic
   |
   v
SQLite Database

## 7. Database Design

### Profiles Table
Stores:
- Profile ID
- Name
- Education
- Branch
- Skills
- Interest
- Career goal
- Learning hours
- Created date

### Learning Progress Table
Stores:
- Progress ID
- Profile ID
- Career
- Task index
- Task description
- Completion status
- Updated date

## 8. How to Run the Project

### Step 1
Install Python and Visual Studio Code.

### Step 2
Install the required Python packages:

    python -m pip install flask flask-cors

### Step 3
Open the LIFEPRINT project folder in VS Code.

### Step 4
Start the backend:

    python backend/app.py

### Step 5
Open frontend/index.html using Live Server.

## 9. Expected Outcomes

LIFEPRINT provides students with:
- A structured view of their technical skills.
- Career compatibility comparisons.
- Identified learning gaps.
- Personalized learning suggestions.
- Practical project ideas.
- A learning progress tracker.
- A downloadable career-readiness report.

## 10. Limitations

- Career recommendations are based on predefined skill requirements.
- Readiness scores are rule-based estimates, not validated employment predictions.
- Learning scenario calculations use illustrative assumptions.
- Recommendations cover only the careers and skills configured in the application.

## 11. Future Enhancements

- Integration with validated external career skill datasets.
- Machine-learning-based recommendation experiments.
- More career profiles and technical skill categories.
- Secure student authentication.
- Cloud database integration.
- More detailed learning analytics.

## 12. Conclusion

LIFEPRINT provides a structured environment for students to explore their skills, understand career requirements and organize their learning journey.

The platform demonstrates how frontend development, backend APIs, database management and transparent recommendation logic can be integrated into a practical student career-readiness application.
