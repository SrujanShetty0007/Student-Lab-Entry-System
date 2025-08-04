// Google Apps Script URL for API calls
const scriptURL = "https://script.google.com/macros/s/AKfycbzah8QmZIvl1l606SsZgfMsyddxGECOlAnq48yczgP3XPNrsU_DjXIPPunP0NsRzvPtPg/exec";

let allEntries = [];

document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        navToggle.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            navToggle.classList.remove("active");
        });
    });

    loadEntries();
});

async function loadEntries() {
    document.getElementById('loadingMessage').style.display = 'block';

    try {
        const response = await fetch(scriptURL + '?action=getEntries');
        const data = await response.json();

        if (data.result === 'success') {
            allEntries = data.entries || [];
            displayEntries();
            document.getElementById('totalEntries').textContent = allEntries.length;
        }
    } catch (error) {
        document.getElementById('errorMessage').textContent = 'Failed to load entries';
        document.getElementById('errorMessage').style.display = 'block';
    }

    document.getElementById('loadingMessage').style.display = 'none';
}

function displayEntries() {
    const tableBody = document.getElementById('entriesTableBody');
    const table = document.getElementById('entriesTable');
    const noEntriesMsg = document.getElementById('noEntriesMessage');

    const hasEntries = allEntries.length > 0;
    table.style.display = hasEntries ? 'table' : 'none';
    noEntriesMsg.style.display = hasEntries ? 'none' : 'block';

    if (hasEntries) {
        tableBody.innerHTML = allEntries.map(entry => `
            <tr>
                <td>${entry.name || ''}</td>
                <td>${entry.usn || ''}</td>
                <td>${entry.semester || ''}</td>
                <td>${formatDate(entry.entryDate)}</td>
                <td>${entry.entryTime || ''}</td>
                <td><button class="delete-btn" onclick="deleteEntry(${entry.row})">Delete</button></td>
            </tr>
        `).join('');
    }
}

function showCustomAlert(title, message, type = 'info', buttons = [{ text: 'OK', class: 'ok' }]) {
    return new Promise((resolve) => {
        document.querySelector('.custom-alert-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';

        const iconMap = { warning: '⚠️', error: '❌', success: '✅', info: 'ℹ️' };

        overlay.innerHTML = `
            <div class="custom-alert">
                <div class="custom-alert-icon ${type}">${iconMap[type] || iconMap.info}</div>
                <div class="custom-alert-title">${title}</div>
                <div class="custom-alert-message">${message}</div>
                <div class="custom-alert-buttons">
                    ${buttons.map((btn, index) =>
            `<button class="custom-alert-btn ${btn.class}" data-index="${index}">${btn.text}</button>`
        ).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelectorAll('.custom-alert-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                overlay.classList.remove('show');
                setTimeout(() => { overlay.remove(); resolve(index); }, 300);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
                setTimeout(() => { overlay.remove(); resolve(-1); }, 300);
            }
        });

        setTimeout(() => overlay.classList.add('show'), 10);
    });
}

const showConfirmDialog = (title, message) => showCustomAlert(title, message, 'warning', [
    { text: 'Cancel', class: 'cancel' }, { text: 'Delete', class: 'confirm' }
]);

const showSuccessAlert = (title, message) => showCustomAlert(title, message, 'success', [{ text: 'OK', class: 'ok' }]);

const showErrorAlert = (title, message) => showCustomAlert(title, message, 'error', [{ text: 'OK', class: 'ok' }]);

async function deleteEntry(rowNumber) {
    const result = await showConfirmDialog('Confirm Delete', 'Are you sure you want to delete this entry? This action cannot be undone.');
    if (result === 0 || result === -1) return;

    const formData = new FormData();
    formData.append('action', 'deleteEntry');
    formData.append('row', rowNumber);

    try {
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        const data = await response.json();

        if (data.result === 'success') {
            allEntries = allEntries.filter(entry => entry.row !== rowNumber);
            displayEntries();
            document.getElementById('totalEntries').textContent = allEntries.length;
            await showSuccessAlert('Success', 'Entry deleted successfully!');
        } else {
            await showErrorAlert('Delete Failed', 'Failed to delete entry. Please try again.');
        }
    } catch {
        await showErrorAlert('Delete Failed', 'An error occurred while deleting the entry. Please check your connection and try again.');
    }
}

function filterEntries() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const semester = document.getElementById('semesterFilter').value;

    const filtered = allEntries.filter(entry =>
        (!search || entry.name.toLowerCase().includes(search) || entry.usn.toLowerCase().includes(search)) &&
        (!semester || entry.semester === semester)
    );

    document.getElementById('entriesTableBody').innerHTML = filtered.map(entry => `
        <tr>
            <td>${entry.name || ''}</td>
            <td>${entry.usn || ''}</td>
            <td>${entry.semester || ''}</td>
            <td>${formatDate(entry.entryDate)}</td>
            <td>${entry.entryTime || ''}</td>
            <td><button class="delete-btn" onclick="deleteEntry(${entry.row})">Delete</button></td>
        </tr>
    `).join('');
}

function exportEntries() {
    if (allEntries.length === 0) return;

    const csv = "Name,USN,Semester,Entry Date,Entry Time\n" +
        allEntries.map(e => `"${e.name}","${e.usn}","${e.semester}","${e.entryDate}","${e.entryTime}"`).join('\n');

    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.download = `entries_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        let date;
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) date = new Date(parts[2], parts[0] - 1, parts[1]);
        } else {
            date = new Date(dateStr);
        }

        if (isNaN(date.getTime())) return dateStr;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${date.getFullYear()}`;
    } catch {
        return dateStr;
    }
}

function formatTime(timeStr) {
    if (!timeStr || !timeStr.includes(':')) return timeStr;
    try {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            let hours = parseInt(parts[0]);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${parts[1]} ${ampm}`;
        }
        return timeStr;
    } catch {
        return timeStr;
    }
}

const toggleClearButton = () => {
    const searchInput = document.getElementById('searchInput');
    document.getElementById('searchClearBtn').classList.toggle('show', searchInput.value.trim() !== '');
};

const clearSearch = () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    document.getElementById('searchClearBtn').classList.remove('show');
    searchInput.focus();
    filterEntries();
};

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('semesterFilter').value = '';
    document.getElementById('searchClearBtn').classList.remove('show');
    filterEntries();

    const clearAllBtn = document.querySelector('.clear-all-filters-btn');
    const originalText = clearAllBtn.textContent;
    clearAllBtn.textContent = 'Cleared!';
    clearAllBtn.style.background = 'linear-gradient(135deg, var(--success-color), #1e7e34)';
    setTimeout(() => {
        clearAllBtn.textContent = originalText;
        clearAllBtn.style.background = '';
    }, 1000);
}