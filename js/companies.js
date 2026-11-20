
/* ==========================================
   INTERNTRACK 4.0
   COMPANIES MANAGEMENT
   CRUD + TOAST + APPLY NOW
========================================== */

"use strict";

const loggedInUser = getCurrentUser();

if (!loggedInUser || !loggedInUser.username) {
    window.location.replace("login.html");
} else {
    initialiseCompanies();
}

function initialiseCompanies() {

    const companyForm =
        document.getElementById("companyForm");

    const companyTable =
        document.getElementById("companyTable");

    const companySearch =
        document.getElementById("companySearch");

    const companyEmptyMessage =
        document.getElementById("companyEmptyMessage");

    const modalElement =
        document.getElementById("companyModal");

    if (!companyForm || !companyTable || !modalElement) {
        console.error("Companies HTML elements are missing.");
        return;
    }

    const companyModal =
        bootstrap.Modal.getOrCreateInstance(modalElement);

    const companiesKey =
        "internCompanies_" + loggedInUser.username;

    const applicationsKey =
        "internApplications_" + loggedInUser.username;

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

    let companies = readArray(companiesKey);

    function notify(message, type = "success") {
        if (typeof window.showToast === "function") {
            window.showToast(message, type);
        } else {
            console.log(message);
        }
    }

    function saveCompanies() {
        try {
            localStorage.setItem(
                companiesKey,
                JSON.stringify(companies)
            );

            return true;
        } catch (error) {
            console.error("Unable to save companies:", error);

            notify(
                "Unable to save company data.",
                "error"
            );

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

    function safeWebsite(value) {
        if (!value) return "";

        try {
            const url = new URL(
                /^https?:\/\//i.test(value)
                    ? value
                    : "https://" + value
            );

            if (
                url.protocol !== "http:" &&
                url.protocol !== "https:"
            ) {
                return "";
            }

            return url.href;
        } catch (error) {
            return "";
        }
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
        const applications = readArray(applicationsKey);

        const appliedNames = new Set(
            applications.map(app =>
                String(app.company || "")
                    .trim()
                    .toLowerCase()
            )
        );

        const appliedCount = companies.filter(
            company => appliedNames.has(
                String(company.name || "")
                    .trim()
                    .toLowerCase()
            )
        ).length;

        animateCounter(
            "companyTotal",
            companies.length
        );

        animateCounter(
            "companyApplied",
            appliedCount
        );
    }

    function displayCompanies() {
        const keyword = (
            companySearch ? companySearch.value : ""
        ).trim().toLowerCase();

        const filtered = companies.filter(company => {
            const searchable = [
                company.name,
                company.industry,
                company.location,
                company.website
            ].join(" ").toLowerCase();

            return searchable.includes(keyword);
        });

        companyTable.innerHTML = filtered.map(company => {

            const website = safeWebsite(company.website);

            const websiteHTML = website
                ? `
                    <a
                        href="${escapeHTML(website)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website
                        <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                `
                : `<span class="text-muted">Not provided</span>`;

            return `
                <tr>
                    <td>
                        <strong>
                            ${escapeHTML(company.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(company.industry)}
                    </td>

                    <td>
                        ${escapeHTML(company.location)}
                    </td>

                    <td>
                        ${websiteHTML}
                    </td>

                    <td>
                        <div class="d-flex gap-2 flex-wrap">

                            <button
                                type="button"
                                class="btn btn-sm btn-primary"
                                data-action="apply"
                                data-id="${escapeHTML(company.id)}"
                                title="Create internship application"
                            >
                                <i class="bi bi-send-check me-1"></i>
                                Apply Now
                            </button>

                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                data-action="edit"
                                data-id="${escapeHTML(company.id)}"
                                title="Edit company"
                            >
                                <i class="bi bi-pencil-square"></i>
                            </button>

                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                data-action="delete"
                                data-id="${escapeHTML(company.id)}"
                                title="Delete company"
                            >
                                <i class="bi bi-trash"></i>
                            </button>

                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        if (companyEmptyMessage) {
            companyEmptyMessage.style.display =
                filtered.length === 0 ? "block" : "none";
        }

        const recordCount =
            document.getElementById("companyRecordCount");

        if (recordCount) {
            recordCount.textContent = filtered.length;
        }

        updateSummary();
    }

    function resetCompanyForm() {
        companyForm.reset();

        document.getElementById("companyId").value = "";

        const title =
            document.getElementById("companyModalTitle");

        if (title) {
            title.textContent = "Add Company";
        }
    }

    function editCompany(id) {
        const company = companies.find(
            item => String(item.id) === String(id)
        );

        if (!company) {
            notify("Company not found.", "error");
            return;
        }

        resetCompanyForm();

        document.getElementById("companyId").value =
            company.id;

        document.getElementById("companyName").value =
            company.name || "";

        document.getElementById("companyIndustry").value =
            company.industry || "";

        document.getElementById("companyLocation").value =
            company.location || "";

        document.getElementById("companyWebsite").value =
            company.website || "";

        const title =
            document.getElementById("companyModalTitle");

        if (title) {
            title.textContent = "Edit Company";
        }

        companyModal.show();
    }

    function deleteCompany(id) {
        const company = companies.find(
            item => String(item.id) === String(id)
        );

        if (!company) return;

        const confirmed = confirm(
            `Delete ${company.name} from your company list?`
        );

        if (!confirmed) return;

        const previous = [...companies];

        companies = companies.filter(
            item => String(item.id) !== String(id)
        );

        if (!saveCompanies()) {
            companies = previous;
            return;
        }

        displayCompanies();

        notify(
            "Company deleted successfully!",
            "success"
        );
    }

    function applyToCompany(id) {
        const company = companies.find(
            item => String(item.id) === String(id)
        );

        if (!company) {
            notify("Company not found.", "error");
            return;
        }

        const params = new URLSearchParams({
            applyCompany: String(company.id)
        });

        window.location.href =
            "applications.html?" + params.toString();
    }

    const addButton =
        document.getElementById("addCompanyBtn");

    if (addButton) {
        addButton.addEventListener("click", () => {
            resetCompanyForm();
            companyModal.show();
        });
    }

    companyForm.addEventListener("submit", event => {
        event.preventDefault();

        const id =
            document.getElementById("companyId").value;

        const name =
            document.getElementById("companyName").value.trim();

        const industry =
            document.getElementById("companyIndustry").value;

        const location =
            document.getElementById("companyLocation").value.trim();

        const website =
            document.getElementById("companyWebsite").value.trim();

        if (!name || !industry || !location) {
            notify(
                "Please complete all required fields.",
                "warning"
            );
            return;
        }

        if (website && !safeWebsite(website)) {
            notify(
                "Please enter a valid website URL.",
                "warning"
            );
            return;
        }

        const duplicate = companies.some(company =>
            String(company.name || "")
                .trim()
                .toLowerCase() === name.toLowerCase() &&
            String(company.id) !== String(id)
        );

        if (duplicate) {
            notify(
                "This company already exists.",
                "warning"
            );
            return;
        }

        const previous = companies.map(
            company => ({ ...company })
        );

        const companyData = {
            name,
            industry,
            location,
            website
        };

        const editing = Boolean(id);

        if (editing) {
            const index = companies.findIndex(
                company => String(company.id) === String(id)
            );

            if (index === -1) {
                notify("Company not found.", "error");
                return;
            }

            companies[index] = {
                ...companies[index],
                ...companyData
            };
        } else {
            companies.push({
                id: Date.now() + Math.floor(
                    Math.random() * 10000
                ),
                ...companyData
            });
        }

        if (!saveCompanies()) {
            companies = previous;
            return;
        }

        displayCompanies();

        companyModal.hide();

        resetCompanyForm();

        notify(
            editing
                ? "Company updated successfully!"
                : "Company added successfully!",
            "success"
        );
    });

    companyTable.addEventListener("click", event => {
        const button = event.target.closest(
            "button[data-action]"
        );

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "edit") {
            editCompany(id);
        }

        if (action === "delete") {
            deleteCompany(id);
        }

        if (action === "apply") {
            applyToCompany(id);
        }
    });

    if (companySearch) {
        companySearch.addEventListener(
            "input",
            displayCompanies
        );
    }

    displayCompanies();
}
