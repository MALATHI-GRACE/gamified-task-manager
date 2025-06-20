# 🎯 Gamified Task Manager

A full-stack Django web app that turns productivity into a game!  
Track personal habits, build skills, and earn rewards — all in a sleek, gamified interface.

---

## 📌 Features

### 🌱 Personal Bloom
- Predefined wellness tasks (e.g., Hydrate, Meditate, Journal)
- Earn **points** for each task
- Tracks **daily streaks**
- **Daily reset** of progress
- 🔓 **Bonus Game:** Rock–Paper–Scissors mini-game unlocked upon full task completion!


### 🧠 Skill Sprint
- Add custom tasks and subtasks
- Track progress with a live progress bar
- Earn **20 points** per completed subtask
- Dynamic task containers per user
- Stats panel with points, badges, and live progress


### 👤 User Authentication
- Secure login and registration
- Dashboard access restricted to logged-in users
- Session-based login system with redirect alerts

### 📊 Dashboard
- Unified stats view for both Skill Sprint & Personal Bloom
- Real-time progress updates synced with LocalStorage
- Streak tracking (Personal only), badges, and total points

### 💅 Responsive UI
- Clean, modern UI built with HTML, CSS, JavaScript, and Bootstrap
- Fully responsive across devices
- Smooth transitions and hover effects

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Django, Django REST Framework
- **Database:** MySQL
- **Version Control:** Git + GitHub
- **Other:** LocalStorage, CSRF protection

---

## 📁 Project Structure

```
task_manager/
├── myapp/
│   ├── static/
│   │   └── myapp/
│   │       ├── css/
│   │       │   ├── dashboard.css
│   │       │   ├── home.css
│   │       │   ├── login.css
│   │       │   ├── personal.css
│   │       │   └── skill_career.css
│   │       ├── js/
│   │       │   ├── dashboard.js
│   │       │   ├── home.js
│   │       │   ├── login.js
│   │       │   ├── personal.js
│   │       │   └── skill_career.js
│   │       └── images/
│   │           └── image.png
│   ├── templates/
│   │   ├── dashboard.html
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── personal.html
│   │   └── skill_career.html
│   ├── views.py
│   ├── models.py
│   ├── admin.py
│   ├── serializers.py
├── task_manager/
│   ├── settings.py
│   ├── urls.py
├── .env
├── .gitignore
├── manage.py
├── requirements.txt
├── README.md

```

---

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/MALATHI-GRACE/gamified-task-manager.git
   cd gamified-task-manager

2. **Create and activate a virtual environment**
    ```bash
    python -m venv env
    env\Scripts\activate  

3. **Install the dependencies**
    ```bash
    pip install -r requirements.txt

4. **Set up your .env file**
    Create a .env file in the root directory and add:
       ```bash
        SECRET_KEY=your_secret_key
        DB_NAME=your_db_name
        DB_USER=your_username
        DB_PASSWORD=your_password
        DB_HOST=localhost
        DB_PORT=3306

5. **Apply migrations**
    ```bash
    python manage.py migrate

6. **Run the development server**
    ```bash
    python manage.py runserver


## 🙌 Acknowledgments
- Built with passion by Malathi Grace
- Feel free to fork, star ⭐, or contribute!





