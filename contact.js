// contact.js — EmailJS contact form handling
// NOTE: GitHub Pages is static and cannot read the .env file in the browser.
// The values below are the *client-safe* EmailJS IDs (they are sent in every
// request by design). Do NOT put your EmailJS PRIVATE key here — it is only
// for server-side REST calls and is not needed for this front-end form.

(function () {
    "use strict";

    // ---- EmailJS configuration -------------------------------------------
    const EMAILJS_PUBLIC_KEY  = "MR2mykYsCQNT1FexL";     // from .env (public, safe to expose)
    const EMAILJS_TEMPLATE_ID = "template_fey7a9t";      // from .env
    const EMAILJS_SERVICE_ID  = "service_z0pkd5o";       // <-- PASTE YOUR SERVICE ID (EmailJS dashboard → Email Services)
    const GOOGLE_FORM_URL     = "https://docs.google.com/forms/d/e/1FAIpQLSdTfJBV2-osowmRi3KLCpdkghiHRdpnoBXSrGGUL_xCpH2S0Q/viewform?usp=header";                      // optional: link to the full-brief Google Form (added later)
    // ----------------------------------------------------------------------

    if (window.emailjs) {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const form = document.getElementById("contact-form");
    if (!form) return;
    const submitBtn = form.querySelector(".contact-submit");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Native validation for required fields
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (!window.emailjs) {
            showToast("Email service didn't load. Please email me directly.", true);
            return;
        }

        const data = new FormData(form);
        const params = {
            name:         (data.get("name")         || "—").trim(),
            email:        (data.get("email")        || "—").trim(),
            phone:        (data.get("phone")        || "—").trim() || "—",
            project_type: data.get("project_type")  || "—",
            num_pages:    data.get("num_pages")      || "—",
            purpose:      (data.get("purpose")      || "—").trim() || "—",
            budget:       data.get("budget")         || "—",
            timeline:     data.get("timeline")       || "—",
            message:      (data.get("message")      || "—").trim(),
            form_link:    GOOGLE_FORM_URL || "#",
            time:         new Date().toLocaleString()
        };

        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
            .then(function () {
                showToast("Message sent — I'll be in touch soon!");
                form.reset();
            })
            .catch(function (err) {
                console.error("EmailJS error:", err);
                showToast("Something went wrong. Please email me directly.", true);
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            });
    });

    // ---- Toast -----------------------------------------------------------
    let toastTimer;
    function showToast(message, isError) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.querySelector(".toast-msg").textContent = message;
        toast.querySelector(".toast-icon").textContent = isError ? "⚠️" : "✅";
        toast.classList.toggle("error", !!isError);
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 5000);
    }
})();
