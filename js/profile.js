
/* ==========================================
   INTERNTRACK - PROFILE MANAGEMENT
   IMS566 Individual Project
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // CHECK LOGIN
    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.username) {
        window.location.replace("login.html");
        return;
    }

    // USER-SPECIFIC STORAGE
    const profileKey = "internProfile_" + currentUser.username;
    const photoKey = "internProfilePhoto_" + currentUser.username;

    // PROFILE ELEMENTS
    const profileForm = document.getElementById("profileForm");
    const profileMessage = document.getElementById("profileMessage");

    const profileName = document.getElementById("profileName");
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");
    const profileCourse = document.getElementById("profileCourse");
    const profileUniversity = document.getElementById("profileUniversity");
    const profileBio = document.getElementById("profileBio");

    // PROFILE SUMMARY
    const displayName = document.getElementById("profileDisplayName");
    const displayUsername = document.getElementById("profileDisplayUsername");
    const displayEmail = document.getElementById("profileDisplayEmail");
    const displayCourse = document.getElementById("profileDisplayCourse");

    // PHOTO ELEMENTS
    const photoInput = document.getElementById("profileImageInput");
    const profilePicture = document.getElementById("profilePicture");
    const avatarIcon = document.getElementById("profileAvatarIcon");
    const removePhotoBtn = document.getElementById("removeProfilePhoto");

    // LOAD SAVED PROFILE
    let savedProfile = {};

    try {
        const stored = JSON.parse(localStorage.getItem(profileKey));

        if (stored && typeof stored === "object") {
            savedProfile = stored;
        }
    } catch (error) {
        console.error("Unable to load profile:", error);
    }

    // FILL FORM
    profileName.value = savedProfile.name ?? currentUser.name ?? "";
    profileUsername.value = currentUser.username;
    profileEmail.value = savedProfile.email ?? "";
    profilePhone.value = savedProfile.phone ?? "";
    profileCourse.value = savedProfile.course ?? "";
    profileUniversity.value = savedProfile.university ?? "";
    profileBio.value = savedProfile.bio ?? "";

    // DISPLAY MESSAGE
    function showMessage(message, type = "success") {

        profileMessage.textContent = message;

        profileMessage.className =
            "alert alert-" + type;

        profileMessage.hidden = false;
        profileMessage.style.display = "block";
    }

    // UPDATE PROFILE SUMMARY
    function updateProfileSummary() {

        displayName.textContent =
            profileName.value.trim() || currentUser.username;

        displayUsername.textContent = currentUser.username;

        displayEmail.textContent =
            profileEmail.value.trim() || "Not provided";

        displayCourse.textContent =
            profileCourse.value.trim() || "Not provided";
    }

    updateProfileSummary();

    // SAVE PROFILE INFORMATION
    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = profileName.value.trim();

        if (!name) {
            showMessage("Please enter your full name.", "danger");
            return;
        }

        const profileData = {
            name: name,
            email: profileEmail.value.trim(),
            phone: profilePhone.value.trim(),
            course: profileCourse.value.trim(),
            university: profileUniversity.value.trim(),
            bio: profileBio.value.trim()
        };

        try {

            // SAVE PROFILE
            localStorage.setItem(
                profileKey,
                JSON.stringify(profileData)
            );

            // UPDATE CURRENT SESSION
            const updatedUser = {
                ...currentUser,
                name: name
            };

            localStorage.setItem(
                "currentUser",
                JSON.stringify(updatedUser)
            );

            // UPDATE REGISTERED USER NAME
            const users = JSON.parse(
                localStorage.getItem("internUsers") || "[]"
            );

            if (Array.isArray(users)) {

                const userIndex = users.findIndex(
                    user => user.username === currentUser.username
                );

                if (userIndex !== -1) {

                    users[userIndex].name = name;

                    localStorage.setItem(
                        "internUsers",
                        JSON.stringify(users)
                    );
                }
            }

            updateProfileSummary();

            showMessage(
                "Your profile has been updated successfully!",
                "success"
            );

        } catch (error) {

            console.error("Profile save error:", error);

            showMessage(
                "Unable to save your profile. Check browser storage.",
                "danger"
            );
        }
    });

    /* ======================================
       PROFILE PICTURE MANAGEMENT
    ====================================== */

    // SHOW PHOTO OR DEFAULT AVATAR
    function displayPhoto(photoData) {

        if (photoData) {

            profilePicture.src = photoData;
            profilePicture.hidden = false;
            profilePicture.style.display = "block";

            avatarIcon.hidden = true;
            avatarIcon.style.display = "none";

            removePhotoBtn.hidden = false;
            removePhotoBtn.style.display = "inline-block";

        } else {

            profilePicture.removeAttribute("src");
            profilePicture.hidden = true;
            profilePicture.style.display = "none";

            avatarIcon.hidden = false;
            avatarIcon.style.display = "block";

            removePhotoBtn.hidden = true;
            removePhotoBtn.style.display = "none";
        }
    }

    // LOAD SAVED PHOTO
    const savedPhoto = localStorage.getItem(photoKey);

    displayPhoto(savedPhoto);

    // UPLOAD PHOTO
    photoInput.addEventListener("change", function () {

        const file = photoInput.files[0];

        if (!file) {
            return;
        }

        // ACCEPTED IMAGE TYPES
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            showMessage(
                "Please select a JPG, PNG or WebP image.",
                "danger"
            );

            photoInput.value = "";
            return;
        }

        // MAXIMUM 1 MB
        const maxSize = 1024 * 1024;

        if (file.size > maxSize) {

            showMessage(
                "Image is too large. Maximum size is 1 MB.",
                "danger"
            );

            photoInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            const imageData = event.target.result;

            if (typeof imageData !== "string") {
                showMessage("Unable to read the image.", "danger");
                return;
            }

            try {

                // SAVE IMAGE FOR THIS USER
                localStorage.setItem(photoKey, imageData);

                // UPDATE AVATAR
                displayPhoto(imageData);

                showMessage(
                    "Profile picture uploaded successfully!",
                    "success"
                );

            } catch (error) {

                console.error("Photo upload error:", error);

                showMessage(
                    "Unable to save the photo. Browser storage may be full. Try a smaller image.",
                    "danger"
                );
            }

            photoInput.value = "";
        };

        reader.onerror = function () {

            showMessage(
                "Unable to read the selected image.",
                "danger"
            );

            photoInput.value = "";
        };

        reader.readAsDataURL(file);
    });

    // REMOVE PROFILE PHOTO
    removePhotoBtn.addEventListener("click", function () {

        const confirmed = confirm(
            "Are you sure you want to remove your profile picture?"
        );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem(photoKey);

        displayPhoto(null);

        photoInput.value = "";

        showMessage(
            "Profile picture removed successfully.",
            "success"
        );
    });

});
