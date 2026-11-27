
// LIFEPRINT - Initial JavaScript

const startButton = document.getElementById("startButton");

if (startButton) {
    startButton.addEventListener("click", function() {
        window.location.href = "profile.html";
    });
}

// Log website information
const currentYear = new Date().getFullYear();

console.log("Current year:", currentYear);
console.log("Explore possibilities. Build your future.");
