
// =====================================
// LIFEPRINT - STUDENT SIGNUP
// STEP 15.3
// =====================================

const API_URL = "http://127.0.0.1:5000";

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

const showSignupPassword = document.getElementById("showSignupPassword");

const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");

// Show or hide both password fields
showSignupPassword.addEventListener("change", function () {
    const type = this.checked ? "text" : "password";

    signupPassword.type = type;
    confirmPassword.type = type;
});

// Handle signup form
signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    signupMessage.textContent = "";
    signupMessage.style.color = "#fca5a5";

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = signupPassword.value;
    const confirmPasswordValue = confirmPassword.value;

    // Check password length
    if (password.length < 8) {
        signupMessage.textContent =
            "Password must contain at least 8 characters.";
        return;
    }

    // Check password confirmation
    if (password !== confirmPasswordValue) {
        signupMessage.textContent =
            "Passwords do not match. Please try again.";
        return;
    }

    const signupButton = signupForm.querySelector("button[type='submit']");

    signupButton.disabled = true;
    signupButton.textContent = "Creating Account...";

    try {

        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed.");
        }

        signupMessage.style.color = "#86efac";
        signupMessage.textContent =
            data.message || "Account created successfully!";

        // Do not save the password in localStorage.
        // Flask manages the login session.

        signupForm.reset();

        setTimeout(function () {
            window.location.href = "profile.html";
        }, 1500);

    } catch (error) {

        signupMessage.style.color = "#fca5a5";

        signupMessage.textContent =
            error.message || "Unable to connect to the server.";

    } finally {

        signupButton.disabled = false;
        signupButton.textContent = "Create My Account →";

    }

});
