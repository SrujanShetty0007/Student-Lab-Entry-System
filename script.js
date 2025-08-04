/**
 * Lab Entry System - Main JavaScript File
 * Handles form submission, navigation, and UI interactions
 */

// Google Apps Script endpoint for form submissions
const scriptURL = "https://script.google.com/macros/s/AKfycbzah8QmZIvl1l606SsZgfMsyddxGECOlAnq48yczgP3XPNrsU_DjXIPPunP0NsRzvPtPg/exec";

// DOM element references
const form = document.forms["labEntryForm"];
const messageDiv = document.getElementById("message");

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    // Set initial values and handlers
    setDefaultDateTime();
    displayTodayDate();
    form.addEventListener("submit", handleSubmit);
    document.getElementById("todayBtn").addEventListener("click", displayTodayDate);

    // Mobile navigation
    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        navToggle.classList.toggle("active");
    });

    // Close mobile menu on nav link clicks
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            navToggle.classList.remove("active");
        });
    });
});


/**
 * Set default date and time values in form inputs
 */
function setDefaultDateTime() {
    const today = new Date();

    // Format date as YYYY-MM-DD for HTML date input
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    document.getElementById("entryDate").value = `${year}-${month}-${day}`;

    // Format time as HH:MM for HTML time input
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    document.getElementById("entryTime").value = `${hours}:${minutes}`;
}

/**
 * Display today's date in user-friendly format
 */
function displayTodayDate() {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    document.getElementById("todayDate").textContent = today.toLocaleDateString("en-US", options);
}


/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
function handleSubmit(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    showMessage("Submitting entry...", "info");

    const formData = new FormData(form);

    // Store entry data for recent entries display
    const entryData = {
        name: formData.get('name'),
        usn: formData.get('usn'),
        semester: formData.get('semester'),
        entryDate: formData.get('entryDate'),
        entryTime: formData.get('entryTime')
    };

    // Submit to Google Apps Script
    fetch(scriptURL, { method: "POST", body: formData })
        .then(response => response.text())
        .then(text => {
            const data = JSON.parse(text);
            if (data.result === 'success') {
                showMessage("Entry submitted successfully!", "success");
                addToRecentEntries(entryData);
                form.reset();
                setDefaultDateTime();
            } else {
                showMessage("Error: " + (data.error || "Please try again."), "error");
            }
        })
        .catch(() => showMessage("Network error. Please try again.", "error"))
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entry Now!';
        });
}


/**
 * Display message to user with appropriate styling
 * @param {string} text - Message text
 * @param {string} type - Message type: 'success', 'error', or 'info'
 */
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";

    // Auto-hide success messages after 5 seconds
    if (type === "success") {
        setTimeout(() => messageDiv.style.display = "none", 5000);
    }
}

/**
 * Add new entry to recent entries display (max 5 entries)
 * @param {Object} entryData - Entry details object
 */
function addToRecentEntries(entryData) {
    const recentEntriesDiv = document.querySelector('.recent-entries');

    // Remove placeholder text if exists
    const placeholderText = recentEntriesDiv.querySelector('.placeholder-text');
    if (placeholderText) placeholderText.remove();

    // Create new entry element
    const entryDiv = document.createElement('div');
    entryDiv.className = 'recent-entry';
    entryDiv.innerHTML = `
        <div class="entry-info">
            <strong>${entryData.name}</strong> (${entryData.usn})
            <br>
            <small>${entryData.semester} - ${entryData.entryDate} at ${entryData.entryTime}</small>
        </div>
    `;

    // Limit to 5 entries - remove oldest if needed
    const existingEntries = recentEntriesDiv.querySelectorAll('.recent-entry');
    if (existingEntries.length >= 5) {
        existingEntries[existingEntries.length - 1].remove();
    }

    // Insert at top after h3 heading
    const h3 = recentEntriesDiv.querySelector('h3');
    h3.insertAdjacentElement('afterend', entryDiv);
}

