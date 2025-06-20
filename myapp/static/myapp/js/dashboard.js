window.onload = function () {
    // --- Skill Development (Fetched from backend) ---
    fetch("/api/tasks/")
        .then(response => response.json())
        .then(skillTasks => {
            let skillCompleted = 0, skillTotal = 0, skillPoints = 0;

            skillTasks.forEach(task => {
                skillTotal += task.subtasks.length;
                skillCompleted += task.subtasks.filter(sub => sub.is_completed).length;
            });

            skillPoints = skillCompleted * 20;
            if (skillTotal > 0 && skillCompleted === skillTotal && skillTasks.length > 0) {
                skillPoints += 100; // Bonus
            }

            const skillPercent = skillTotal ? Math.round((skillCompleted / skillTotal) * 100) : 0;

            // Update DOM elements
            if (document.getElementById("skillPoints")) {
                document.getElementById("skillPoints").textContent = skillPoints;
            }
            if (document.getElementById("skillProgress")) {
                document.getElementById("skillProgress").style.width = skillPercent + "%";
            }
            if (document.getElementById("skillProgressText")) {
                document.getElementById("skillProgressText").textContent = `${skillPercent}%`;
            }

            const skillBadge = updateBadge(skillPoints, [100, 300, 500]);
            if (document.getElementById("skillBadge")) {
                document.getElementById("skillBadge").textContent = skillBadge;
            }

            // Update localStorage and category count
            localStorage.setItem("skillTasksCompleted", skillCompleted);
            localStorage.setItem("skillPoints", skillPoints);
            localStorage.setItem("skillProgress", skillPercent);
            localStorage.setItem("skillBadge", skillBadge);

            const storedTasks = JSON.parse(localStorage.getItem("skillTasks")) || [];
            const categoryCount = storedTasks.length;
            if (document.getElementById("categoryCount")) {
                document.getElementById("categoryCount").textContent = categoryCount;
            }
            if (document.getElementById("careerTasks")) {
                document.getElementById("careerTasks").textContent = skillCompleted;
            }
        });

    // --- Personal Development (LocalStorage only) ---
    const taskStates = JSON.parse(localStorage.getItem("personalTasks")) || {};
    const TOTAL_PERSONAL_TASKS = 8;
    const completedPersonal = Object.values(taskStates).filter(val => val).length;
    const POINTS_PER_TASK = 20;
    const personalPoints = completedPersonal * POINTS_PER_TASK;
    const personalPercent = TOTAL_PERSONAL_TASKS  > 0 ? Math.round((completedPersonal / TOTAL_PERSONAL_TASKS ) * 100) : 0;

    if (document.getElementById("personalPoints")) {
        document.getElementById("personalPoints").textContent = personalPoints;
    }
    if (document.getElementById("personalTasks")) {
        document.getElementById("personalTasks").textContent = `${completedPersonal}/${TOTAL_PERSONAL_TASKS }`;
    }

    if (document.getElementById("personalProgress")) {
        document.getElementById("personalProgress").style.width = personalPercent + "%";
    }
    if (document.getElementById("personalProgressText")) {
        document.getElementById("personalProgressText").textContent = `${personalPercent}%`;
    }

    let personalBadge = "None";
    if (personalPoints >= 150) personalBadge = "Achiever";
    else if (personalPoints >= 100) personalBadge = "Committed";
    else if (personalPoints >= 60) personalBadge = "Starter";

    if (document.getElementById("personalBadge")) {
        document.getElementById("personalBadge").textContent = personalBadge;
    }

    // Update streak for dashboard view (plain number is fine)
    let streak = 0;
    const streakData = JSON.parse(localStorage.getItem("personalStreak") || "[]");
    if (Array.isArray(streakData)) {
        streak = streakData.length;
    }
    if (document.getElementById("personalStreak")) {
        document.getElementById("personalStreak").textContent = streak;
    }

    // Update localStorage values for consistency
    localStorage.setItem("personalTasksCompleted", completedPersonal);
    localStorage.setItem("personalPoints", personalPoints);
    localStorage.setItem("personalProgress", personalPercent);
    localStorage.setItem("personalBadge", personalBadge);
};

// Badge calculator used in both categories
function updateBadge(points, thresholds) {
    if (points >= thresholds[2]) return "Skill Master";
    else if (points >= thresholds[1]) return "Skill Pro";
    else if (points >= thresholds[0]) return "Skill Scout";
    return "None";
}
