
/* ==========================================
   INTERNTRACK - THEME SWITCHER
   Light Mode & Dark Mode
========================================== */

(function () {
    "use strict";

    const KEY = "internTrackTheme";

    // Get saved theme from localStorage
    function storedTheme() {
        try {
            return localStorage.getItem(KEY) === "dark"
                ? "dark"
                : "light";
        } catch (error) {
            return "light";
        }
    }

    // Apply selected theme
    function apply(theme) {
        const next = theme === "dark"
            ? "dark"
            : "light";

        document.documentElement.setAttribute(
            "data-theme",
            next
        );

        document.documentElement.style.colorScheme = next;

        // Update theme button
        document
            .querySelectorAll(".intern-theme-toggle")
            .forEach(function (button) {

                if (next === "dark") {
                    button.innerHTML = `
                        <i class="bi bi-sun-fill"
                           aria-hidden="true"></i>
                        <span>Light Mode</span>
                    `;
                } else {
                    button.innerHTML = `
                        <i class="bi bi-moon-stars-fill"
                           aria-hidden="true"></i>
                        <span>Dark Mode</span>
                    `;
                }

                const target = next === "dark"
                    ? "light"
                    : "dark";

                button.setAttribute(
                    "aria-label",
                    "Switch to " + target + " mode"
                );

                button.setAttribute(
                    "title",
                    "Switch to " + target + " mode"
                );
            });
    }

    // Apply saved theme immediately
    apply(storedTheme());

    // Create theme switch button
    function init() {

        // Prevent duplicate buttons
        if (
            document.querySelector(
                ".intern-theme-toggle"
            )
        ) {
            return;
        }

        const sidebar = document.querySelector(
            ".sidebar"
        );

        const button = document.createElement(
            "button"
        );

        button.type = "button";
        button.className = "intern-theme-toggle";

        // Switch theme when clicked
        button.addEventListener(
            "click",
            function () {

                const current =
                    document.documentElement.getAttribute(
                        "data-theme"
                    );

                const next = current === "dark"
                    ? "light"
                    : "dark";

                // Save selected theme
                try {
                    localStorage.setItem(
                        KEY,
                        next
                    );
                } catch (error) {
                    // Theme still works without storage
                }

                apply(next);
            }
        );

        // Add button to sidebar
        if (sidebar) {

            const bottom = sidebar.querySelector(
                ".sidebar-bottom"
            );

            if (bottom) {
                bottom.prepend(button);
            } else {
                sidebar.appendChild(button);
            }

        } else {

            // Floating button for login page
            button.classList.add(
                "intern-theme-floating"
            );

            document.body.appendChild(button);
        }

        apply(storedTheme());
    }

    // Wait until HTML has loaded
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
