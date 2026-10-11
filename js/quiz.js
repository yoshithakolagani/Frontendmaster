/**
 * quiz.js
 * ========
 * Shared quiz engine.
 * Each quiz HTML page sets:
 *   var LEVEL_NUMBER = 2;   // Level number (1-6)
 *   var QUIZ_DATA = [ ... ]; // Array of 10 question objects
 *
 * Each question object:
 * {
 *   question: "...",
 *   options: ["A", "B", "C", "D"],
 *   correct: 2,              // 0-based index of correct option
 *   explanation: "..."
 * }
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

  // ── DOM references ───────────────────────────────────────────────────────
  var headerStudentName = document.getElementById('headerStudentName');
  var levelTitleEl      = document.getElementById('levelTitle');
  var questionCounter   = document.getElementById('questionCounter');
  var scoreCounter      = document.getElementById('scoreCounter');
  var timerEl           = document.getElementById('timerDisplay');
  var progressBar       = document.getElementById('quizProgressBar');
  var questionText      = document.getElementById('questionText');
  var optionsContainer  = document.getElementById('optionsContainer');
  var explanationBox    = document.getElementById('explanationBox');
  var nextBtn           = document.getElementById('nextBtn');

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

  headerStudentName.textContent = name;
  levelTitleEl.textContent      = LEVEL_TITLES[LEVEL_NUMBER];

  // ── State ────────────────────────────────────────────────────────────────
  var currentQ    = 0;
  var score       = 0;
  var answered    = false;
  var quizEnded   = false;
  var timerInterval = null;
  var totalSeconds  = 600; // 10 minutes

  // ── Timer ────────────────────────────────────────────────────────────────
  function formatTime(secs) {
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  timerEl.textContent = formatTime(totalSeconds);

  timerInterval = setInterval(function () {
    if (quizEnded) {
      clearInterval(timerInterval);
      return;
    }
    totalSeconds--;
    timerEl.textContent = formatTime(totalSeconds);
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      autoSubmit();
    }
  }, 1000);

  function autoSubmit() {
    if (quizEnded) return;
    quizEnded = true;
    finishQuiz();
  }

  // ── Decode HTML entities helper ──────────────────────────────────────────
  function decodeHtml(str) {
    if (!str) return '';
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  // ── Render question ──────────────────────────────────────────────────────
  function renderQuestion(index) {
    answered = false;
    var q = QUIZ_DATA[index];
    var displayNum = index + 1;
    var total = QUIZ_DATA.length;

    // Progress bar — start at 0 before answering first question
    var pct = Math.round((index / total) * 100);
    progressBar.style.width = pct + '%';

    questionCounter.textContent = displayNum + ' / ' + total;
    scoreCounter.textContent    = score;
    questionText.textContent    = decodeHtml(q.question);
    explanationBox.style.display = 'none';
    explanationBox.textContent   = '';

    // Buttons
    nextBtn.disabled    = true;
    nextBtn.textContent = (index === total - 1) ? 'View Results →' : 'Next Question →';

    // Build option buttons
    optionsContainer.innerHTML = '';
    q.options.forEach(function (optText, optIndex) {
      var btn = document.createElement('button');
      btn.className   = 'option-btn';
      btn.textContent = decodeHtml(optText);
      btn.addEventListener('click', function () {
        selectAnswer(optIndex, q.correct, q.explanation);
      });
      optionsContainer.appendChild(btn);
    });
  }

  // ── Answer selection ─────────────────────────────────────────────────────
  function selectAnswer(selectedIndex, correctIndex, explanation) {
    if (answered) return;
    answered = true;

    var buttons = optionsContainer.querySelectorAll('.option-btn');

    // Disable all options
    buttons.forEach(function (btn) {
      btn.disabled = true;
    });

    // Highlight correct and incorrect
    buttons[correctIndex].classList.add('correct');
    if (selectedIndex !== correctIndex) {
      buttons[selectedIndex].classList.add('incorrect');
    } else {
      score++;
      scoreCounter.textContent = score;
    }

    // Show explanation
    explanationBox.textContent   = '💡 ' + decodeHtml(explanation);
    explanationBox.style.display = 'block';

    // Enable next button
    nextBtn.disabled = false;
  }

  // ── Next button ──────────────────────────────────────────────────────────
  nextBtn.addEventListener('click', function () {
    if (!answered) return;

    currentQ++;
    if (currentQ >= QUIZ_DATA.length) {
      // All questions answered
      quizEnded = true;
      clearInterval(timerInterval);
      finishQuiz();
    } else {
      renderQuestion(currentQ);
    }
  });

  // ── Finish quiz ──────────────────────────────────────────────────────────
  function finishQuiz() {
    // Save progress
    processQuizResult(username, LEVEL_NUMBER, score);

    // Navigate to result page
    window.location.href = 'level' + LEVEL_NUMBER + '-result.html';
  }

  // ── Initial render ───────────────────────────────────────────────────────
  renderQuestion(0);
});
