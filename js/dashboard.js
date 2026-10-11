/**
 * dashboard.js
 * =============
 * Renders the student dashboard: level cards, progress bar,
 * welcome message, and handles logout.
 */

// ─── Level metadata ────────────────────────────────────────────────────────
var LEVEL_META = [
  { title: 'HTML Fundamentals',              desc: 'Learn the building blocks of every webpage.' },
  { title: 'Advanced HTML & Accessibility',  desc: 'Semantic elements, forms, and ARIA basics.' },
  { title: 'CSS Fundamentals',               desc: 'Selectors, colors, typography, and the box model.' },
  { title: 'Advanced CSS',                   desc: 'Flexbox, Grid, media queries, and animations.' },
  { title: 'JavaScript Fundamentals',        desc: 'Variables, loops, functions, and arrays.' },
  { title: 'Advanced JavaScript',            desc: 'Array methods, DOM, Promises, async/await, JSON.' }
];

document.addEventListener('DOMContentLoaded', function () {
  // Guard — redirect if not logged in
  var student;
  try { student = requireAuth(); } catch (e) { return; }

  var username = student.username;
  var name     = student.name;

  // ── Set welcome message ──────────────────────────────────────────────────
  document.getElementById('welcomeName').textContent = name;
  document.getElementById('headerName').textContent  = name;

  // ── Overall progress bar ─────────────────────────────────────────────────
  var pct = calcOverallProgress(username);
  document.getElementById('overallPercent').textContent = pct + '%';
  document.getElementById('overallBar').style.width     = pct + '%';

  // ── Course completion banner ─────────────────────────────────────────────
  if (isCourseComplete(username)) {
    document.getElementById('completionBanner').style.display = 'block';
  }

  // ── Build level cards ────────────────────────────────────────────────────
  var grid = document.getElementById('levelGrid');
  var highestAvailable = 1;

  for (var lvl = 1; lvl <= 6; lvl++) {
    var meta    = LEVEL_META[lvl - 1];
    var unlocked = isLevelUnlocked(username, lvl);
    var score   = getLevelScore(username, lvl);
    var passed  = (score !== null && score >= 9);

    if (unlocked && lvl > highestAvailable) highestAvailable = lvl;

    // Build status badge
    var statusHTML = '';
    if (!unlocked) {
      statusHTML = '<span class="badge badge-locked">🔒 Locked</span>';
    } else if (passed) {
      statusHTML = '<span class="badge badge-passed">✅ Completed</span>';
    } else if (score !== null) {
      statusHTML = '<span class="badge badge-retry">🔁 Retry Quiz</span>';
    } else {
      statusHTML = '<span class="badge badge-available">📖 Available</span>';
    }

    // Score line
    var scoreHTML = '';
    if (score !== null) {
      scoreHTML = '<p class="card-score">Score: <strong>' + score + ' / 10</strong></p>';
    }

    // Action button
    var btnHTML = '';
    if (!unlocked) {
      btnHTML = '<button class="btn btn-disabled" disabled>🔒 Locked</button>';
    } else {
      var href = 'level' + lvl + '-lesson.html';
      btnHTML = '<a href="' + href + '" class="btn btn-primary">Start / Continue</a>';
    }

    var card = document.createElement('div');
    card.className = 'level-card' + (unlocked ? '' : ' locked') + (passed ? ' completed' : '');
    card.innerHTML =
      '<div class="card-header-row">' +
        '<span class="level-number">Level ' + lvl + '</span>' +
        statusHTML +
      '</div>' +
      '<h3 class="card-title">' + meta.title + '</h3>' +
      '<p class="card-desc">' + meta.desc + '</p>' +
      scoreHTML +
      '<div class="card-action">' + btnHTML + '</div>';

    grid.appendChild(card);
  }

  // ── Continue learning button ─────────────────────────────────────────────
  var continueBtn = document.getElementById('continueBtn');
  continueBtn.href = 'level' + highestAvailable + '-lesson.html';
  continueBtn.textContent = 'Continue Learning → Level ' + highestAvailable;

  // ── Logout ───────────────────────────────────────────────────────────────
  document.getElementById('logoutBtn').addEventListener('click', function () {
    clearSession();            // Removes session only; progress is preserved
    window.location.href = 'index.html';
  });
});
