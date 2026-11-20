
/* INTERNTRACK 4.0 - TOAST NOTIFICATIONS */

(function () {
    "use strict";

    function showToast(message, type = "success") {
        const types = {
            success: "bi-check-circle-fill",
            error: "bi-x-circle-fill",
            warning: "bi-exclamation-triangle-fill",
            info: "bi-info-circle-fill"
        };

        const selectedType = types[type] ? type : "info";

        let container = document.getElementById("toastContainer");

        if (!container) {
            container = document.createElement("div");
            container.id = "toastContainer";
            container.className = "intern-toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "intern-toast toast-" + selectedType;
        toast.setAttribute("role", "status");

        const icon = document.createElement("i");
        icon.className = "bi " + types[selectedType];

        const text = document.createElement("span");
        text.textContent = String(message);

        const close = document.createElement("button");
        close.type = "button";
        close.className = "intern-toast-close";
        close.setAttribute("aria-label", "Close notification");
        close.innerHTML = '<i class="bi bi-x-lg"></i>';

        toast.append(icon, text, close);
        container.appendChild(toast);

        let removed = false;
        let timer;

        function dismiss() {
            if (removed) return;
            removed = true;
            clearTimeout(timer);

            toast.classList.add("toast-hide");

            setTimeout(() => {
                toast.remove();
            }, 350);
        }

        close.addEventListener("click", dismiss);
        timer = setTimeout(dismiss, 3500);
    }

    window.showToast = showToast;
})();
