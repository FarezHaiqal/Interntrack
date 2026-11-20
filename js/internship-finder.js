
/* ======================================================
   INTERNTRACK - SMART INTERNSHIP FINDER 4.1
   IMS566 INDIVIDUAL PROJECT

   FEATURES:
   - 64 company directory records
   - Programme and state matching
   - Company name search
   - Company logos with fallback
   - Official website links
   - Save and unsave recommendations
   - Integration with Companies Page
   - Per-user localStorage
   - Light and Dark Mode compatible
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ==============================================
    // 1. LOGIN CHECK
    // ==============================================

    const loggedInUser =
        typeof getCurrentUser === "function"
            ? getCurrentUser()
            : null;

    if (!loggedInUser || !loggedInUser.username) {
        window.location.href = "login.html";
        return;
    }

    const username = loggedInUser.username;

    const savedKey = "internFinderSaved_" + username;
    const companiesKey = "internCompanies_" + username;

    // ==============================================
    // 2. COMPANY DATABASE
    // ==============================================

    // Format:
    // Name, State, City, Industry, Programmes, Website

    const companyData = [

        // KUALA LUMPUR

        ["PETRONAS", "Kuala Lumpur", "Kuala Lumpur",
         "Energy & Technology",
         "information,computer,business,finance,engineering,science,logistics",
         "https://www.petronas.com/"],

        ["Maybank", "Kuala Lumpur", "Kuala Lumpur",
         "Banking & Finance",
         "information,computer,business,finance",
         "https://www.maybank.com/"],

        ["CIMB Group", "Kuala Lumpur", "Kuala Lumpur",
         "Banking & Finance",
         "information,computer,business,finance",
         "https://www.cimb.com/"],

        ["Public Bank", "Kuala Lumpur", "Kuala Lumpur",
         "Banking & Finance",
         "information,computer,business,finance",
         "https://www.publicbankgroup.com/"],

        ["RHB Bank", "Kuala Lumpur", "Kuala Lumpur",
         "Banking & Finance",
         "information,computer,business,finance",
         "https://www.rhbgroup.com/"],

        ["Bank Islam", "Kuala Lumpur", "Kuala Lumpur",
         "Islamic Banking",
         "information,computer,business,finance",
         "https://www.bankislam.com.my/"],

        ["Bank Negara Malaysia", "Kuala Lumpur", "Kuala Lumpur",
         "Financial Regulation",
         "information,computer,business,finance",
         "https://www.bnm.gov.my/"],

        ["Axiata Group", "Kuala Lumpur", "Kuala Lumpur",
         "Telecommunications",
         "information,computer,business,finance,engineering",
         "https://www.axiata.com/"],

        ["Astro", "Kuala Lumpur", "Kuala Lumpur",
         "Media & Entertainment",
         "media,design,computer,information,business",
         "https://www.astro.com.my/"],

        ["PwC Malaysia", "Kuala Lumpur", "Kuala Lumpur",
         "Professional Services",
         "finance,business,information,computer",
         "https://www.pwc.com/my/"],

        ["Deloitte Malaysia", "Kuala Lumpur", "Kuala Lumpur",
         "Professional Services",
         "finance,business,information,computer",
         "https://www.deloitte.com/"],

        ["EY Malaysia", "Kuala Lumpur", "Kuala Lumpur",
         "Professional Services",
         "finance,business,information,computer",
         "https://www.ey.com/"],

        ["KPMG Malaysia", "Kuala Lumpur", "Kuala Lumpur",
         "Professional Services",
         "finance,business,information,computer",
         "https://kpmg.com/my/"],


        // SELANGOR

        ["AirAsia", "Selangor", "Sepang",
         "Aviation & Digital Services",
         "information,computer,business,finance,media,logistics,hospitality",
         "https://www.airasia.com/"],

        ["Media Prima", "Selangor", "Petaling Jaya",
         "Media & Broadcasting",
         "media,design,computer,business,information",
         "https://www.mediaprima.com.my/"],

        ["Nestle Malaysia", "Selangor", "Petaling Jaya",
         "Food & Consumer Goods",
         "business,finance,science,engineering,logistics",
         "https://www.nestle.com.my/"],

        ["Sunway Group", "Selangor", "Bandar Sunway",
         "Diversified Business",
         "business,finance,information,computer,engineering,hospitality",
         "https://www.sunway.com.my/"],

        ["Top Glove", "Selangor", "Shah Alam",
         "Manufacturing",
         "engineering,science,business,finance,logistics",
         "https://www.topglove.com/"],

        ["Carlsberg Malaysia", "Selangor", "Shah Alam",
         "Manufacturing & Consumer Goods",
         "business,finance,engineering,logistics,science",
         "https://www.carlsbergmalaysia.com.my/"],

        ["DHL Malaysia", "Selangor", "Subang Jaya",
         "Logistics",
         "logistics,business,finance,information,computer",
         "https://www.dhl.com/my-en/home.html"],

        ["Universiti Putra Malaysia", "Selangor", "Serdang",
         "Education & Research",
         "information,computer,science,business,engineering",
         "https://www.upm.edu.my/"],

        ["Universiti Kebangsaan Malaysia", "Selangor", "Bangi",
         "Education & Research",
         "information,computer,science,business,engineering",
         "https://www.ukm.my/"],

        ["CyberSecurity Malaysia", "Selangor", "Cyberjaya",
         "Cybersecurity",
         "computer,information,engineering",
         "https://www.cybersecurity.my/"],

        ["MDEC", "Selangor", "Cyberjaya",
         "Digital Economy",
         "information,computer,business,media,design",
         "https://mdec.my/"],


        // NEGERI SEMBILAN

        ["Samsung SDI Energy Malaysia", "Negeri Sembilan", "Seremban",
         "Battery Manufacturing",
         "engineering,science,business,finance,logistics",
         "https://www.samsungsdi.com/"],

        ["onsemi Malaysia", "Negeri Sembilan", "Seremban",
         "Semiconductor Manufacturing",
         "engineering,computer,science,logistics",
         "https://www.onsemi.com/"],

        ["Universiti Sains Islam Malaysia", "Negeri Sembilan", "Nilai",
         "Higher Education",
         "information,computer,business,finance,media",
         "https://www.usim.edu.my/"],

        ["Nilai University", "Negeri Sembilan", "Nilai",
         "Higher Education",
         "information,computer,business,finance,engineering",
         "https://www.nilai.edu.my/"],

        ["KPJ Seremban Specialist Hospital", "Negeri Sembilan", "Seremban",
         "Healthcare",
         "information,computer,business,finance,science",
         "https://kpjhealth.com.my/"],


        // JOHOR

        ["Johor Corporation", "Johor", "Johor Bahru",
         "Corporate & Investment",
         "information,business,finance,logistics",
         "https://www.jcorp.com.my/"],

        ["Universiti Teknologi Malaysia", "Johor", "Skudai",
         "Education & Research",
         "information,computer,engineering,science,business",
         "https://www.utm.my/"],

        ["Iskandar Investment Berhad", "Johor", "Iskandar Puteri",
         "Investment & Development",
         "business,finance,information,engineering",
         "https://www.iskandarinvestment.com/"],

        ["Port of Tanjung Pelepas", "Johor", "Gelang Patah",
         "Port & Logistics",
         "logistics,engineering,computer,business,information",
         "https://www.ptp.com.my/"],


        // PULAU PINANG

        ["Intel Malaysia", "Pulau Pinang", "Bayan Lepas",
         "Semiconductor Technology",
         "computer,engineering,science,information",
         "https://www.intel.com/"],

        ["Dell Technologies", "Pulau Pinang", "Bayan Lepas",
         "Information Technology",
         "information,computer,business,engineering,finance",
         "https://www.dell.com/"],

        ["Keysight Technologies", "Pulau Pinang", "Bayan Lepas",
         "Electronic Test Technology",
         "engineering,computer,science",
         "https://www.keysight.com/"],

        ["Bosch Malaysia", "Pulau Pinang", "Bayan Lepas",
         "Engineering & Manufacturing",
         "engineering,computer,science,logistics",
         "https://www.bosch.com.my/"],

        ["Universiti Sains Malaysia", "Pulau Pinang", "Gelugor",
         "Education & Research",
         "information,computer,science,business,engineering",
         "https://www.usm.my/"],


        // PERAK

        ["PROTON", "Perak", "Tanjung Malim",
         "Automotive",
         "engineering,computer,business,logistics,finance",
         "https://www.proton.com/"],

        ["Universiti Teknologi PETRONAS", "Perak", "Seri Iskandar",
         "Education & Research",
         "information,computer,engineering,science,business",
         "https://www.utp.edu.my/"],

        ["Universiti Pendidikan Sultan Idris", "Perak", "Tanjung Malim",
         "Higher Education",
         "information,computer,business,media,design",
         "https://www.upsi.edu.my/"],

        ["Universiti Teknologi MARA Perak", "Perak", "Seri Iskandar",
         "Higher Education",
         "information,computer,business,design,finance",
         "https://perak.uitm.edu.my/"],


        // MELAKA

        ["Infineon Technologies", "Melaka", "Batu Berendam",
         "Semiconductor",
         "engineering,computer,science,logistics",
         "https://www.infineon.com/"],

        ["Universiti Teknikal Malaysia Melaka", "Melaka", "Durian Tunggal",
         "Education & Technology",
         "information,computer,engineering,science,business",
         "https://www.utem.edu.my/"],

        ["Multimedia University", "Melaka", "Bukit Beruang",
         "Education & Technology",
         "information,computer,design,media,business",
         "https://www.mmu.edu.my/"],


        // KEDAH

        ["Universiti Utara Malaysia", "Kedah", "Sintok",
         "Higher Education",
         "information,computer,business,finance,media",
         "https://www.uum.edu.my/"],

        ["Universiti Teknologi MARA Kedah", "Kedah", "Merbok",
         "Higher Education",
         "information,computer,business,finance,design",
         "https://kedah.uitm.edu.my/"],


        // PERLIS

        ["Universiti Malaysia Perlis", "Perlis", "Arau",
         "Higher Education",
         "information,computer,engineering,science,business",
         "https://www.unimap.edu.my/"],


        // PAHANG

        ["Universiti Malaysia Pahang Al-Sultan Abdullah", "Pahang", "Pekan",
         "Education & Engineering",
         "information,computer,engineering,science,business",
         "https://umpsa.edu.my/"],

        ["Universiti Teknologi MARA Pahang", "Pahang", "Jengka",
         "Higher Education",
         "information,computer,business,finance,design",
         "https://pahang.uitm.edu.my/"],


        // TERENGGANU

        ["Universiti Malaysia Terengganu", "Terengganu", "Kuala Nerus",
         "Education & Marine Research",
         "science,information,computer,business",
         "https://www.umt.edu.my/"],

        ["Universiti Sultan Zainal Abidin", "Terengganu", "Kuala Nerus",
         "Higher Education",
         "information,computer,business,finance,media",
         "https://www.unisza.edu.my/"],


        // KELANTAN

        ["Universiti Malaysia Kelantan", "Kelantan", "Kota Bharu",
         "Education & Entrepreneurship",
         "business,information,computer,design,finance",
         "https://www.umk.edu.my/"],

        ["Universiti Sains Malaysia Health Campus", "Kelantan", "Kubang Kerian",
         "Education & Health Research",
         "science,information,computer,business",
         "https://www.usm.my/"],


        // SABAH

        ["Universiti Malaysia Sabah", "Sabah", "Kota Kinabalu",
         "Higher Education",
         "information,computer,business,science,media",
         "https://www.ums.edu.my/"],

        ["Sabah Electricity", "Sabah", "Kota Kinabalu",
         "Utilities",
         "engineering,computer,information,finance",
         "https://www.sesb.com.my/"],

        ["Sabah Ports", "Sabah", "Kota Kinabalu",
         "Port & Logistics",
         "logistics,business,engineering,information",
         "https://www.spsb.com.my/"],


        // SARAWAK

        ["Sarawak Energy", "Sarawak", "Kuching",
         "Energy & Utilities",
         "engineering,information,computer,finance,science",
         "https://www.sarawakenergy.com/"],

        ["Universiti Malaysia Sarawak", "Sarawak", "Kota Samarahan",
         "Higher Education",
         "information,computer,business,science,media",
         "https://www.unimas.my/"],

        ["Swinburne University Sarawak", "Sarawak", "Kuching",
         "Higher Education",
         "information,computer,business,engineering,design",
         "https://www.swinburne.edu.my/"],


        // PUTRAJAYA

        ["Perbadanan Putrajaya", "Putrajaya", "Putrajaya",
         "Local Government",
         "information,computer,business,finance,design",
         "https://www.ppj.gov.my/"],

        ["Jabatan Perkhidmatan Awam", "Putrajaya", "Putrajaya",
         "Public Administration",
         "information,computer,business,finance",
         "https://www.jpa.gov.my/"],


        // LABUAN

        ["Labuan Financial Services Authority", "Labuan", "Labuan",
         "Financial Regulation",
         "finance,business,information,computer",
         "https://www.labuanfsa.gov.my/"],

        ["Universiti Malaysia Sabah Labuan Campus", "Labuan", "Labuan",
         "Higher Education",
         "information,computer,business,finance",
         "https://www.ums.edu.my/"]

    ];

    const directory = companyData.map((row, index) => ({
        id: index + 1,
        name: row[0],
        state: row[1],
        city: row[2],
        industry: row[3],
        programmes: row[4].split(","),
        website: row[5]
    }));

    // ==============================================
    // 3. HTML ELEMENTS
    // ==============================================

    const form = document.getElementById("finderForm");
    const programmeInput = document.getElementById("finderProgramme");
    const stateInput = document.getElementById("finderState");
    const results = document.getElementById("finderResults");
    const resultsInfo = document.getElementById("finderResultsInfo");

    const totalEl = document.getElementById("finderTotal");
    const matchesEl = document.getElementById("finderMatches");
    const savedEl = document.getElementById("finderSaved");
    const savedButton = document.getElementById("finderShowSaved");

    if (
        !form || !programmeInput || !stateInput ||
        !results || !resultsInfo ||
        !totalEl || !matchesEl || !savedEl || !savedButton
    ) {
        console.error("Internship Finder HTML elements missing.");
        return;
    }

    // ==============================================
    // 4. COMPANY LOGO SYSTEM
    // ==============================================

    // Special domains for companies whose standard
    // favicon may not display correctly.

    const specialLogoDomains = {
        "PETRONAS": "petronas.com",
        "RHB Bank": "rhbgroup.com",
        "Public Bank": "pbebank.com",
        "Bank Islam": "bankislam.com.my"
    };

    function getCompanyLogo(company) {

        let domain = specialLogoDomains[company.name];

        if (!domain) {
            try {
                domain = new URL(company.website).hostname;
            } catch (error) {
                return "";
            }
        }

        return (
            "https://www.google.com/s2/favicons?domain=" +
            encodeURIComponent(domain) +
            "&sz=128"
        );
    }

    // ==============================================
    // 5. LOGO AND CARD CSS
    // ==============================================

    const customStyle = document.createElement("style");

    customStyle.textContent = `

        .finder-company-logo.finder-brand-logo {
            width: 72px;
            height: 72px;
            min-width: 72px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            border-radius: 16px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }

        .finder-brand-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }

        .finder-brand-logo .logo-fallback {
            font-size: 30px;
            color: #2563eb;
        }

        .finder-company-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .finder-company-actions a {
            text-decoration: none;
        }

        .finder-career-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            white-space: nowrap;
        }

        .finder-company-card {
            height: 100%;
        }

        :root[data-theme="dark"] .finder-brand-logo {
            background: #ffffff;
        }

        @media (max-width: 575px) {
            .finder-company-actions {
                flex-direction: column;
            }

            .finder-company-actions button,
            .finder-company-actions a {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(customStyle);

    // ==============================================
    // 6. HELPER FUNCTIONS
    // ==============================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function normalizeName(value) {
        return String(value || "").trim().toLowerCase();
    }

    function readArray(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {
            console.error("Storage read error:", error);
            return [];
        }
    }

    // ==============================================
    // 7. SAVED RECOMMENDATIONS
    // ==============================================

    // Legacy saved IDs from older Finder versions.

    const oldCompanyNames = {
        1: "PETRONAS",
        2: "Maybank",
        3: "CIMB Group",
        4: "Telekom Malaysia",
        5: "Dell Technologies",
        6: "Intel Malaysia",
        7: "PROTON",
        8: "Samsung SDI Energy Malaysia",
        9: "Infineon Technologies",
        10: "Johor Corporation",
        11: "Media Prima",
        12: "AirAsia",
        13: "Sarawak Energy",
        14: "Sabah Electricity",
        15: "Universiti Malaysia Pahang Al-Sultan Abdullah",
        16: "Universiti Malaysia Perlis",
        17: "Universiti Malaysia Terengganu",
        18: "Universiti Malaysia Kelantan",
        19: "Universiti Utara Malaysia",
        20: "Universiti Putra Malaysia",
        21: "Perbadanan Putrajaya",
        22: "Labuan Financial Services Authority"
    };

    function getSaved() {

        const raw = readArray(savedKey);

        const names = raw.map(item => {

            if (typeof item === "number") {
                return oldCompanyNames[item] || null;
            }

            if (typeof item === "string") {
                return item;
            }

            return null;

        }).filter(Boolean);

        return [...new Set(names)];
    }

    function isSaved(company) {
        return getSaved().some(name =>
            normalizeName(name) === normalizeName(company.name)
        );
    }

    function updateSavedCount() {
        savedEl.textContent = getSaved().length;
    }

    function saveFavorites(names) {

        try {
            localStorage.setItem(
                savedKey,
                JSON.stringify(names)
            );

            updateSavedCount();
            return true;

        } catch (error) {
            console.error(error);
            alert("Unable to save your selection.");
            return false;
        }
    }

    // ==============================================
    // 8. INDUSTRY MAPPING
    // ==============================================

    function mapIndustry(industry) {

        const value = String(industry).toLowerCase();

        if (value.includes("bank")) return "Banking";

        if (
            value.includes("finance") ||
            value.includes("financial") ||
            value.includes("investment")
        ) return "Finance";

        if (
            value.includes("energy") ||
            value.includes("oil") ||
            value.includes("gas")
        ) return "Oil & Gas";

        if (value.includes("telecom")) {
            return "Telecommunications";
        }

        if (
            value.includes("education") ||
            value.includes("university") ||
            value.includes("research")
        ) return "Education";

        if (value.includes("health")) {
            return "Healthcare";
        }

        if (
            value.includes("manufacturing") ||
            value.includes("semiconductor") ||
            value.includes("automotive") ||
            value.includes("electronic")
        ) return "Manufacturing";

        if (
            value.includes("technology") ||
            value.includes("digital") ||
            value.includes("cyber") ||
            value.includes("software") ||
            value.includes("information")
        ) return "Technology";

        if (value.includes("retail")) return "Retail";

        return "Other";
    }

    // ==============================================
    // 9. ADD COMPANY TO COMPANIES PAGE
    // ==============================================

    function addToCompanyDirectory(company) {

        let existing = [];

        const raw = localStorage.getItem(companiesKey);

        if (raw !== null) {

            try {
                existing = JSON.parse(raw);

                if (!Array.isArray(existing)) {
                    alert("Invalid company directory data.");
                    return false;
                }

            } catch (error) {
                console.error(error);
                alert("Unable to read your company directory.");
                return false;
            }
        }

        const duplicate = existing.find(item =>
            normalizeName(item.name) ===
            normalizeName(company.name)
        );

        if (duplicate) {

            // Update missing website only.
            // Existing company information is preserved.

            if (!duplicate.website && company.website) {

                duplicate.website = company.website;

                try {
                    localStorage.setItem(
                        companiesKey,
                        JSON.stringify(existing)
                    );
                } catch (error) {
                    console.error(error);
                    alert("Unable to update company website.");
                    return false;
                }
            }

            return true;
        }

        const newCompany = {
            id: Date.now() + Math.floor(Math.random() * 1000000),
            name: company.name,
            industry: mapIndustry(company.industry),
            location: company.city + ", " + company.state,
            website: company.website
        };

        existing.push(newCompany);

        try {
            localStorage.setItem(
                companiesKey,
                JSON.stringify(existing)
            );

            return true;

        } catch (error) {
            console.error("Company save failed:", error);
            alert("Unable to save company.");
            return false;
        }
    }

    // ==============================================
    // 10. CREATE COMPANY CARD
    // ==============================================

    function createCompanyCard(company, index, fallback) {

        const saved = isSaved(company);
        const logo = getCompanyLogo(company);

        const column = document.createElement("div");

        column.className = "col-lg-4 col-md-6";

        column.style.animationDelay =
            Math.min(index, 10) * 70 + "ms";

        column.innerHTML = `
            <article class="finder-company-card">

                <div class="finder-company-top">

                    <div class="finder-company-logo finder-brand-logo">

                        <img
                            src="${escapeHTML(logo)}"
                            alt="${escapeHTML(company.name)} logo"
                            loading="lazy"
                        >

                        <i
                            class="bi bi-building logo-fallback"
                            style="display:none"
                        ></i>

                    </div>

                    <span class="finder-match-tag">
                        <i class="bi bi-check-circle-fill"></i>
                        ${fallback ? "Other State" : "Relevant"}
                    </span>

                </div>

                <h4>${escapeHTML(company.name)}</h4>

                <p class="finder-industry">
                    ${escapeHTML(company.industry)}
                </p>

                <div class="finder-company-meta">

                    <span>
                        <i class="bi bi-geo-alt"></i>
                        ${escapeHTML(company.city)},
                        ${escapeHTML(company.state)}
                    </span>

                    <span>
                        <i class="bi bi-mortarboard"></i>
                        Related to your selected programme
                    </span>

                </div>

                <div class="finder-company-actions">

                    <button
                        type="button"
                        class="finder-save-btn ${saved ? "saved" : ""}"
                        data-save-name="${escapeHTML(company.name)}"
                    >
                        <i class="bi bi-bookmark-${saved ? "check-fill" : "plus"}"></i>
                        ${saved ? "Saved" : "Save Company"}
                    </button>

                    <a
                        href="${escapeHTML(company.website)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="finder-career-btn"
                    >
                        <i class="bi bi-globe2"></i>
                        Official Website
                    </a>

                </div>

            </article>
        `;

        // Image fallback when favicon cannot load.
        const image = column.querySelector(".finder-brand-logo img");
        const fallbackIcon = column.querySelector(".logo-fallback");

        if (image && fallbackIcon) {

            image.addEventListener("error", function () {
                image.style.display = "none";
                fallbackIcon.style.display = "block";
            });

            if (!logo) {
                image.style.display = "none";
                fallbackIcon.style.display = "block";
            }
        }

        return column;
    }

    // ==============================================
    // 11. DISPLAY RESULTS
    // ==============================================

    function displayCompanies(list, message, fallbackNames = []) {

        results.innerHTML = "";

        matchesEl.textContent = list.length;
        resultsInfo.textContent = message;

        if (list.length === 0) {

            results.innerHTML = `
                <div class="col-12">
                    <div class="finder-empty">

                        <i class="bi bi-search"></i>

                        <h4>No Companies Found</h4>

                        <p>
                            No matching organisations found.
                            Try another programme or state.
                        </p>

                    </div>
                </div>
            `;

            return;
        }

        list.forEach((company, index) => {

            const fallback = fallbackNames.includes(company.name);

            results.appendChild(
                createCompanyCard(company, index, fallback)
            );
        });
    }

    // ==============================================
    // 12. SMART MATCHING
    // ==============================================

    function findCompanies() {

        const programme = programmeInput.value;
        const state = stateInput.value;

        if (!programme || !state) {
            alert("Please select your programme and state.");
            return;
        }

        const programmeMatches = directory.filter(company =>
            company.programmes.includes(programme)
        );

        const localMatches = programmeMatches.filter(company =>
            state === "all" || company.state === state
        );

        let finalResults = [...localMatches];
        let fallbackNames = [];

        // Suggest other states if fewer than 5 local matches.

        if (state !== "all" && localMatches.length < 5) {

            const additional = programmeMatches
                .filter(company => company.state !== state)
                .slice(0, 8);

            finalResults = [...localMatches, ...additional];

            fallbackNames = additional.map(company => company.name);
        }

        const programmeName =
            programmeInput.options[
                programmeInput.selectedIndex
            ].text;

        const stateName = state === "all"
            ? "Malaysia"
            : state;

        let message =
            localMatches.length +
            " local matches for " +
            programmeName +
            " in " +
            stateName + ".";

        if (fallbackNames.length > 0) {

            message +=
                " Showing " +
                fallbackNames.length +
                " additional suggestions from other states.";
        }

        displayCompanies(
            finalResults,
            message,
            fallbackNames
        );
    }

    // ==============================================
    // 13. SEARCH FORM
    // ==============================================

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        findCompanies();
    });

    // ==============================================
    // 14. SAVE / UNSAVE COMPANY
    // ==============================================

    results.addEventListener("click", function (event) {

        const button = event.target.closest("[data-save-name]");

        if (!button) return;

        const companyName = button.dataset.saveName;

        const company = directory.find(item =>
            normalizeName(item.name) ===
            normalizeName(companyName)
        );

        if (!company) {
            alert("Company not found.");
            return;
        }

        let savedNames = getSaved();

        const alreadySaved = savedNames.some(name =>
            normalizeName(name) ===
            normalizeName(company.name)
        );

        if (alreadySaved) {

            // Remove from Finder favourites only.
            // Do not delete the Companies Page record.

            savedNames = savedNames.filter(name =>
                normalizeName(name) !==
                normalizeName(company.name)
            );

            if (!saveFavorites(savedNames)) return;

        } else {

            // Add to Companies Page first.

            const success = addToCompanyDirectory(company);

            if (!success) return;

            savedNames.push(company.name);

            if (!saveFavorites(savedNames)) return;
        }

        // Update visible Save buttons.

        const currentSaved = getSaved();

        results.querySelectorAll("[data-save-name]").forEach(btn => {

            const active = currentSaved.some(name =>
                normalizeName(name) ===
                normalizeName(btn.dataset.saveName)
            );

            btn.classList.toggle("saved", active);

            btn.innerHTML = active
                ? '<i class="bi bi-bookmark-check-fill"></i> Saved'
                : '<i class="bi bi-bookmark-plus"></i> Save Company';
        });
    });

    // ==============================================
    // 15. MY SAVED
    // ==============================================

    savedButton.addEventListener("click", function () {

        const savedNames = getSaved();

        const savedCompanies = directory.filter(company =>
            savedNames.some(name =>
                normalizeName(name) ===
                normalizeName(company.name)
            )
        );

        displayCompanies(
            savedCompanies,
            savedCompanies.length +
            " saved company recommendations."
        );
    });

    // ==============================================
    // 16. COMPANY NAME SEARCH
    // ==============================================

    let companySearch = document.getElementById(
        "finderCompanySearch"
    );

    if (!companySearch) {

        const searchWrapper = document.createElement("div");

        searchWrapper.className = "mt-3";

        searchWrapper.innerHTML = `
            <label
                for="finderCompanySearch"
                class="form-label fw-semibold"
            >
                Search Company Name (Optional)
            </label>

            <input
                type="search"
                id="finderCompanySearch"
                class="form-control"
                placeholder="Example: PETRONAS, RHB Bank, Intel"
            >
        `;

        form.appendChild(searchWrapper);

        companySearch = document.getElementById(
            "finderCompanySearch"
        );
    }

    companySearch.addEventListener("input", function () {

        const keyword = companySearch.value
            .trim()
            .toLowerCase();

        if (!keyword) {

            if (programmeInput.value && stateInput.value) {
                findCompanies();
            } else {
                displayCompanies(
                    [],
                    "Select your programme and state to get started."
                );
            }

            return;
        }

        const matched = directory.filter(company => {

            const nameMatch =
                company.name.toLowerCase().includes(keyword);

            const programmeMatch =
                !programmeInput.value ||
                company.programmes.includes(
                    programmeInput.value
                );

            const stateMatch =
                !stateInput.value ||
                stateInput.value === "all" ||
                company.state === stateInput.value;

            return (
                nameMatch &&
                programmeMatch &&
                stateMatch
            );
        });

        displayCompanies(
            matched,
            matched.length +
            " company name search results."
        );
    });

    // ==============================================
    // 17. INITIALISE PAGE
    // ==============================================

    totalEl.textContent = directory.length;

    updateSavedCount();

    console.log(
        "InternTrack Smart Internship Finder 4.1 ready!"
    );

});
