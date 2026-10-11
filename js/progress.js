/**
 * progress.js
 * ============
 * Central module for all student progress tracking.
 * Uses student-specific LocalStorage keys to keep each student's
 * data completely separate.
 *
 * Key format: frontendMaster_{username}_{dataKey}
 *
 * NOTE: LocalStorage is NOT a secure authentication system.
 * Data is stored in the browser and can be inspected or modified
 * by anyone with access to the browser's developer tools.
 * This implementation is suitable for a college demo only.
 */

// ─────────────────────────────────────────────
// SESSION HELPERS
// ─────────────────────────────────────────────

/**
 * Returns the currently logged-in student object or null.
 * @returns {{ name: string, username: string } | null}
 */
function getCurrentStudent() {
  const raw = localStorage.getItem('frontendMaster_session');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Saves the current session (name + username).
 * @param {string} name
 * @param {string} username
 */
function saveSession(name, username) {
  localStorage.setItem(
    'frontendMaster_session',
    JSON.stringify({ name: name.trim(), username: username.trim().toLowerCase() })
  );
}

/**
 * Clears only the session cookie (does NOT delete student progress).
 */
function clearSession() {
  localStorage.removeItem('frontendMaster_session');
}

// ─────────────────────────────────────────────
// KEY BUILDER
// ─────────────────────────────────────────────

/**
 * Builds a namespaced LocalStorage key for the given student.
 * @param {string} username
 * @param {string} key  e.g. 'level1Unlocked'
 * @returns {string}
 */
function buildKey(username, key) {
  return 'frontendMaster_' + username + '_' + key;
}

// ─────────────────────────────────────────────
// LEVEL UNLOCK HELPERS
// ─────────────────────────────────────────────

/**
 * Checks whether the given level (1-6) is unlocked for the student.
 * Level 1 is always unlocked for registered students.
 * @param {string} username
 * @param {number} level
 * @returns {boolean}
 */
function isLevelUnlocked(username, level) {
  if (level === 1) return true;
  return localStorage.getItem(buildKey(username, 'level' + level + 'Unlocked')) === 'true';
}

/**
 * Unlocks the given level for the student.
 * @param {string} username
 * @param {number} level
 */
function unlockLevel(username, level) {
  if (level > 1 && level <= 6) {
    localStorage.setItem(buildKey(username, 'level' + level + 'Unlocked'), 'true');
  }
}

// ─────────────────────────────────────────────
// SCORE HELPERS
// ─────────────────────────────────────────────

/**
 * Returns the quiz score for the given level, or null if not taken.
 * @param {string} username
 * @param {number} level
 * @returns {number|null}
 */
function getLevelScore(username, level) {
  const raw = localStorage.getItem(buildKey(username, 'level' + level + 'Score'));
  if (raw === null) return null;
  return parseInt(raw, 10);
}

/**
 * Saves the quiz score for the given level.
 * @param {string} username
 * @param {number} level
 * @param {number} score
 */
function saveLevelScore(username, level, score) {
  localStorage.setItem(buildKey(username, 'level' + level + 'Score'), String(score));
}

// ─────────────────────────────────────────────
// QUIZ COMPLETION
// ─────────────────────────────────────────────

/**
 * Marks the quiz for the given level as completed.
 * @param {string} username
 * @param {number} level
 */
function markQuizDone(username, level) {
  localStorage.setItem(buildKey(username, 'level' + level + 'QuizDone'), 'true');
}

/**
 * Checks whether the quiz for the given level is completed.
 * @param {string} username
 * @param {number} level
 * @returns {boolean}
 */
function isQuizDone(username, level) {
  return localStorage.getItem(buildKey(username, 'level' + level + 'QuizDone')) === 'true';
}

// ─────────────────────────────────────────────
// LESSON COMPLETION
// ─────────────────────────────────────────────

/**
 * Saves how many lessons (1-6) a student has completed for a level.
 * @param {string} username
 * @param {number} level
 * @param {number} lessonIndex  The lesson index completed (1-6)
 */
function markLessonDone(username, level, lessonIndex) {
  const key = buildKey(username, 'level' + level + 'LessonsDone');
  const raw = localStorage.getItem(key);
  let done = raw ? parseInt(raw, 10) : 0;
  if (lessonIndex > done) {
    localStorage.setItem(key, String(lessonIndex));
  }
}

/**
 * Returns the highest lesson index the student has reached for a level.
 * @param {string} username
 * @param {number} level
 * @returns {number}  0 means no lesson started yet
 */
function getLessonsDone(username, level) {
  const raw = localStorage.getItem(buildKey(username, 'level' + level + 'LessonsDone'));
  return raw ? parseInt(raw, 10) : 0;
}

// ─────────────────────────────────────────────
// COURSE COMPLETION
// ─────────────────────────────────────────────

/**
 * Marks the entire course as completed for the student.
 * @param {string} username
 */
function markCourseComplete(username) {
  localStorage.setItem(buildKey(username, 'courseComplete'), 'true');
}

/**
 * Checks whether the student has completed the entire course.
 * @param {string} username
 * @returns {boolean}
 */
function isCourseComplete(username) {
  return localStorage.getItem(buildKey(username, 'courseComplete')) === 'true';
}

// ─────────────────────────────────────────────
// PROGRESS CALCULATION
// ─────────────────────────────────────────────

/**
 * Calculates the overall learning progress percentage for a student.
 * Each level contributes equally. A level is "done" when its quiz is passed.
 * @param {string} username
 * @returns {number}  0-100
 */
function calcOverallProgress(username) {
  let completedLevels = 0;
  for (let lvl = 1; lvl <= 6; lvl++) {
    const score = getLevelScore(username, lvl);
    if (score !== null && score >= 9) {
      completedLevels++;
    }
  }
  return Math.round((completedLevels / 6) * 100);
}

/**
 * Applies pass/fail logic after a quiz is submitted:
 * - Always saves the score.
 * - Marks quiz done.
 * - If score >= 9 AND there's a next level, unlocks it.
 * - If it's level 6 and score >= 9, marks the course complete.
 * @param {string} username
 * @param {number} level
 * @param {number} score
 */
function processQuizResult(username, level, score) {
  saveLevelScore(username, level, score);
  markQuizDone(username, level);

  if (score >= 9) {
    if (level < 6) {
      unlockLevel(username, level + 1);
    } else {
      markCourseComplete(username);
    }
  }
}

/**
 * Checks if the student is authenticated; if not, redirects to login.
 * Call this at the top of every protected page.
 * @param {string} [redirectTo='index.html']
 * @returns {{ name: string, username: string } | never}
 */
function requireAuth(redirectTo) {
  const student = getCurrentStudent();
  if (!student) {
    window.location.href = redirectTo || 'index.html';
    throw new Error('Not authenticated'); // Stops further execution
  }
  return student;
}

/**
 * Checks if the student is allowed to access the given level.
 * Redirects to dashboard if not unlocked.
 * @param {string} username
 * @param {number} level
 */
function requireLevel(username, level) {
  if (!isLevelUnlocked(username, level)) {
    window.location.href = 'dashboard.html';
    throw new Error('Level locked');
  }
}
