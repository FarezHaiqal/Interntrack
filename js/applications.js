
/* ==========================================
   INTERNTRACK 4.0
   APPLICATIONS MANAGEMENT
   CRUD + TOAST + APPLY NOW
========================================== */

"use strict";

const loggedInUser = getCurrentUser();

if (!loggedInUser || !loggedInUser.username) {
    window.location.replace("login.html");
} else {
    initialiseApplications();
}

function initialiseApplications() {

    const applicationForm =
        document.getElementById("applicationForm");

    const applicationTable =
        document.getElementById("applicationTable");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const modalElement =
        document.getElementById("applicationModal");

    if (!applicationForm || !applicationTable || !modalElement) {
        console.error("Applications HTML elements are missing.");
        return;
    }

    const applicationModal =
        bootstrap.Modal.getOrCreateInstance(modalElement);

    const applicationsKey =
        "internApplications_" + loggedInUser.username;

    const companiesKey =
        "internCompanies_" + loggedInUser.username;

    let applications = readArray(applicationsKey);

    function readArray(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Unable to read data:", error);
            return [];
        }
    }

    function notify(message, type = "success") {
        if (typeof window.showToast === "function") {
            window.showToast(message, type);
        } else {
            console.log(message);
        }
    }

    function saveApplications() {
        try {
            localStorage.setItem(
                applicationsKey,
                JSON.stringify(applications)
            );
            return true;
        } catch (error) {
            console.error("Unable to save applications:", error);
            notify("Unable to save application data.", "error");
            return false;
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[character]
        );
    }

    function animateCounter(elementId, target) {
        const element = document.getElementById(elementId);

        if (!element) return;

        const endValue = Number(target) || 0;
        const duration = 450;
        const start = performance.now();

        function update(now) {
            const progress = Math.min(
                (now - start) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 3);

            element.textContent = Math.round(
                endValue * eased
            );

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function updateSummary() {
        animateCounter("totalCount", applications.length);

        animateCounter(
            "pendingCount",
            applications.filter(
                app => app.status === "Pending"
            ).length
        );

        animateCounter(
            "interviewCount",
            applications.filter(
                app => app.status === "Interview"
            ).length
        );

        animateCounter(
            "acceptedCount",
            applications.filter(
                app => app.status === "Accepted"
            ).length
        );
    }

    function getStatusBadge(status) {
        const styles = {
            Pending: "bg-warning",
            Interview: "bg-info",
            Accepted: "bg-success",
            Rejected: "bg-danger"
        };

        const badgeClass = styles[status] || "bg-secondary";

        return `
            <span class="badge ${badgeClass}">
                ${escapeHTML(status)}
            </span>
        `;
    }

    function formatDate(value) {
        if (!value) return "-";

        const date = new Date(value + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return escapeHTML(value);
        }

        return date.toLocaleDateString("en-MY", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function displayApplications() {
        const keyword = (
            searchInput ? searchInput.value : ""
        ).trim().toLowerCase();

        const selectedStatus =
            statusFilter ? statusFilter.value : "all";

        const filtered = applications
            .filter(app => {
                const searchable = [
                    app.company,
                    app.position,
                    app.location
                ].join(" ").toLowerCase();

                const matchesSearch =
                    searchable.includes(keyword);

                const matchesStatus =
                    !selectedStatus ||
                    selectedStatus.toLowerCase() === "all" ||
                    app.status === selectedStatus;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                return String(b.date || "").localeCompare(
                    String(a.date || "")
                );
            });

        applicationTable.innerHTML = filtered.map(app => `
            <tr>
                <td>
                    <strong>${escapeHTML(app.company)}</strong>
                </td>

                <td>${escapeHTML(app.position)}</td>

                <td>${escapeHTML(app.location)}</td>

                <td>${formatDate(app.date)}</td>

                <td>${getStatusBadge(app.status)}</td>

                <td>
                    <div class="d-flex gap-2">
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            data-action="edit"
                            data-id="${escapeHTML(app.id)}"
                            title="Edit application"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            data-action="delete"
                            data-id="${escapeHTML(app.id)}"
                            title="Delete application"
                        >
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

        if (emptyMessage) {
            emptyMessage.style.display =
                filtered.length === 0 ? "block" : "none";
        }

        const recordCount =
            document.getElementById("recordCount");

        if (recordCount) {
            recordCount.textContent = filtered.length;
        }

        const resultInfo =
            document.getElementById("resultInfo");

        if (resultInfo) {
            resultInfo.textContent =
                `Showing ${filtered.length} of ${applications.length} applications`;
        }

        updateSummary();
    }

    function resetApplicationForm() {
        applicationForm.reset();

        document.getElementById("applicationId").value = "";

        const title =
            document.getElementById("applicationModalLabel");

        if (title) {
            title.textContent = "Add Application";
        }

        const status =
            document.getElementById("applicationStatus");

        if (status) {
            status.value = "Pending";
        }
    }

    function editApplication(id) {
        const app = applications.find(
            item => String(item.id) === String(id)
        );

        if (!app) {
            notify("Application not found.", "error");
            return;
        }

        resetApplicationForm();

        document.getElementById("applicationId").value =
            app.id;

        document.getElementById("companyName").value =
            app.company || "";

        document.getElementById("position").value =
            app.position || "";

        document.getElementById("location").value =
            app.location || "";

        document.getElementById("applicationDate").value =
            app.date || "";

        document.getElementById("applicationStatus").value =
            app.status || "Pending";

        const title =
            document.getElementById("applicationModalLabel");

        if (title) {
            title.textContent = "Edit Application";
        }

        applicationModal.show();
    }

    function deleteApplication(id) {
        const app = applications.find(
            item => String(item.id) === String(id)
        );

        if (!app) return;

        const confirmed = confirm(
            `Delete the application for ${app.company}?`
        );

        if (!confirmed) return;

        const previous = [...applications];

        applications = applications.filter(
            item => String(item.id) !== String(id)
        );

        if (!saveApplications()) {
            applications = previous;
            return;
        }

        displayApplications();

        notify(
            "Application deleted successfully!",
            "success"
        );
    }

    function handleApplyNow() {
        const params = new URLSearchParams(
            window.location.search
        );

        const companyId = params.get("applyCompany");

        if (!companyId) return;

        const companies = readArray(companiesKey);

        const selectedCompany = companies.find(
            company =>
                String(company.id) === String(companyId)
        );

        if (!selectedCompany) {
            notify(
                "The selected company could not be found.",
                "error"
            );
            return;
        }

        resetApplicationForm();

        document.getElementById("companyName").value =
            selectedCompany.name || "";

        document.getElementById("location").value =
            selectedCompany.location || "";

        document.getElementById("applicationStatus").value =
            "Pending";

        const title =
            document.getElementById("applicationModalLabel");

        if (title) {
            title.textContent =
                "Apply to " + selectedCompany.name;
        }

        applicationModal.show();

        params.delete("applyCompany");

        try {
            const query = params.toString();

            const cleanURL =
                window.location.pathname +
                (query ? "?" + query : "") +
                window.location.hash;

            window.history.replaceState(
                {},
                "",
                cleanURL
            );
        } catch (error) {
            console.warn("Could not clean URL:", error);
        }

        notify(
            "Company details filled in. Complete your application!",
            "info"
        );
    }

    const addButton =
        document.getElementById("addApplicationBtn");

    if (addButton) {
        addButton.addEventListener("click", () => {
            resetApplicationForm();
            applicationModal.show();
        });
    }

    applicationForm.addEventListener("submit", event => {
        event.preventDefault();

        const id =
            document.getElementById("applicationId").value;

        const company =
            document.getElementById("companyName").value.trim();

        const position =
            document.getElementById("position").value.trim();

        const location =
            document.getElementById("location").value.trim();

        const date =
            document.getElementById("applicationDate").value;

        const status =
            document.getElementById("applicationStatus").value;

        if (!company || !position || !location || !date) {
            notify(
                "Please complete all required fields.",
                "warning"
            );
            return;
        }

        const previous = applications.map(
            app => ({ ...app })
        );

        const applicationData = {
            company,
            position,
            location,
            date,
            status
        };

        const editing = Boolean(id);

        if (editing) {
            const index = applications.findIndex(
                app => String(app.id) === String(id)
            );

            if (index === -1) {
                notify("Application not found.", "error");
                return;
            }

            applications[index] = {
                ...applications[index],
                ...applicationData
            };
        } else {
            applications.push({
                id: Date.now() + Math.floor(
                    Math.random() * 10000
                ),
                ...applicationData
            });
        }

        if (!saveApplications()) {
            applications = previous;
            return;
        }

        displayApplications();

        applicationModal.hide();

        resetApplicationForm();

        notify(
            editing
                ? "Application updated successfully!"
                : "Application saved successfully!",
            "success"
        );
    });

    applicationTable.addEventListener("click", event => {
        const button = event.target.closest(
            "button[data-action]"
        );

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "edit") {
            editApplication(id);
        }

        if (action === "delete") {
            deleteApplication(id);
        }
    });

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            displayApplications
        );
    }

    if (statusFilter) {
        statusFilter.addEventListener(
            "change",
            displayApplications
        );
    }

    const resetFiltersBtn =
        document.getElementById("resetFiltersBtn");

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (statusFilter) statusFilter.value = "all";

            displayApplications();

            notify("Filters reset successfully.", "info");
        });
    }

    displayApplications();
    handleApplyNow();
}
