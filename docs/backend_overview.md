# 🐍 Backend Architecture (Django + DRF)

This document outlines the backend logic of the **Gamified Task Manager** project, built with Django and Django REST Framework.

---

## 📦 Project Stack

- **Framework**: Django (Python 3.x)
- **Database**: MySQL
- **API Layer**: Django REST Framework (DRF)
- **Authentication**: Session-based (built-in Django)
- **Security**: CSRF protection, `.env` file for secrets

---

## 🔧 Models

- **`Task`**
  - Fields: `title`, `category`, `duration`, `notes`
  - Each task can have multiple subtasks.
  
- **`Subtask`**
  - Fields: `title`, `is_completed`
  - Linked to `Task` via `ForeignKey`.

---

## 🧠 Serializers

- **`TaskSerializer`**
  - Converts task data (with nested subtasks) to/from JSON.
- **`SubtaskSerializer`**
  - Handles individual subtask data.

---

## 🛠️ API Views (Django DRF)

- Built using `@api_view` decorators.
- Uses Django ORM to handle data interactions with MySQL.

### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tasks/` | List all tasks |
| POST   | `/api/tasks/` | Create a new task (with subtasks) |
| PUT    | `/api/tasks/<id>/` | Update task and its subtasks |
| DELETE | `/api/tasks/<id>/` | Delete a task |
| POST   | `/api/update-subtask/<id>/` | Toggle subtask completion |

---

## 🔐 User Authentication

- Custom `RegisterView` and `LoginView`
- Login required to access the dashboard
- Session-based login system with redirect messages

---

## 🗃️ Database + Environment

- **Database**: MySQL
- **Environment Config**: `.env` file contains:

```env
SECRET_KEY=your_secret_key
DB_NAME=your_db_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
