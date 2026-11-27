console.log("LIFEPRINT dashboard.js loaded successfully!");
// ==========================================
// LIFEPRINT STEP 10: ADVANCED DASHBOARD
// ==========================================

window.LIFEPRINT_API_URL = "http://127.0.0.1:5000";

let profile = null;

const dashboardMessage =
    document.getElementById("dashboardMessage");

const API_URL = window.LIFEPRINT_API_URL;

async function initializeDashboard() {

    try {
        const response = await fetch(
            API_URL + "/my-profile",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not load your profile.");
        }

        profile = data.profile;

        // No profile saved for this account
        if (!profile) {

            localStorage.removeItem("lifeprintProfile");
            localStorage.removeItem("lifeprintProfileId");

            setText("dashboardName", "Student");
            setText("dashEducation", "-");
            setText("dashBranch", "-");
            setText("dashCareer", "-");
            setText("dashInterest", "-");
            setText("dashHours", "-");
            setText("dashSkills", "-");

            if (dashboardMessage) {
                dashboardMessage.textContent =
                    "No profile found for this account. Please save your profile first.";
            }

            return;
        }

        // Keep the current account's profile available to existing features
        localStorage.setItem(
            "lifeprintProfile",
            JSON.stringify(profile)
        );

        localStorage.setItem(
            "lifeprintProfileId",
            profile.profile_id
        );

        continueDashboard();
      

    } catch (error) {

        console.error("Profile loading error:", error);

        if (dashboardMessage) {
            dashboardMessage.textContent =
                "Unable to load your profile: " + error.message;
        }
    }
}
// Career learning roadmaps
const dashboardRoadmaps = {
    "frontend developer": [
        "Learn HTML fundamentals",
        "Practice CSS styling",
        "Learn JavaScript basics",
        "Build a responsive website",
        "Learn Git and GitHub",
        "Complete a frontend project"
    ],
    "web developer": [
        "Learn HTML fundamentals",
        "Practice CSS styling",
        "Learn JavaScript",
        "Learn Python basics",
        "Understand Git and GitHub",
        "Build a complete website"
    ],
    "ai engineer": [
        "Learn Python programming",
        "Understand mathematics for AI",
        "Learn data science basics",
        "Study machine learning fundamentals",
        "Practice with a dataset",
        "Build a small AI project"
    ],
    "data scientist": [
        "Learn Python programming",
        "Study statistics basics",
        "Practice data analysis",
        "Learn SQL fundamentals",
        "Understand machine learning",
        "Complete a data analysis project"
    ],
    "ui/ux designer": [
        "Understand UI design principles",
        "Study UX research basics",
        "Learn wireframing",
        "Practice with Figma",
        "Create a prototype",
        "Build a design portfolio"
    ]
};
// ==========================================
// ROADMAP LEARNING WEBSITE LINKS
// ==========================================

const roadmapLearningLinks = {
    // FRONTEND / WEB DEVELOPMENT
    "learn html fundamentals":
        "https://www.w3schools.com/html/",

    "practice css styling":
        "https://www.w3schools.com/css/",

    "learn javascript basics":
        "https://www.w3schools.com/js/",

    "learn javascript":
        "https://www.w3schools.com/js/",

    "learn python basics":
        "https://www.w3schools.com/python/",

    "understand git and github":
        "https://docs.github.com/en/get-started",

    "learn git and github":
        "https://docs.github.com/en/get-started",

    "build a responsive website":
        "https://www.w3schools.com/howto/howto_css_responsive.asp",

    "complete a frontend project":
        "https://www.frontendmentor.io/challenges",

    "build a complete website":
        "https://www.w3schools.com/howto/",

    // AI ENGINEERING
    "learn python programming":
        "https://www.w3schools.com/python/",

    "understand mathematics for ai":
        "https://www.khanacademy.org/math",

    "learn data science basics":
        "https://www.kaggle.com/learn",

    "study machine learning fundamentals":
        "https://developers.google.com/machine-learning/crash-course",

    "practice with a dataset":
        "https://www.kaggle.com/datasets",

    "build a small ai project":
        "https://www.kaggle.com/learn",

    // DATA SCIENCE
    "study statistics basics":
        "https://www.khanacademy.org/math/statistics-probability",

    "practice data analysis":
        "https://www.kaggle.com/learn",

    "learn sql fundamentals":
        "https://www.w3schools.com/sql/",

    "understand machine learning":
        "https://developers.google.com/machine-learning/crash-course",

    "complete a data analysis project":
        "https://www.kaggle.com/learn",

    // UI / UX DESIGN
    "understand ui design principles":
        "https://www.figma.com/resource-library/ui-design/",

    "study ux research basics":
        "https://www.nngroup.com/articles/ux-research-cheat-sheet/",

    "learn wireframing":
        "https://www.figma.com/resource-library/what-is-wireframing/",

    "practice with figma":
        "https://help.figma.com/hc/en-us",

    "create a prototype":
        "https://help.figma.com/hc/en-us/categories/360002051613",

    "build a design portfolio":
        "https://www.behance.net/"
};

// Get learning website for each roadmap task
function getRoadmapLearningLink(task) {

    const key = task.trim().toLowerCase();

    return roadmapLearningLinks[key] ||
        "https://www.google.com/search?q=" +
        encodeURIComponent(task + " tutorial for beginners");
}

// ==========================================
// STEP 11: VISUAL ANALYTICS FUNCTIONS
// ==========================================

// Create a horizontal visual chart
function createAnalyticsBar(label, value, fillColor) {

    const row = document.createElement("div");
    row.className = "analytics-row";

    const labelElement = document.createElement("span");
    labelElement.className = "analytics-label";
    labelElement.textContent = label;

    const track = document.createElement("div");
    track.className = "analytics-track";

    const fill = document.createElement("div");
    fill.className = "analytics-fill";

    const safeValue = Math.max(
        0,
        Math.min(100, Number(value) || 0)
    );

    fill.style.width = safeValue + "%";
    fill.style.background = fillColor;

    track.appendChild(fill);

    const valueElement = document.createElement("span");
    valueElement.className = "analytics-value";
    valueElement.textContent = safeValue + "%";

    row.append(labelElement, track, valueElement);

    return row;
}

// Display Skill DNA chart
function displaySkillChart(matched, missing) {

    const chart = document.getElementById("skillChart");

    if (!chart) return;

    chart.innerHTML = "";

    const total = matched.length + missing.length;

    const matchedPercentage = total
        ? Math.round((matched.length / total) * 100)
        : 0;

    const missingPercentage = 100 - matchedPercentage;

    const heading = document.createElement("h3");
    heading.textContent = "Skill DNA Visualization";

    chart.appendChild(heading);

    chart.appendChild(
        createAnalyticsBar(
            "Matched Skills",
            matchedPercentage,
            "#16a34a"
        )
    );

    chart.appendChild(
        createAnalyticsBar(
            "Missing Skills",
            missingPercentage,
            "#f59e0b"
        )
    );

    const summary = document.createElement("p");
    summary.className = "analytics-summary";
    summary.textContent =
        "You currently match " + matched.length +
        " out of " + total +
        " required skills in this career profile.";

    chart.appendChild(summary);
}

// Display career comparison chart
function displayCareerChart(careers) {

    const chart = document.getElementById("careerChart");

    if (!chart) return;

    chart.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Career Compatibility Comparison";

    chart.appendChild(heading);

    careers.forEach(item => {

        chart.appendChild(
            createAnalyticsBar(
                item.career,
                item.match_score,
                "#8b70ef"
            )
        );
    });

    if (careers.length === 0) {
        chart.textContent = "No career comparison data available.";
    }
}

// Display learning progress chart
function displayProgressChart(completed, total) {

    const chart = document.getElementById("progressAnalytics");

    if (!chart) return;

    chart.innerHTML = "";

    const remaining = Math.max(0, total - completed);

    const percentage = total
        ? Math.round((completed / total) * 100)
        : 0;

    const heading = document.createElement("h3");
    heading.textContent = "Learning Progress Analytics";

    chart.appendChild(heading);

    chart.appendChild(
        createAnalyticsBar(
            "Completed",
            percentage,
            "#16a34a"
        )
    );

    chart.appendChild(
        createAnalyticsBar(
            "Remaining",
            100 - percentage,
            "#f59e0b"
        )
    );

    const summary = document.createElement("p");
    summary.className = "analytics-summary";
    summary.textContent =
        completed + " tasks completed and " +
        remaining + " tasks remaining.";

    chart.appendChild(summary);
}

// Convert skills into an array
function getSkills() {
    if (!profile) return [];

    if (Array.isArray(profile.skills)) {
        return profile.skills.map(skill =>
            String(skill).trim().toLowerCase()
        ).filter(Boolean);
    }

    return String(profile.skills || "")
        .split(",")
        .map(skill => skill.trim().toLowerCase())
        .filter(Boolean);
}

// Display text safely
function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value || "-";
    }
}
// ==========================================
// START DASHBOARD AFTER PROFILE LOAD
// ==========================================

function continueDashboard() {

    // ==================================
    // 1. DISPLAY PROFILE INFORMATION
    // ==================================

    setText("dashboardName", profile.name);
    setText("dashEducation", profile.education);
    setText("dashBranch", profile.branch);
    setText("dashCareer", profile.career);
    setText("dashInterest", profile.interest);
    setText("dashHours", profile.hours);
    setText("dashSkills", getSkills().join(", "));

    
    // ==================================
    // 2. SKILL DNA ANALYSIS
    // ==================================

    const analysisButton = document.getElementById("loadAnalysisButton");
    const resultBox = document.getElementById("dashboardAnalysis");

    if (analysisButton) {
        analysisButton.addEventListener("click", async function () {

            if (!resultBox) {
                console.error("dashboardAnalysis element not found in dashboard.html");
                return;
            }

            if (!profile) {
                resultBox.textContent = "Please save your profile first.";
                return;
            }

            const skills = getSkills();
            const career = String(profile.career || "").trim().toLowerCase();

            resultBox.textContent = "Analyzing your skills...";

            console.log("LIFEPRINT ANALYSIS REQUEST:", { skills, career });

            try {
                const response = await fetch(API_URL + "/analyze", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        skills: skills,
                        career: career
                    })
                });

                const responseText = await response.text();

                console.log("ANALYZE HTTP STATUS:", response.status);
                console.log("ANALYZE SERVER RESPONSE:", responseText);

                let data;

                try {
                    data = JSON.parse(responseText);
                } catch {
                    throw new Error("Server did not return valid JSON.");
                }

                if (!response.ok) {
                    throw new Error(data.error || "Skill analysis failed.");
                }

                const matched = data.matched_skills || [];
                const missing = data.missing_skills || [];

                resultBox.innerHTML = "";

                const heading = document.createElement("h3");
                heading.textContent = "Your Skill DNA Report";

                const readiness = document.createElement("p");
                readiness.textContent =
                    "Career Readiness: " +
                    (data.readiness ?? data.readiness_score ?? 0) + "%";

                const matchedHeading = document.createElement("h3");
                matchedHeading.textContent = "Matched Skills";

                const matchedText = document.createElement("p");
                matchedText.textContent = matched.join(", ") || "None yet";

                const missingHeading = document.createElement("h3");
                missingHeading.textContent = "Skills to Learn";

                const missingText = document.createElement("p");
                missingText.textContent = missing.join(", ") || "None";

                resultBox.append(
                    heading,
                    readiness,
                    matchedHeading,
                    matchedText,
                    missingHeading,
                    missingText
                );

                displaySkillChart(matched, missing);

            } catch (error) {
                console.error("Skill DNA error:", error);
                resultBox.textContent =
                    "Could not load Skill DNA: " + error.message;
            }
        });
    }

  
    // ==================================
    // 3. CAREER MATCHER
    // ==================================

    const careerButton =
        document.getElementById("loadCareerButton");

    if (careerButton) {
        careerButton.addEventListener("click", async function () {

            const resultBox =
                document.getElementById("dashboardCareers");

            resultBox.textContent = "Finding your career matches...";

            try {

                const response = await fetch(
                    API_URL + "/career-match",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            skills: getSkills()
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Career matching failed.");
                }

                resultBox.innerHTML = "";

                const heading = document.createElement("h3");
                heading.textContent = "Your Career Matches";
                resultBox.appendChild(heading);

                const careers = data.careers || [];

                if (careers.length === 0) {
                    resultBox.textContent =
                        "No career matches found. Add more skills to your profile.";
                    return;
                }

                careers.forEach(item => {

                    const card = document.createElement("div");
                    card.className = "dashboard-task";

                    const name = document.createElement("h3");
                    name.textContent = item.career;

                    const score = document.createElement("p");
                    score.textContent =
                        "Match Score: " + item.match_score + "%";

                    const matched = document.createElement("p");
                    matched.textContent =
                        "Matched Skills: " +
                        (item.matched_skills || []).join(", ");

                    const missing = document.createElement("p");
                    missing.textContent =
                        "Skills to Learn: " +
                        (item.missing_skills || []).join(", ");

                    card.append(name, score, matched, missing);
                    resultBox.appendChild(card);

                    displayCareerChart(careers);
                });

            } catch (error) {

                resultBox.textContent =
                    "Could not load career matches. " + error.message;
            }
        });
    }


// ==========================================
// STEP 12: PERSONALIZED LEARNING ADVISOR
// ==========================================

const recommendationButton =
    document.getElementById("getRecommendationsButton");

if (recommendationButton) {

    recommendationButton.addEventListener("click", async function () {

        const resultBox =
            document.getElementById("learningRecommendations");

        resultBox.textContent =
            "Preparing your personalized learning plan...";

        try {

            const response = await fetch(
                window.LIFEPRINT_API_URL + "/learning-recommendations",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        career: profile.career,
                        skills: getSkills()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to generate recommendations."
                );
            }

            resultBox.innerHTML = "";

            const heading = document.createElement("h3");
            heading.textContent =
                "Your Learning Plan: " + data.career;

            resultBox.appendChild(heading);

            const matchedHeading = document.createElement("h3");
            matchedHeading.textContent = "Skills You Already Have";

            resultBox.appendChild(matchedHeading);

            const matchedText = document.createElement("p");
            matchedText.textContent =
                data.matched_skills.length
                    ? data.matched_skills.join(", ")
                    : "No required skills matched yet.";

            resultBox.appendChild(matchedText);

            const missingHeading = document.createElement("h3");
            missingHeading.textContent = "Skills You Should Learn";

            resultBox.appendChild(missingHeading);

            if (data.recommendations.length === 0) {

                const successText = document.createElement("p");
                successText.textContent = data.message;

                resultBox.appendChild(successText);

            } else {

                data.recommendations.forEach((item, index) => {

                    const card = document.createElement("div");
                    card.className = "dashboard-task";

                    const skillTitle = document.createElement("h3");
                    skillTitle.textContent =
                        (index + 1) + ". " + item.skill;

                    const action = document.createElement("p");
                    action.textContent =
                        "What to learn: " + item.action;

                    const practice = document.createElement("p");
                    practice.textContent =
                        "Practice task: " + item.practice;

                    card.append(skillTitle, action, practice);

                    resultBox.appendChild(card);
                });
            }

            const note = document.createElement("p");
            note.className = "analytics-summary";
            note.textContent =
                "These recommendations are based on the career skill requirements configured in LIFEPRINT. They are learning suggestions, not a guarantee of employment.";

            resultBox.appendChild(note);

        } catch (error) {

            resultBox.textContent =
                "Could not generate your learning plan. " +
                error.message;
        }
    });
}


// ==========================================
// STEP 13A: PROJECT RECOMMENDATION ENGINE
// ==========================================

const projectIdeas = {

    "frontend developer": [
        {
            name: "Personal Portfolio Website",
            level: "Beginner",
            description: "Create a portfolio with your introduction, skills, education and projects.",
            skills: "HTML, CSS and JavaScript"
        },
        {
            name: "Interactive To-Do List",
            level: "Beginner",
            description: "Build an application to add, complete and delete daily tasks.",
            skills: "JavaScript, DOM manipulation and CSS"
        },
        {
            name: "Weather Dashboard",
            level: "Intermediate",
            description: "Create a weather interface that displays information from a weather API.",
            skills: "JavaScript, APIs and responsive design"
        }
    ],

    "web developer": [
        {
            name: "Student Management System",
            level: "Beginner",
            description: "Create a website to store and display student details.",
            skills: "HTML, CSS, JavaScript, Python and SQLite"
        },
        {
            name: "Online Bookstore",
            level: "Intermediate",
            description: "Build a website with book listings, search and basic database operations.",
            skills: "Frontend development, Flask and SQLite"
        },
        {
            name: "Event Booking Website",
            level: "Intermediate",
            description: "Create an event listing and booking application.",
            skills: "HTML, CSS, JavaScript, Flask and SQLite"
        }
    ],

    "ai engineer": [
        {
            name: "Student Performance Predictor",
            level: "Beginner",
            description: "Explore a sample dataset and build a basic student performance prediction model.",
            skills: "Python, data analysis and machine learning"
        },
        {
            name: "Image Classification System",
            level: "Intermediate",
            description: "Train a basic model to classify images into categories.",
            skills: "Python, datasets and machine learning"
        },
        {
            name: "AI Career Recommendation Prototype",
            level: "Intermediate",
            description: "Create a rule-based prototype that compares student skills with career requirements.",
            skills: "Python, data structures and recommendation logic"
        }
    ],

    "data scientist": [
        {
            name: "Student Data Analysis",
            level: "Beginner",
            description: "Analyse student marks and identify patterns in a sample dataset.",
            skills: "Python, statistics and data analysis"
        },
        {
            name: "Sales Data Dashboard",
            level: "Intermediate",
            description: "Explore sales data and create visual reports.",
            skills: "Python, SQL and data visualization"
        },
        {
            name: "Customer Behaviour Analysis",
            level: "Intermediate",
            description: "Study a sample customer dataset and identify useful patterns.",
            skills: "Statistics, Python and data analysis"
        }
    ],

    "ui/ux designer": [
        {
            name: "Student App UI Design",
            level: "Beginner",
            description: "Design the screens for a student learning application.",
            skills: "Figma, UI design and wireframing"
        },
        {
            name: "Food Delivery App Prototype",
            level: "Intermediate",
            description: "Create an interactive prototype for ordering food.",
            skills: "Figma, UX research and prototyping"
        },
        {
            name: "College Website Redesign",
            level: "Intermediate",
            description: "Redesign a college website with improved navigation and usability.",
            skills: "UI design, UX research and wireframing"
        }
    ]
};

const projectButton =
    document.getElementById("projectRecommendationButton");

if (projectButton) {

    projectButton.addEventListener("click", function () {

        const container =
            document.getElementById("projectRecommendations");

        container.innerHTML = "";

        const career = String(profile.career || "")
            .toLowerCase();

        const projects = projectIdeas[career] || [];

        if (projects.length === 0) {
            container.textContent =
                "No project suggestions are configured for this career yet.";
            return;
        }

        const heading = document.createElement("h3");
        heading.textContent =
            "Recommended Projects for " + profile.career;

        container.appendChild(heading);

        projects.forEach((project, index) => {

            const card = document.createElement("div");
            card.className = "final-feature-card";

            const title = document.createElement("h3");
            title.textContent =
                (index + 1) + ". " + project.name;

            const level = document.createElement("p");
            level.textContent = "Difficulty: " + project.level;

            const description = document.createElement("p");
            description.textContent = project.description;

            const skills = document.createElement("p");
            skills.textContent =
                "Skills involved: " + project.skills;

            card.append(title, level, description, skills);

            container.appendChild(card);
        });
    });
}


// ==========================================
// STEP 13B: PERSONALIZED LEARNING ROADMAP
// ==========================================

const roadmapContainer =
    document.getElementById("personalizedRoadmap");

if (roadmapContainer) {

    const career = String(profile.career || "")
        .toLowerCase();

    const roadmapTasks = dashboardRoadmaps[career] || [
        "Identify your career requirements",
        "Learn the required fundamentals",
        "Practise your technical skills",
        "Complete a beginner project",
        "Build your portfolio",
        "Review and improve your skills"
    ];

    roadmapContainer.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent =
        "Your Learning Roadmap – " + profile.career;

    roadmapContainer.appendChild(heading);

    
roadmapTasks.forEach((task, index) => {

    const step = document.createElement("div");
    step.className = "roadmap-step";

    const number = document.createElement("div");
    number.className = "roadmap-number";
    number.textContent = index + 1;

    const content = document.createElement("div");
    content.className = "roadmap-content";

    // Clickable learning title
    const title = document.createElement("a");
    title.className = "roadmap-learning-link";
    title.textContent = "📚 " + task;

    title.href = getRoadmapLearningLink(task);
    title.target = "_blank";
    title.rel = "noopener noreferrer";

    // Description
    const description = document.createElement("p");

    description.textContent =
        index === 0
            ? "Start with the fundamentals. Click the topic to start learning."
            : "Click this topic to open its learning resources.";

    content.append(title, description);
    step.append(number, content);

    roadmapContainer.appendChild(step);
});

}


// ==========================================
// STEP 13C: DOWNLOADABLE CAREER REPORT
// ==========================================

function escapeReportText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

const reportButton =
    document.getElementById("generateReportButton");

if (reportButton) {

    reportButton.addEventListener("click", async function () {

        const message =
            document.getElementById("reportMessage");

        message.textContent =
            "Preparing your career readiness report...";

        try {

            // Get Skill DNA analysis
            const analysisResponse = await fetch(
                window.LIFEPRINT_API_URL + "/analyze",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
    skills: getSkills(),
    career: String(profile.career || "").trim().toLowerCase()
})
                }
            );

            const analysis = await analysisResponse.json();

            if (!analysisResponse.ok) {
                throw new Error(
                    analysis.error || "Skill analysis failed."
                );
            }

            // Get career matches
            const careerResponse = await fetch(
                API_URL + "/career-match",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        skills: getSkills()
                    })
                }
            );

            const careerData = await careerResponse.json();

            if (!careerResponse.ok) {
                throw new Error(
                    careerData.error || "Career matching failed."
                );
            }

            // Get progress from browser storage
            const career = String(
                profile.career || "frontend developer"
            ).toLowerCase();

            const tasks = dashboardRoadmaps[career] || [];

            const completed = JSON.parse(
                localStorage.getItem(
                    "lifeprintProgress_" + profile.profile_id +"_" +career
                ) || "[]"
            );

            const progress = tasks.length
                ? Math.round(
                    (completed.length / tasks.length) * 100
                )
                : 0;

            const matchedSkills =
                (analysis.matched_skills || [])
                .map(escapeReportText);

            const missingSkills =
                (analysis.missing_skills || [])
                .map(escapeReportText);

            const careerRows =
                (careerData.careers || []).map(item => `
                    <tr>
                        <td>${escapeReportText(item.career)}</td>
                        <td>${escapeReportText(item.match_score)}%</td>
                    </tr>
                `).join("");

            const roadmapRows = tasks.map((task, index) => `
                <li>
                    ${escapeReportText(task)}
                    ${completed.includes(index)
                        ? " — Completed"
                        : " — Pending"}
                </li>
            `).join("");

            const reportHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LIFEPRINT Career Readiness Report</title>

<style>
body {
    font-family: Arial, sans-serif;
    max-width: 850px;
    margin: 35px auto;
    padding: 25px;
    color: #222;
    line-height: 1.7;
}
h1, h2 {
    color: #49358c;
}
.header {
    text-align: center;
    border-bottom: 2px solid #8062e8;
    padding-bottom: 20px;
}
.section {
    margin-top: 25px;
}
table {
    width: 100%;
    border-collapse: collapse;
}
td, th {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}
th {
    background: #eee9ff;
}
.print-button {
    padding: 12px 20px;
    background: #6047ba;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
@media print {
    .print-button {
        display: none;
    }
    body {
        margin: 0;
        padding: 10px;
    }
}
</style>
</head>

<body>

<div class="header">
    <h1>LIFEPRINT</h1>
    <h2>Career Readiness Report</h2>
    <p>Your Future, Simulated by AI</p>
</div>

<div class="section">
    <h2>1. Student Profile</h2>
    <p><b>Name:</b> ${escapeReportText(profile.name)}</p>
    <p><b>Education:</b> ${escapeReportText(profile.education)}</p>
    <p><b>Branch:</b> ${escapeReportText(profile.branch)}</p>
    <p><b>Career Goal:</b> ${escapeReportText(profile.career)}</p>
    <p><b>Interest:</b> ${escapeReportText(profile.interest)}</p>
    <p><b>Technical Skills:</b> ${escapeReportText(getSkills().join(", "))}</p>
</div>

<div class="section">
    <h2>2. Skill DNA Analysis</h2>
    <p><b>Career Readiness Score:</b>
    ${escapeReportText(analysis.readiness)}%</p>

    <p><b>Matched Skills:</b>
    ${matchedSkills.join(", ") || "None"}</p>

    <p><b>Skills to Improve:</b>
    ${missingSkills.join(", ") || "None"}</p>
</div>

<div class="section">
    <h2>3. Career Compatibility</h2>
    <table>
        <tr>
            <th>Career</th>
            <th>Match Score</th>
        </tr>
        ${careerRows || "<tr><td colspan='2'>No career results available</td></tr>"}
    </table>
</div>

<div class="section">
    <h2>4. Learning Progress</h2>
    <p><b>Completed:</b> ${completed.length} of ${tasks.length} tasks</p>
    <p><b>Progress:</b> ${progress}%</p>
    <ol>${roadmapRows}</ol>
</div>

<div class="section">
    <h2>5. Next Steps</h2>
    <p>Continue practising missing skills, complete practical projects,
    and update your learning progress regularly.</p>
</div>

<div class="section">
    <p><b>About this report:</b> LIFEPRINT uses rule-based skill matching
    and illustrative scoring assumptions. Scores are not validated
    predictions of employment, job readiness or future performance.</p>
    <p>Generated by LIFEPRINT – Your Future, Simulated by AI.</p>
</div>

<button class="print-button" onclick="window.print()">
    Print / Save as PDF
</button>

</body>
</html>
            `;

            const blob = new Blob(
                [reportHTML],
                { type: "text/html;charset=utf-8" }
            );

            const downloadURL = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadURL;
            link.download = "LIFEPRINT_Career_Report.html";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(downloadURL);

            message.textContent =
                "Your LIFEPRINT career report has been downloaded! Open the HTML file and use Print / Save as PDF to create a PDF.";

        } catch (error) {

            message.textContent =
                "Report generation failed: " + error.message;
        }
    });
}

    // ==================================
    // 4. FUTURE SCENARIO LAB
    // ==================================

    const scenarioForm =
        document.getElementById("dashboardScenarioForm");

    if (scenarioForm) {

        scenarioForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const resultBox =
                document.getElementById("dashboardScenarioResult");

            const scenarioSkill =
                document.getElementById("dashScenarioSkill").value.trim();

            const hours =
                document.getElementById("dashDailyHours").value;

            const weeks =
                document.getElementById("dashWeeks").value;

            const projects =
                document.getElementById("dashProjects").value;

            if (!profile.career) {
                resultBox.textContent =
                    "Please add a career goal to your profile first.";
                return;
            }

            resultBox.textContent = "Running your simulation...";

            try {

                const response = await fetch(
                    window.LIFEPRINT_API_URL + "/future-scenario",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            skills: getSkills(),
                            career: profile.career,
                            scenario_skill: scenarioSkill,
                            hours_per_day: Number(hours),
                            weeks: Number(weeks),
                            projects: Number(projects)
                        })
                    }
                );

               const responseText = await response.text();

console.log("ANALYZE STATUS:", response.status);
console.log("ANALYZE RESPONSE:", responseText);

let data;

try {
    data = JSON.parse(responseText);
} catch (error) {
    throw new Error("Backend returned an invalid response: " + responseText);
}

if (!response.ok) {
    throw new Error(data.error || data.message || "Analysis failed.");
}

                resultBox.innerHTML = "";

                const title = document.createElement("h3");
                title.textContent = "Your Future Scenario Results";

                const values = [
                    ["Current Readiness", data.current_readiness + "%"],
                    ["Learning Hours", data.learning_hours],
                    ["Project Hours", data.project_hours],
                    ["Total Equivalent Hours", data.total_hours],
                    ["Illustrative Skill Progress", data.skill_progress + "%"],
                    ["Projected Readiness", data.projected_readiness + "%"]
                ];

                resultBox.appendChild(title);

                values.forEach(([label, value]) => {
                    const paragraph = document.createElement("p");
                    paragraph.textContent = label + ": " + value;
                    resultBox.appendChild(paragraph);
                });

                const note = document.createElement("p");
                note.textContent = data.assumption ||
                    "This is an illustrative estimate based on project assumptions, not a prediction of actual future performance.";

                resultBox.appendChild(note);

            } catch (error) {

                resultBox.textContent =
                    "Could not run the scenario. " + error.message;
            }
        });
    }

   
    // ==========================================
    // 5. LEARNING PROGRESS - INTERACTIVE CHECKBOXES
    // ==========================================

    async function loadDashboardProgress() {

        const career = String(
            profile.career || "frontend developer"
        ).trim().toLowerCase();

        const tasks = dashboardRoadmaps[career] || [
            "Identify your career goals",
            "Learn the required fundamentals",
            "Practice your skills",
            "Complete a small project",
            "Build your portfolio",
            "Review your progress"
        ];

        const storageKey =
            "lifeprintProgress_" + profile.profile_id + "_" + career;

        let completed = [];

        const taskContainer =
            document.getElementById("dashboardProgressTasks");

        const refreshButton =
            document.getElementById("refreshDashboardButton");

        if (!taskContainer) return;

        taskContainer.innerHTML = "Loading your learning progress...";

        // Load saved progress from Flask / SQLite
        try {
            const response = await fetch(
                API_URL + "/get-progress/" +
                profile.profile_id + "/" +
                encodeURIComponent(career),
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Could not load progress."
                );
            }

            completed = (data.completed_tasks || [])
                .map(Number)
                .filter(index =>
                    Number.isInteger(index) &&
                    index >= 0 &&
                    index < tasks.length
                );

            localStorage.setItem(
                storageKey,
                JSON.stringify(completed)
            );

        } catch (error) {
            console.error("Progress loading error:", error);

            // Use this account's cached progress if server loading fails
            try {
                completed = JSON.parse(
                    localStorage.getItem(storageKey) || "[]"
                );
            } catch {
                completed = [];
            }

            const message =
                document.getElementById("dashboardMessage");

            if (message) {
                message.textContent =
                    "Could not sync progress with the server: " +
                    error.message;
            }
        }

        completed = [...new Set(completed)];

        // Display tasks and attach checkbox events
        taskContainer.innerHTML = "";

        tasks.forEach((task, index) => {

            const label = document.createElement("label");
            label.className = "dashboard-task";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            // IMPORTANT: Checkbox must be enabled
            checkbox.disabled = false;

            checkbox.checked = completed.includes(index);

            const text = document.createElement("span");
            text.textContent = task;

            label.append(checkbox, text);
            taskContainer.appendChild(label);

            // Save whenever the user ticks or unticks a task
            checkbox.addEventListener("change", async function() {

                const previousCompleted = [...completed];

                if (checkbox.checked) {
                    if (!completed.includes(index)) {
                        completed.push(index);
                    }
                } else {
                    completed = completed.filter(
                        item => item !== index
                    );
                }

                completed.sort((a, b) => a - b);

                updateProgressDisplay(completed.length, tasks.length);

                localStorage.setItem(
                    storageKey,
                    JSON.stringify(completed)
                );

                checkbox.disabled = true;

                try {
                    const saveResponse = await fetch(
                        API_URL + "/save-progress",
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                profile_id: profile.profile_id,
                                career: career,
                                tasks: tasks,
                                completed_tasks: completed
                            })
                        }
                    );

                    const saveData = await saveResponse.json();

                    if (!saveResponse.ok) {
                        throw new Error(
                            saveData.error ||
                            saveData.message ||
                            "Progress could not be saved."
                        );
                    }

                    const progressMessage =
                        document.getElementById("dashboardMessage");

                    if (progressMessage) {
                        progressMessage.textContent =
                            "Learning progress saved successfully!";
                    }

                } catch (error) {

                    console.error("Progress saving error:", error);

                    // Restore previous state if saving failed
                    completed = previousCompleted;
                    checkbox.checked = completed.includes(index);

                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(completed)
                    );

                    updateProgressDisplay(
                        completed.length,
                        tasks.length
                    );

                    const progressMessage =
                        document.getElementById("dashboardMessage");

                    if (progressMessage) {
                        progressMessage.textContent =
                            "Unable to save progress: " + error.message;
                    }

                } finally {
                    checkbox.disabled = false;
                }
            });
        });

        updateProgressDisplay(completed.length, tasks.length);

        if (refreshButton) {
            refreshButton.onclick = loadDashboardProgress;
        }
    }

    // ==========================================
    // UPDATE PROGRESS PERCENTAGE AND BAR
    // ==========================================

    function updateProgressDisplay(completed, total) {

        const percentage = total
            ? Math.round((completed / total) * 100)
            : 0;

        setText(
            "dashProgressPercentage",
            percentage + "% Completed"
        );

        setText(
            "dashProgressCount",
            completed + " of " + total + " tasks completed"
        );

        const fill = document.getElementById("dashProgressFill");

        if (fill) {
            fill.style.width = percentage + "%";
        }

        displayProgressChart(completed, total);
    }

    loadDashboardProgress();

}
initializeDashboard();