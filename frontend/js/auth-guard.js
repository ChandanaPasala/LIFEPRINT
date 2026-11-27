
window.LIFEPRINT_API_URL = "http://127.0.0.1:5000";

async function checkLogin() {
    try {
        const response = await fetch(`${window.LIFEPRINT_API_URL}/auth-status`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Unable to verify login.");
        }

        const data = await response.json();

        if (!data.authenticated) {
            window.location.href = "login.html";
            return;
        }

        console.log("LIFEPRINT login verified!");
        console.log("Logged in user:", data);

    } catch (error) {
        console.error("Login verification error:", error);

        document.body.innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h2>Unable to verify your login</h2>
                <p>Please check your backend connection.</p>
                <a href="login.html">Go to Login</a>
            </div>
        `;
    }
}

checkLogin();
