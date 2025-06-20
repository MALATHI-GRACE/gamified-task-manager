        const lastDate = localStorage.getItem("personalLastCompletedDate");
        const today = new Date().toISOString().split("T")[0];


        console.log("Last Date:", lastDate);
        console.log("Today:", today);

        if (lastDate !== today) {
            // New day! Reset tasks
            localStorage.removeItem("personalTasks");
            // Reset game flag for today
            localStorage.removeItem("personalGamePlayed");
            localStorage.setItem("personalLastCompletedDate", today);
        }

        const TASKS = [
            "Meditate",
            "Morning Walk",
            "Stay Hydrated",
            "Healthy Diet",
            "Journaling",
            "Act of Kindness",
            "Express Creativity",
            "Plan Tomorrow"
        ];
    
        const POINTS_PER_TASK = 20;
    
        document.addEventListener("DOMContentLoaded", function () {
            loadTaskState();
            restoreStats();
            bindCheckboxListeners();  
            document.querySelectorAll(".task-checkbox").forEach((checkbox, index) => {
                checkbox.addEventListener("change", () => {
                    const taskStates = JSON.parse(localStorage.getItem("personalTasks")) || {};
                    taskStates[TASKS[index]] = checkbox.checked;
                    localStorage.setItem("personalTasks", JSON.stringify(taskStates));
                    updateStats();
                });
            });
            updateStats();
        });
    
        function loadTaskState() {
            const taskStates = JSON.parse(localStorage.getItem("personalTasks")) || {};
            document.querySelectorAll(".task-checkbox").forEach((checkbox, index) => {
                checkbox.checked = !!taskStates[TASKS[index]];
            });
        }
    
        function restoreStats() {
            const totalPoints = localStorage.getItem("personalPoints") || 0;
            const percent = localStorage.getItem("personalProgress") || 0;
            const badge = localStorage.getItem("personalBadge") || "None";
            const streakData = JSON.parse(localStorage.getItem("personalStreak") || "[]");

            document.getElementById("points").textContent = totalPoints;
            document.getElementById("progress").value = percent;
            document.getElementById("progress-text").textContent = `${percent}%`;
            document.getElementById("badge").textContent = badge;
            document.getElementById("streak").textContent = streakData.length;
        }

        function bindCheckboxListeners() {
            document.querySelectorAll(".task-checkbox").forEach((checkbox, index) => {
                checkbox.addEventListener("change", () => {
                    const taskStates = JSON.parse(localStorage.getItem("personalTasks")) || {};
                    taskStates[TASKS[index]] = checkbox.checked;
                    localStorage.setItem("personalTasks", JSON.stringify(taskStates));
                    updateStats();
                });
            });
        }
        function updateStats() {
            const taskStates = JSON.parse(localStorage.getItem("personalTasks")) || {};
            let completedCount = 0;
            TASKS.forEach(task => {
                if (taskStates[task]) completedCount++;
            });

        
            localStorage.setItem("personalTasksCompleted", completedCount);

            const percent = Math.round((completedCount / TASKS.length) * 100);
            localStorage.setItem("personalProgress", percent);
                
         
            const totalPoints = completedCount * POINTS_PER_TASK;
            localStorage.setItem("personalPoints", totalPoints);
            document.getElementById("points").textContent = totalPoints;
    
          
            document.getElementById("progress").value = percent;
            document.getElementById("progress-text").textContent = `${percent}%`;
    
            
            let badge = "None";
            if (totalPoints >= 150) badge = "Achiever";
            else if (totalPoints >= 100) badge = "Committed";
            else if (totalPoints >= 60) badge = "Starter";
    
            document.getElementById("badge").textContent = badge;
            localStorage.setItem("personalBadge", badge);

            // 👇 Track streak
            updateStreak(completedCount);

          
            if (completedCount === TASKS.length && TASKS.length > 0) {
                showPopup("Hurray! You completed all your tasks today! 🎉");

              
                setTimeout(() => {
                    if (!localStorage.getItem("personalGamePlayed")) {
                        localStorage.setItem("personalGamePlayed", "true");
                        playRockPaperScissors(); // Trigger the game
                    }
                }, 900); 
            
            const today = new Date().toISOString().split("T")[0];
            localStorage.setItem("personalLastCompletedDate", today);
            }
        }

          function showPopup(message) {
            const popup = document.createElement("div");
            popup.textContent = message;
            popup.style.position = "fixed";
            popup.style.top = "80px";
            popup.style.left = "50%";
            popup.style.transform = "translateX(-50%)";
            popup.style.backgroundColor = "#28a745";
            popup.style.color = "white";
            popup.style.padding = "15px 25px";
            popup.style.fontSize = "18px";
            popup.style.fontWeight = "bold";
            popup.style.borderRadius = "10px";
            popup.style.zIndex = "9999";
            popup.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
            popup.style.transition = "opacity 0.4s ease";
            document.body.appendChild(popup);

            setTimeout(() => {
                popup.style.opacity = "0";
                setTimeout(() => popup.remove(), 600);
            }, 2500);
        }

        function updateStreak(completedCount) {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            let streakData = JSON.parse(localStorage.getItem("personalStreak")) || [];

            if (completedCount > 0 && !streakData.includes(today)) {
                streakData.push(today);
                localStorage.setItem("personalStreak", JSON.stringify(streakData));
            }

            // Update streak count
            document.getElementById("streak").textContent = streakData.length;
        }
     

        // Interactive Game function
            function playRockPaperScissors() {
            let playGame = confirm("Shall we play Rock, Paper, or Scissors as your reward?");
            
            if (!playGame) {
                alert("Ok, maybe tomorrow!");
                return;
            }

            let playerChoice = prompt("Please enter rock, paper, or scissors:");
            
            if (!playerChoice) {
                alert("I guess you changed your mind. Maybe tomorrow...");
                return;
            }

            let you = playerChoice.trim().toLowerCase();
            let validChoices = ["rock", "paper", "scissors"];

            if (!validChoices.includes(you)) {
                alert("Invalid choice. Please enter rock, paper, or scissors.");
                if (confirm("Play Again?")) {
                    playRockPaperScissors();
                } else {
                    alert("Ok, thanks for playing.");
                }
                return;
            }

            let computerChoice = validChoices[Math.floor(Math.random() * 3)];
            
            let result;
            if (you === computerChoice) {
                result = "Tie game!";
            } else if (
                (you === "rock" && computerChoice === "scissors") ||
                (you === "paper" && computerChoice === "rock") ||
                (you === "scissors" && computerChoice === "paper")
            ) {
                result = `You: ${you}\nComputer: ${computerChoice}\nYou won! Congrats! 🎉`;
            } else {
                result = `You: ${you}\nComputer: ${computerChoice}\nComputer wins! Better luck next time.`;
            }

            alert(result);

            if (confirm("Play Again?")) {
                playRockPaperScissors();
            } else {
                alert("Thanks for playing!");
            }
        }

        
        function toggleStats() {
            const statsContainer = document.getElementById("statsContainer");
            statsContainer.classList.toggle("active");
        }
