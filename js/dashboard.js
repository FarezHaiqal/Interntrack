
/* ==========================================
   INTERNTRACK - DASHBOARD FINAL POLISH
   IMS566 INDIVIDUAL PROJECT
========================================== */

// CHECK LOGIN
const currentUser = getCurrentUser();

if (!currentUser || !currentUser.username) {
    window.location.replace("login.html");

} else {

    // DISPLAY USER NAME
    const nameElement = document.getElementById("userName");

    if (nameElement) {
        nameElement.textContent =
            currentUser.name || currentUser.username;
    }

    // LOAD APPLICATIONS
    const storageKey =
        "internApplications_" + currentUser.username;

    let applications = [];

    try {
        const saved = localStorage.getItem(storageKey);
        const parsed = saved ? JSON.parse(saved) : [];

        applications = Array.isArray(parsed) ? parsed : [];

    } catch (error) {
        console.error("Could not load applications:", error);
    }

    // COUNT APPLICATIONS BY STATUS
    const count = status =>
        applications.filter(app => app.status === status).length;

    const counts = {
        total: applications.length,
        pending: count("Pending"),
        interview: count("Interview"),
        accepted: count("Accepted"),
        rejected: count("Rejected")
    };

    // CHECK REDUCED MOTION
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // ANIMATED COUNTER
    function animateCounter(element, target) {

        if (!element) return;

        if (reducedMotion) {
            element.textContent = target;
            return;
        }

        const started = performance.now();

        function frame(now) {

            const progress = Math.min(
                (now - started) / 750,
                1
            );

            const eased =
                1 - Math.pow(1 - progress, 3);

            element.textContent =
                Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    }

    // UPDATE STATISTIC CARDS
    const statFields = {
        dashboardTotal: counts.total,
        dashboardPending: counts.pending,
        dashboardInterview: counts.interview,
        dashboardAccepted: counts.accepted,
        dashboardRejected: counts.rejected
    };

    for (const [id, number] of Object.entries(statFields)) {
        animateCounter(
            document.getElementById(id),
            number
        );
    }

    // PREVENT HTML INJECTION
    function escapeHTML(value) {
        return String(value ?? "").replace(
            /[&<>"']/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]
        );
    }

    // RECENT APPLICATIONS
    const table =
        document.getElementById("recentApplications");

    const empty =
        document.getElementById("dashboardEmptyMessage");

    if (table) {

        table.innerHTML = "";

        const recent = [...applications]
            .sort((a, b) => {

                const dateA = Date.parse(a.date) || 0;
                const dateB = Date.parse(b.date) || 0;

                return dateB - dateA;
            })
            .slice(0, 5);

        if (empty) {
            empty.style.display =
                recent.length ? "none" : "block";
        }

        const badgeClasses = {
            Pending: "bg-warning text-dark",
            Interview: "bg-info text-dark",
            Accepted: "bg-success",
            Rejected: "bg-danger"
        };

        for (const app of recent) {

            const tr = document.createElement("tr");

            const badgeClass =
                badgeClasses[app.status] || "bg-secondary";

            tr.innerHTML = `
                <td class="fw-semibold">
                    ${escapeHTML(app.company)}
                </td>

                <td>
                    ${escapeHTML(app.position)}
                </td>

                <td>
                    <span class="badge ${badgeClass}">
                        ${escapeHTML(app.status)}
                    </span>
                </td>
            `;

            table.appendChild(tr);
        }
    }

    // APPLICATION STATUS CHART
    const canvas =
        document.getElementById("applicationChart");

    if (canvas && typeof Chart !== "undefined") {

        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Pending",
                    "Interview",
                    "Accepted",
                    "Rejected"
                ],

                datasets: [{

                    label: "Applications",

                    data: [
                        counts.pending,
                        counts.interview,
                        counts.accepted,
                        counts.rejected
                    ],

                    backgroundColor: [
                        "#f59e0b",
                        "#8b5cf6",
                        "#10b981",
                        "#ef4444"
                    ],

                    borderColor: "#ffffff",
                    borderWidth: 3,
                    hoverOffset: 12

                }]
            },

            options: {

                responsive: true,
                maintainAspectRatio: false,
                cutout: "72%",

                animation: reducedMotion
                    ? false
                    : {
                        duration: 1300,
                        easing: "easeOutQuart"
                    },

                plugins: {

                    legend: {
                        position: "bottom",

                        labels: {
                            usePointStyle: true,
                            padding: 18
                        }
                    },

                    tooltip: {

                        callbacks: {

                            label: context => {

                                const value = context.parsed;

                                const percentage = counts.total
                                    ? (
                                        value / counts.total * 100
                                      ).toFixed(1)
                                    : "0.0";

                                return (
                                    ` ${context.label}: ` +
                                    `${value} (${percentage}%)`
                                );
                            }
                        }
                    }
                }
            }
        });
    }
}
