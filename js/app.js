
/* ==========================================
   INTERNTRACK - LOGIN & REGISTER SYSTEM
   IMS566 INDIVIDUAL PROJECT
========================================== */

// LOCAL STORAGE KEYS
const USERS_KEY = "internUsers";
const CURRENT_USER_KEY = "currentUser";

// ==========================================
// 1. GET REGISTERED USERS
// ==========================================

function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY)
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

// ==========================================
// 2. GET CURRENT LOGGED-IN USER
// ==========================================

function getCurrentUser() {
    try {
        return JSON.parse(
            localStorage.getItem(CURRENT_USER_KEY)
        );
    } catch (error) {
        return null;
    }
}

// ==========================================
// 3. SEPARATE STORAGE FOR EACH USER
// ==========================================

function userStorageKey(dataset) {
    const user = getCurrentUser();

    if (!user || !user.username) {
        return null;
    }

    const key = dataset + "_" + user.username;

    // Preserve old demo account records
    if (
        user.username === "student" &&
        localStorage.getItem(key) === null
    ) {
        const oldData = localStorage.getItem(dataset);

        if (oldData !== null) {
            localStorage.setItem(key, oldData);
        }
    }

    return key;
}

// ==========================================
// 4. LOGIN FUNCTION
// ==========================================

function login(username, password) {
    username = username.trim();

    // DEMO ACCOUNT
    if (
        username === "student" &&
        password === "ims566"
    ) {
        const demoUser = {
            name: "Demo Student",
            username: "student"
        };

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(demoUser)
        );

        return {
            success: true,
            message: "Login successful!"
        };
    }

    // REGISTERED ACCOUNTS
    const users = getUsers();

    const user = users.find(function (account) {
        return (
            account.username === username &&
            account.password === password
        );
    });

    if (!user) {
        return {
            success: false,
            message: "Invalid username or password."
        };
    }

    const currentUser = {
        name: user.name,
        username: user.username
    };

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(currentUser)
    );

    return {
        success: true,
        message: "Login successful!"
    };
}

// ==========================================
// 5. REGISTER NEW USER
// ==========================================

function registerUser(name, username, password) {
    name = name.trim();
    username = username.trim();

    if (!name || !username || !password) {
        return {
            success: false,
            message: "Please complete all fields."
        };
    }

    if (password.length < 6) {
        return {
            success: false,
            message: "Password must have at least 6 characters."
        };
    }

    const users = getUsers();

    const usernameExists = users.some(function (user) {
        return (
            user.username.toLowerCase() ===
            username.toLowerCase()
        );
    });

    if (
        usernameExists ||
        username.toLowerCase() === "student"
    ) {
        return {
            success: false,
            message: "Username already exists."
        };
    }

    const newUser = {
        name: name,
        username: username,
        password: password
    };

    users.push(newUser);

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

    // Create empty data for new account
    localStorage.setItem(
        "internApplications_" + username,
        JSON.stringify([])
    );

    localStorage.setItem(
        "internCompanies_" + username,
        JSON.stringify([])
    );

    return {
        success: true,
        message: "Registration successful! Please login."
    };
}

// ==========================================
// 6. LOGOUT FUNCTION
// ==========================================

function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);

    window.location.href = "login.html";
}

// ==========================================
// 7. LOGIN & REGISTER FORM EVENTS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");

    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");

    // SHOW REGISTER FORM
    if (showRegister) {
        showRegister.addEventListener("click", function (event) {
            event.preventDefault();

            loginSection.style.display = "none";
            registerSection.style.display = "block";
        });
    }

    // SHOW LOGIN FORM
    if (showLogin) {
        showLogin.addEventListener("click", function (event) {
            event.preventDefault();

            registerSection.style.display = "none";
            loginSection.style.display = "block";
        });
    }

    // LOGIN FORM
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById(
                "loginUsername"
            ).value;

            const password = document.getElementById(
                "loginPassword"
            ).value;

            const message = document.getElementById(
                "loginMessage"
            );

            const result = login(username, password);

            if (result.success) {
                message.className = "alert alert-success";
                message.textContent = result.message;

                window.location.href = "dashboard.html";
            } else {
                message.className = "alert alert-danger";
                message.textContent = result.message;
            }
        });
    }

    // REGISTER FORM
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById(
                "registerName"
            ).value;

            const username = document.getElementById(
                "registerUsername"
            ).value;

            const password = document.getElementById(
                "registerPassword"
            ).value;

            const message = document.getElementById(
                "registerMessage"
            );

            const result = registerUser(
                name,
                username,
                password
            );

            if (result.success) {
                message.className = "alert alert-success";
                message.textContent = result.message;

                registerForm.reset();
            } else {
                message.className = "alert alert-danger";
                message.textContent = result.message;
            }
        });
    }

});
