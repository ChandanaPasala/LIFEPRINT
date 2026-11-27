
const PROFILE_API_URL = "http://127.0.0.1:5000";

console.log("LIFEPRINT Profile Page Loaded!");

const profileForm = document.getElementById("profileForm");
const successMessage = document.getElementById("successMessage");

let existingProfile = null;

// ==========================================
// LOAD PROFILE FOR CURRENT LOGGED-IN ACCOUNT
// ==========================================

async function loadExistingProfile() {
    try {
        const response = await fetch(
            PROFILE_API_URL + "/my-profile",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not load profile.");
        }

        existingProfile = data.profile;

        if (!existingProfile) {
            // New account: show an empty form
            profileForm.reset();
            localStorage.removeItem("lifeprintProfile");
            localStorage.removeItem("lifeprintProfileId");
            return;
        }

        document.getElementById("name").value =
            existingProfile.name || "";

        document.getElementById("education").value =
            existingProfile.education || "";

        document.getElementById("branch").value =
            existingProfile.branch || "";

        document.getElementById("skills").value =
            Array.isArray(existingProfile.skills)
                ? existingProfile.skills.join(", ")
                : existingProfile.skills || "";

        document.getElementById("interest").value =
            existingProfile.interest || "";

        document.getElementById("career").value =
            existingProfile.career || "";

        document.getElementById("hours").value =
            existingProfile.hours || "";

        const button = profileForm.querySelector('[type="submit"]');

        if (button) {
            button.textContent = "Update My Profile →";
        }

    } catch (error) {
        console.error("Profile loading error:", error);

        successMessage.style.display = "block";
        successMessage.textContent =
            "Could not load your profile: " + error.message;
    }
}

// ==========================================
// SAVE PROFILE
// ==========================================

profileForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const submitButton = profileForm.querySelector('[type="submit"]');

    const profile = {
        name: document.getElementById("name").value.trim(),
        education: document.getElementById("education").value,
        branch: document.getElementById("branch").value.trim(),

        skills: document.getElementById("skills").value
            .split(",")
            .map(skill => skill.trim().toLowerCase())
            .filter(Boolean),

        interest: document.getElementById("interest").value,
        career: document.getElementById("career").value.trim(),
        hours: document.getElementById("hours").value
    };

    if (
        !profile.name ||
        !profile.education ||
        !profile.branch ||
        profile.skills.length === 0 ||
        !profile.interest ||
        !profile.career ||
        !profile.hours
    ) {
        alert("Please complete all profile fields.");
        return;
    }

    if (existingProfile?.profile_id) {
        profile.profile_id = existingProfile.profile_id;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Saving...";

        successMessage.style.display = "block";
        successMessage.textContent = "Saving your LIFEPRINT profile...";

        const response = await fetch(
            PROFILE_API_URL + "/save-profile",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profile)
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.error || data.message || "Profile saving failed."
            );
        }

        profile.profile_id = data.profile_id;

        localStorage.setItem(
            "lifeprintProfile",
            JSON.stringify(profile)
        );

        localStorage.setItem(
            "lifeprintProfileId",
            String(data.profile_id)
        );

        existingProfile = profile;

        successMessage.textContent =
            "Profile saved successfully! Opening your dashboard...";

        window.location.assign("./dashboard.html");

    } catch (error) {
        console.error("Profile saving error:", error);

        successMessage.textContent =
            "Unable to save profile: " + error.message;

        submitButton.disabled = false;
        submitButton.textContent =
            existingProfile
                ? "Update My Profile →"
                : "Save My Profile →";
    }
});

// Load this account's profile when the page opens
loadExistingProfile();
