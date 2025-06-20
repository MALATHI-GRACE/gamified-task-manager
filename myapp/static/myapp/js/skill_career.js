document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-container');
    const addSubtaskBtn = document.getElementById('add-subtask');
    const subtasksContainer = document.getElementById('subtasks-list');
    const taskNameInput = document.getElementById('task-name');
    const categorySelect = document.getElementById('category');
    const durationSelect = document.getElementById('duration');
    let editingTaskId = null;

    // Show and cancel form
    window.showForm = function () {
        document.getElementById('taskForm').style.display = 'block';
        clearForm();
    };
    window.cancelTask = function () {
        document.getElementById('taskForm').style.display = 'none';
        clearForm();
    };

    // Toggle stats panel
    window.toggleStats = function () {
        document.querySelector(".stats-container").classList.toggle("active");
    };

    // Clear form
    function clearForm() {
        taskForm.reset();
        subtasksContainer.innerHTML = `<input type="text" name="subtasks[]" placeholder="Enter subtask" class="subtask-input" required />`;
        editingTaskId = null;
    }

    // Add subtask input
    function addSubTask() {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'subtasks[]';
        input.placeholder = 'Enter subtask';
        input.required = true;
        input.className = 'subtask-input';
        input.style.marginTop = '10px';
        subtasksContainer.appendChild(input);
    }

    addSubtaskBtn.addEventListener('click', addSubTask);

  // Form submit handler (Create / Edit)
    taskForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const taskData = {
            title: taskNameInput.value.trim(),
            category: categorySelect.value,
            duration: durationSelect.value,
            subtasks: Array.from(document.getElementsByClassName('subtask-input'))
                .map(input => input.value.trim())
                .filter(title => title !== '')
                .map(title => ({ title, is_completed: false }))
        };

        const csrftoken = getCookie('csrftoken');

        try {
            let response;
            if (editingTaskId !== null) {
                console.log("Editing task:", editingTaskId);
                response = await fetch(`/api/tasks/${editingTaskId}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(taskData)
                });
                editingTaskId = null;
            } else {
                console.log("Creating task with data:", taskData);
                response = await fetch('/api/tasks/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(taskData)
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server returned error status:", response.status);
                throw new Error(`Server Error: ${response.status}\n${errorText}`);
            }

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.warn("⚠️ Failed to parse JSON response:", jsonError);
                data = {};
            }

            console.log("✅ Task saved successfully:", data);

            taskForm.reset();
            taskForm.style.display = 'none';
            subtasksContainer.innerHTML = `<input type="text" name="subtasks[]" placeholder="Enter subtask" class="subtask-input" required />`;

            await fetchTasksFromDB();

        } catch (error) {
            console.error("❌ Error in submit handler:", error);
            alert(`Error saving/updating task:\n${error.message}`);
        }
    });

    // Fetch and render all tasks
    async function fetchTasksFromDB() {
        const response = await fetch('/api/tasks/');
        const tasks = await response.json();
        localStorage.setItem("skillTasks", JSON.stringify(tasks));
        taskList.innerHTML = '';

        tasks.forEach(task => renderTask(task));

        // Update stats after DOM renders
        setTimeout(() => {
            updateLiveStats();
            updateSkillStats();
        }, 0);
    }

    // Render a task with subtasks, progress, and actions
    function renderTask(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-box';
        // taskDiv.style.backgroundColor = "#f4f4f4";


        const title = document.createElement('h3');
        title.textContent = `${task.title} (${task.category}, ${task.duration})`;

        const subtaskList = document.createElement('ul');
        subtaskList.className = 'subtask-list';

        let completedCount = 0;

        task.subtasks.forEach((subtask) => {
            const li = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'subtask-checkbox';
            checkbox.checked = subtask.is_completed;
            checkbox.dataset.subtaskId = subtask.id;

            if (subtask.is_completed) completedCount++;

            checkbox.addEventListener('change', async () => {
                await fetch(`/api/update-subtask/${subtask.id}/`, {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({ is_completed: checkbox.checked })
                });
                updateLiveStats();
                updateSkillStats();
                updateProgressBar(taskDiv);
            });

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(subtask.title));
            subtaskList.appendChild(li);
        });

        const totalSubtasks = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
        const safeCompleted = totalSubtasks > 0 ? completedCount : 0;
        const progress = totalSubtasks > 0 ? Math.round((safeCompleted / totalSubtasks) * 100) : 0;

        const progressBar = document.createElement('progress');
        progressBar.max = 100;
        progressBar.value = progress;

        const progressText = document.createElement('p');
        progressText.textContent = `Progress: ${progress}%`;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'task-button-edit';
        editBtn.addEventListener('click', () => editTask(task));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'task-button-delete';
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this task?')) {
                await fetch(`/api/tasks/${task.id}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });
                alert('Task deleted successfully');
                await fetchTasksFromDB();
            }
        });

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'task-action-buttons';  // CSS class for styling
        buttonWrapper.appendChild(editBtn);
        buttonWrapper.appendChild(deleteBtn);

        taskDiv.append(title, subtaskList, progressBar, progressText, buttonWrapper);
        taskList.appendChild(taskDiv);
    }

    // Edit task handler
    function editTask(task) {
        console.log("Edit button clicked:", task);

        // Make form visible
        showForm();
        // Prefill inputs
        document.getElementById('task-name').value = task.title;
        document.getElementById('category').value = task.category;
        document.getElementById('duration').value = task.duration;

        const subtasksContainer = document.getElementById('subtasks-list');
        subtasksContainer.innerHTML = ''; // Clear old subtasks

        task.subtasks.forEach(subtask => {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'subtasks[]';
            input.className = 'subtask-input';
            input.required = true;
            input.value = subtask.title;
            subtasksContainer.appendChild(input);
        });

        editingTaskId = task.id;

        // Scroll to form after slight delay
        setTimeout(() => {
            document.getElementById('task-form').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }


    // CSRF token getter
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.split('=')[1]);
            }
        }
        return null;
    }

    // Live stats for top container
    function updateLiveStats() {
        const checkboxes = document.querySelectorAll('.subtask-checkbox');
        const total = checkboxes.length;
        const completed = [...checkboxes].filter(cb => cb.checked).length;
        const points = completed * 20;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('points').innerText = points;
        document.getElementById('progress').value = progress;
        document.getElementById('progress-text').innerText = `Progress: ${progress}%`;

        let badge = 'None';
        if (completed === total && total > 0) {
            badge = 'Skill Master';
        } else if (progress >= 60) {
            badge = 'Skill Scout';
        } else if (progress > 0) {
            badge = 'Skill Starter';
        }

        document.getElementById('badge').innerText = badge;
    }

    // Skill stats used in dashboard
    function updateSkillStats() {
        const tasks = JSON.parse(localStorage.getItem("skillTasks")) || [];

        let totalSubtasks = 0;
        let completedSubtasks = 0;

        tasks.forEach(task => {
            if (task.subtasks) {
                totalSubtasks += task.subtasks.length;
                completedSubtasks += task.subtasks.filter(st => st.is_completed).length;
            }
        });

        const skillPoints = completedSubtasks * 20;
        const skillProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

        const dashboardPoints = document.querySelector('#skill-points');
        const dashboardProgress = document.querySelector('#skill-progress');
        const dashboardProgressText = document.querySelector('#skill-progress-text');
        const dashboardBadge = document.querySelector('#skill-badge');

        if (dashboardPoints) dashboardPoints.innerText = skillPoints;
        if (dashboardProgress) dashboardProgress.value = skillProgress;
        if (dashboardProgressText) dashboardProgressText.innerText = `Progress: ${skillProgress}%`;

        let badge = 'None';
        if (skillProgress === 100) {
            badge = 'Skill Master';
        } else if (skillProgress >= 60) {
            badge = 'Skill Scout';
        } else if (skillProgress > 0) {
            badge = 'Skill Starter';
        }

        if (dashboardBadge) dashboardBadge.innerText = badge;
    }

    // Initial load
    fetchTasksFromDB();
    updateLiveStats();
});

function updateProgressBar(container) {
    const checkboxes = container.querySelectorAll('.subtask-checkbox');
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const progressEl = container.querySelector('progress');
    const textEl = container.querySelector('p');

    if (progressEl) progressEl.value = percent;
    if (textEl) textEl.textContent = `Progress: ${percent}%`;
}

