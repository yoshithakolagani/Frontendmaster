/**
 * result.js
 * ==========
 * Shared result page logic.
 * Each result HTML page sets:
 *   var LEVEL_NUMBER = 3;
 */

document.addEventListener('DOMContentLoaded', function () {
  // ── Auth + access check ──────────────────────────────────────────────────
  var student;
  try {
    student = requireAuth();
    requireLevel(student.username, LEVEL_NUMBER);
  } catch (e) {
    return;
  }

  var username = student.username;
  var name     = student.name;

  // ── Level title map ──────────────────────────────────────────────────────
  var LEVEL_TITLES = [
    '',
    'Level 1 — HTML Fundamentals',
    'Level 2 — Advanced HTML & Accessibility',
    'Level 3 — CSS Fundamentals',
    'Level 4 — Advanced CSS',
    'Level 5 — JavaScript Fundamentals',
    'Level 6 — Advanced JavaScript'
  ];

  // ── Guard: quiz must have been taken ────────────────────────────────────
  if (!isQuizDone(username, LEVEL_NUMBER)) {
    // No quiz result stored — redirect to the quiz
    window.location.href = 'level' + LEVEL_NUMBER + '-quiz.html';
    return;
  }

  var score = getLevelScore(username, LEVEL_NUMBER);
  if (score === null) score = 0;

  var passed  = (score >= 9);
  var percent = Math.round((score / 10) * 100);

  // ── Populate DOM ─────────────────────────────────────────────────────────
  document.getElementById('resultStudentName').textContent = name;
  document.getElementById('resultLevelTitle').textContent  = LEVEL_TITLES[LEVEL_NUMBER];
  document.getElementById('resultScore').textContent       = score + ' / 10';
  document.getElementById('resultPercent').textContent     = percent + '%';

  var statusEl = document.getElementById('resultStatus');
  var messageEl = document.getElementById('resultMessage');
  var actionContainer = document.getElementById('resultAction');

  if (passed) {
    statusEl.textContent  = '🎉 Passed!';
    statusEl.className    = 'result-status pass';

    if (LEVEL_NUMBER === 6) {
      // Course complete
      messageEl.textContent = 'Outstanding! You have completed the entire Frontend Master course. You are now equipped with solid HTML, CSS, and JavaScript skills!';
      actionContainer.innerHTML =
        '<a href="dashboard.html" class="btn btn-primary">🏠 Back to Dashboard</a>';
    } else {
      messageEl.textContent = 'Excellent work! You have unlocked Level ' + (LEVEL_NUMBER + 1) + '. Keep going!';
      actionContainer.innerHTML =
        '<a href="level' + (LEVEL_NUMBER + 1) + '-lesson.html" class="btn btn-primary">Continue to Level ' + (LEVEL_NUMBER + 1) + ' →</a>' +
        ' <a href="dashboard.html" class="btn btn-secondary">Dashboard</a>';
    }
  } else {
    statusEl.textContent  = '😅 Not Passed';
    statusEl.className    = 'result-status fail';
    messageEl.textContent = 'You need 9 or 10 to pass. Review the lessons and try again — you can do it!';
    actionContainer.innerHTML =
      '<a href="level' + LEVEL_NUMBER + '-quiz.html" class="btn btn-primary">🔁 Retry Quiz</a>' +
      ' <a href="level' + LEVEL_NUMBER + '-lesson.html" class="btn btn-secondary">Review Lessons</a>' +
      ' <a href="dashboard.html" class="btn btn-outline">Dashboard</a>';
  }

  // ── Score visual bar ─────────────────────────────────────────────────────
  var barFill = document.getElementById('resultBarFill');
  if (barFill) {
    barFill.style.width = percent + '%';
    barFill.className   = 'result-bar-fill ' + (passed ? 'bar-pass' : 'bar-fail');
  }
});
