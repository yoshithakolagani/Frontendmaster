/**
 * main.js
 * ========
 * Handles the login page logic.
 * Validates fields, saves session, and redirects to the dashboard.
 */

document.addEventListener('DOMContentLoaded', function () {
  // If a student is already logged in, go straight to the dashboard
  if (getCurrentStudent()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form = document.getElementById('loginForm');
  const nameInput = document.getElementById('studentName');
  const usernameInput = document.getElementById('studentUsername');
  const nameError = document.getElementById('nameError');
  const usernameError = document.getElementById('usernameError');
  const loginBtn = document.getElementById('loginBtn');

  // Real-time validation helpers
  function clearError(el) { el.textContent = ''; el.style.display = 'none'; }
  function showError(el, msg) { el.textContent = msg; el.style.display = 'block'; }

  nameInput.addEventListener('input', function () {
    if (nameInput.value.trim()) clearError(nameError);
  });
  usernameInput.addEventListener('input', function () {
    if (usernameInput.value.trim()) clearError(usernameError);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const username = usernameInput.value.trim().toLowerCase();
    let valid = true;

    // Validate name
    if (!name) {
      showError(nameError, 'Please enter your full name.');
      valid = false;
    } else {
      clearError(nameError);
    }

    // Validate username
    if (!username) {
      showError(usernameError, 'Please enter a username.');
      valid = false;
    } else if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      showError(usernameError, 'Username must be 3–20 characters: letters, numbers, underscore only.');
      valid = false;
    } else {
      clearError(usernameError);
    }

    if (!valid) return;

    // Check if this username already has a stored name
    const storedName = localStorage.getItem('frontendMaster_' + username + '_displayName');
    if (storedName && storedName !== name) {
      // Different name provided for existing username — warn but allow
      // (For a demo system, we just update the display name)
    }

    // Save display name for this username
    localStorage.setItem('frontendMaster_' + username + '_displayName', name);

    // Save session and go to dashboard
    saveSession(name, username);

    // Animate button
    loginBtn.textContent = 'Logging in…';
    loginBtn.disabled = true;

    setTimeout(function () {
      window.location.href = 'dashboard.html';
    }, 400);
  });
});
