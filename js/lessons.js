/**
 * lessons.js
 * ===========
 * Shared lesson engine.
 * Each lesson HTML page sets two global variables before loading this script:
 *
 *   var LEVEL_NUMBER = 3;   // Which level (1-6)
 *   var LESSONS = [ ... ];  // Array of lesson objects for this level
 *
 * Each lesson object:
 * {
 *   title: "Lesson title",
 *   content: "HTML string with the lesson body"
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

  // ── Show student name ────────────────────────────────────────────────────
  document.getElementById('headerStudentName').textContent = name;

  // ── Level title ──────────────────────────────────────────────────────────
  var LEVEL_TITLES = [
    '', // index 0 unused
    'Level 1 — HTML Fundamentals',
    'Level 2 — Advanced HTML & Accessibility',
    'Level 3 — CSS Fundamentals',
    'Level 4 — Advanced CSS',
    'Level 5 — JavaScript Fundamentals',
    'Level 6 — Advanced JavaScript'
  ];
  document.getElementById('levelTitle').textContent = LEVEL_TITLES[LEVEL_NUMBER];

  // ── State ────────────────────────────────────────────────────────────────
  var currentIndex = 0; // 0-based lesson index
  var totalLessons = LESSONS.length; // always 6

  // ── Restore last lesson visited ──────────────────────────────────────────
  var savedDone = getLessonsDone(username, LEVEL_NUMBER);
  // We start at the last completed lesson (or 0)
  currentIndex = (savedDone > 0 && savedDone < totalLessons) ? savedDone : 0;

  // ── DOM references ───────────────────────────────────────────────────────
  var lessonNumber  = document.getElementById('lessonNumber');
  var lessonTitle   = document.getElementById('lessonTitle');
  var lessonContent = document.getElementById('lessonContent');
  var prevBtn       = document.getElementById('prevBtn');
  var nextBtn       = document.getElementById('nextBtn');
  var progressBar   = document.getElementById('lessonProgressBar');
  var progressPct   = document.getElementById('lessonProgressPct');

  // ── Render current lesson ────────────────────────────────────────────────
  function renderLesson(index) {
    var lesson = LESSONS[index];
    var displayNum = index + 1;

    lessonNumber.textContent  = 'Lesson ' + displayNum + ' of ' + totalLessons;
    lessonTitle.textContent   = lesson.title;
    lessonContent.innerHTML   = lesson.content;

    // Update progress
    var pct = Math.round((displayNum / totalLessons) * 100);
    progressBar.style.width   = pct + '%';
    progressPct.textContent   = pct + '%';

    // Mark lesson as done in storage
    markLessonDone(username, LEVEL_NUMBER, displayNum);

    // Previous button
    prevBtn.disabled = (index === 0);

    // Next / Start Quiz button
    if (index === totalLessons - 1) {
      nextBtn.textContent = '🎯 Start Quiz';
      nextBtn.className   = 'btn btn-quiz';
      nextBtn.onclick     = function () {
        window.location.href = 'level' + LEVEL_NUMBER + '-quiz.html';
      };
    } else {
      nextBtn.textContent = 'Next Lesson →';
      nextBtn.className   = 'btn btn-primary';
      nextBtn.onclick     = function () {
        goToLesson(currentIndex + 1);
      };
    }

    // Scroll to top of content
    lessonContent.parentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function goToLesson(index) {
    currentIndex = index;
    renderLesson(currentIndex);
  }

  // ── Button events ────────────────────────────────────────────────────────
  prevBtn.addEventListener('click', function () {
    if (currentIndex > 0) {
      goToLesson(currentIndex - 1);
    }
  });

  nextBtn.addEventListener('click', function () {
    if (currentIndex < totalLessons - 1) {
      goToLesson(currentIndex + 1);
    }
  });

  // ── Initial render ───────────────────────────────────────────────────────
  renderLesson(currentIndex);
});
