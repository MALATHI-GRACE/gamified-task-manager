# 🎨 Frontend Architecture (HTML, CSS, JS)

This document explains the frontend structure of the **Gamified Task Manager**, built using HTML, CSS, JavaScript, and Bootstrap.

---

## 🧱 HTML Templates

- `home.html`: Entry point for login/signup navigation
- `login.html`: User authentication form
- `skill_career.html`: Custom task entry with form + dynamic rendering
- `personal.html`: Fixed daily wellness tasks with streaks
- `dashboard.html`: Combined summary of points, progress, and streak

---

## 🎨 CSS Styling

- Styled with pure CSS and Bootstrap
- Uses grid and flexbox layouts for responsive containers
- Rounded cards, soft shadows, and hover animations
- `@media` queries for mobile responsiveness

---

## 🧠 JavaScript Logic

### `skill_career.js`

- Handles:
  - Dynamic task rendering with `renderTask()`
  - Subtask checkbox logic and completion sync
  - Notes display and edit
  - Progress bar updates
  - Task form population on Edit
  - API calls (GET/POST/DELETE) using Fetch and CSRF tokens

### `personal.js`

- Fixed daily tasks (eg. Hydrate, Meditate, Plan Tomorrow)
- Completing each task gives points
- Tracks streaks using dates in LocalStorage
- Unlocks **Rock–Paper–Scissors** game when all task completed

---

## 💾 LocalStorage Usage

- `personalPoints`, `personalStreak`, and `personalTasksCompleted` are stored in `localStorage`
- Used in `dashboard.js` to show live personal stats
- Ensures data persists even on refresh

---

## 🖱️ UI Interactions

### Skill Sprint:
- Add Task ➤ Fill form (title, category, duration, optional notes, subtasks)
- Edit ➤ Form auto-filled with old data
- Delete ➤ Removes from DB and re-renders list
- Subtasks ➤ Completion tracked instantly, progress recalculated

### Personal Bloom:
- 8 fixed tasks shown daily
- Each completion updates streak + points
- If all complete ➤ Bonus game unlocked

---

## ✅ Responsive Behavior

- Fully mobile-optimized
- Adapts layouts for small screens
- Progress bars, task boxes, and inputs adjust responsively


