# Frontend Master – An Interactive Level-Based Frontend Learning and Assessment System

A complete educational web application built with **HTML5, CSS3, and vanilla JavaScript** (no external frameworks or libraries).

## 📁 Project Structure

```
Frontend-Master/
│
├── index.html                  # Student Login page
├── dashboard.html              # Dashboard with Level Cards & Progress Tracking
│
├── level1-lesson.html          # Level 1: HTML Fundamentals (6 Lessons)
├── level1-quiz.html            # Level 1 Quiz (10 MCQs with 10:00 Timer)
├── level1-result.html          # Level 1 Assessment Result
│
├── level2-lesson.html          # Level 2: Advanced HTML & Accessibility (6 Lessons)
├── level2-quiz.html            # Level 2 Quiz (10 MCQs)
├── level2-result.html          # Level 2 Assessment Result
│
├── level3-lesson.html          # Level 3: CSS Fundamentals (6 Lessons)
├── level3-quiz.html            # Level 3 Quiz (10 MCQs)
├── level3-result.html          # Level 3 Assessment Result
│
├── level4-lesson.html          # Level 4: Advanced CSS (6 Lessons)
├── level4-quiz.html            # Level 4 Quiz (10 MCQs)
├── level4-result.html          # Level 4 Assessment Result
│
├── level5-lesson.html          # Level 5: JavaScript Fundamentals (6 Lessons)
├── level5-quiz.html            # Level 5 Quiz (10 MCQs)
├── level5-result.html          # Level 5 Assessment Result
│
├── level6-lesson.html          # Level 6: Advanced JavaScript (6 Lessons)
├── level6-quiz.html            # Level 6 Quiz (10 MCQs)
├── level6-result.html          # Level 6 Final Course Completion Result
│
├── css/
│   └── style.css               # Shared Unified Design System
│
└── js/
    ├── progress.js             # LocalStorage Data Manager & Auth Guards
    ├── main.js                 # Login Validation & Session Initiation
    ├── dashboard.js            # Dashboard Rendering & Level Computation
    ├── lessons.js              # Shared Interactive Lesson Engine
    ├── quiz.js                 # Shared 10-Question Quiz Engine & Timer
    └── result.js               # Shared Result Assessment & Level Unlocker
```

---

## 🚀 How to Run the Project

### Method 1: Direct File Access (No Server Required)
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Method 2: Local Development Server (Optional)
If running via a local server:
- Using Python:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.
- Using VS Code: Right-click `index.html` and click **"Open with Live Server"**.

---

## 🔒 How Student Progress is Stored

All data is stored in the browser's `localStorage` using a namespaced key scheme:
- `frontendMaster_session` — Current session `{ name, username }`
- `frontendMaster_<username>_displayName` — Full name
- `frontendMaster_<username>_level<N>Unlocked` — `'true'` / `'false'`
- `frontendMaster_<username>_level<N>Score` — Number (0–10)
- `frontendMaster_<username>_level<N>QuizDone` — `'true'` / `'false'`
- `frontendMaster_<username>_level<N>LessonsDone` — Highest lesson reached (1–6)
- `frontendMaster_<username>_courseComplete` — `'true'` when Level 6 is passed

### Level Unlocking Rule
- Score **≥ 9 out of 10** unlocks the next level.
- Score **< 9 out of 10** keeps the next level locked and allows retrying the quiz.
- Logging out clears only `frontendMaster_session`. Saved student progress is retained.

---

## ⚠️ Important Security Limitation
This project uses **client-side LocalStorage** for session and progress tracking. 
While suitable for college demonstrations and local learning without a server, it is **not secure authentication**:
- LocalStorage data can be inspected or modified via browser Developer Tools.
- There are no encrypted passwords or server-side tokens.
- For production use, a secure backend (Node.js/Python, database, HTTP-only cookies, JWT/sessions) is required.
