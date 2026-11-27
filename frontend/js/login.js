
// =====================================
// LIFEPRINT - STUDENT LOGIN
// STEP 15.3
// =====================================

const API_URL = "http://127.0.0.1:5000";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const showLoginPassword =
    document.getElementById("showLoginPassword");

// Show or hide password
showLoginPassword.addEventListener("change", function () {
    loginPassword.type = this.checked ? "text" : "password";
});

// Handle login form
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    loginMessage.textContent = "";
    loginMessage.style.color = "#fca5a5";

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    const loginButton =
        loginForm.querySelector("button[type='submit']");

    loginButton.disabled = true;
    loginButton.textContent = "Logging In...";

    try {

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        loginMessage.style.color = "#86efac";
        loginMessage.textContent =
            data.message || "Login successful! Welcome back.";

        // Flask manages the session cookie.
        // Never store the password in localStorage.

        loginPassword.value = "";

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1200);

    } catch (error) {

        loginMessage.style.color = "#fca5a5";

        loginMessage.textContent =
            error.message || "Unable to connect to the server.";

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Login to LIFEPRINT →";

    }

});
