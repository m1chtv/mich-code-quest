const tasks = {
    easy: {
        1: { description: "Find the maximum number in an array. Example: [1, 3, 2, 5]", solution: '5', hint: "Use Math.max()" },
        2: { description: "Reverse a string. Example: 'hello' -> 'olleh'", solution: 'olleh', hint: "Use string.split().reverse().join()" },
    },
    medium: {
        1: { description: "Check if a string is a palindrome. Example: 'racecar'", solution: 'true', hint: "Compare the string to its reverse" },
        2: { description: "Find the sum of all positive integers less than N.", solution: '10', hint: "Use a loop to sum up numbers" }, // For N=5
    },
    hard: {
        1: { description: "Find the length of the longest increasing subsequence.", solution: '4', hint: "Use dynamic programming" },
    },
    legendary: {
        1: { description: "Find the maximum subarray sum using divide and conquer method.", solution: '6', hint: "Think of dividing the array recursively" },
    }
};

let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || 0;
let selectedDifficulty = 'easy';

function filterTasksByDifficulty() {
    selectedDifficulty = document.getElementById('difficulty-level').value;
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const difficultyTasks = tasks[selectedDifficulty];
    for (let taskId in difficultyTasks) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.textContent = `Task ${taskId}: ${difficultyTasks[taskId].description.split('.')[0]}`;
        taskItem.setAttribute('data-task-id', taskId);
        taskItem.addEventListener('click', () => displayTask(taskId));
        taskList.appendChild(taskItem);
    }
    
    if (Object.keys(difficultyTasks).length > 0) {
        displayTask(Object.keys(difficultyTasks)[0]);
    }
}

function displayTask(taskId) {
    const taskDescription = tasks[selectedDifficulty][taskId].description;
    document.getElementById('task-description').innerHTML = `<strong>Task:</strong> ${taskDescription.replace(/\n/g, "<br>")}`;

    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => item.classList.remove('active'));
    const selectedTask = document.querySelector(`[data-task-id="${taskId}"]`);
    selectedTask.classList.add('active');

    document.getElementById('code-editor').value = '';
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('task-hint').innerHTML = '';
}

function updateProgressBar() {
    const totalTasks = Object.keys(tasks[selectedDifficulty]).length;
    const percentage = (completedTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.innerText = `${Math.round(percentage)}%`;
}

function runCode() {
    const code = document.getElementById('code-editor').value;
    const feedback = document.getElementById('feedback');
    const taskId = document.querySelector('.task-item.active').getAttribute('data-task-id');

    feedback.innerHTML = '';
    
    try {
        const userFunction = new Function(code);
        const result = [];
        console.log = function(message) {
            result.push(message);
        };
        
        userFunction();
        
        if (result.join(',') === tasks[selectedDifficulty][taskId].solution) {
            feedback.innerHTML = '<p class="alert alert-success">Correct!</p>';
            completedTasks++;
            updateProgressBar();
            saveProgress();
        } else {
            feedback.innerHTML = `<p class="alert alert-danger">Try again. The output was: ${result.join(', ')}</p>`;
        }
    } catch (error) {
        feedback.innerHTML = `<p class="alert alert-danger">Error: ${error.message}</p>`;
    }
}

function showHint() {
    const taskId = document.querySelector('.task-item.active').getAttribute('data-task-id');
    const hint = tasks[selectedDifficulty][taskId].hint;
    document.getElementById('task-hint').innerHTML = `<strong>Hint:</strong> ${hint}`;
}

function saveProgress() {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

window.onload = function() {
    filterTasksByDifficulty();
    updateProgressBar();
};
