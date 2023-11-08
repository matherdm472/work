// dark-mode.js


const darkModeToggle = document.getElementById('dark-mode');
darkModeToggle.addEventListener('change', function () {
    if (this.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
}

const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
    enableDarkMode();
    var darkModeCheckbox = document.getElementById('dark-mode');

    // Trigger the 'change' event
    darkModeCheckbox.checked = true; // Set it to true for checked, false for unchecked
    darkModeCheckbox.dispatchEvent(new Event('change'));
}