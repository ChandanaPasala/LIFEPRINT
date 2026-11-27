
// LIFEPRINT - LOGOUT

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {

        logoutButton.disabled = true;
        logoutButton.textContent = "Logging out...";

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Logout failed.");
            }

            window.location.replace("login.html");

        } catch (error) {
            alert("Unable to logout. Please try again.");
            logoutButton.disabled = false;
            logoutButton.textContent = "Logout";
        }
    });
}
