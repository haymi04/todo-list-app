

    let totalTasks = 0;
    let completedTasks = 0;
    let tasks = [];
    let notes = [];

// Function to show a success popup
    function showPopup() {
  document.getElementById('successPopup').style.display = 'flex';
  setTimeout(closePopup, 2000); // Auto-close after 2 seconds
}

function closePopup() {
  document.getElementById('successPopup').style.display = 'none';
}
//Dark Mode Toggle Function
function toggleDarkMode() {
   document.body.classList.toggle('dark-mode');
  const btn = document.getElementById('darkModeBtn');
  if(document.body.classList.contains('dark-mode')) {
    btn.textContent = "☀️ Light Mode";
  } else {
    btn.textContent = "🌙 Dark Mode";
  }
}
    
// Function to handle the progress bar and task management
function updateProgress() {
      if (totalTasks === 0) {
        setProgress(0);
        return;
      }
      const percent = Math.round((completedTasks / totalTasks) * 100);
      setProgress(percent);
    }

    function setProgress(percent) {
      const circle = document.getElementById("progressBar");
      const text = document.getElementById("progressText");
      const radius = 50;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percent / 100) * circumference;

      circle.style.strokeDashoffset = offset;
      text.textContent = percent + "%";
      let color = "#e74c3c"; // red
if (percent > 70) color = "#48ca5e"; // green
else if (percent > 40) color = "#ffb347"; // orange
document.getElementById("progressBar").setAttribute("stroke", color);
    }

       function addTask() {
      const taskInput = document.getElementById("taskInput");
      const taskText = taskInput.value.trim();
      if (taskText === "") return;

      const task = {
        text: taskText,
        completed: false,
        dateAdded: new Date().toDateString()
      };
      tasks.push(task);
      totalTasks++;
      saveTasks();
      renderTasks(tasks);
      updateProgress();
      taskInput.value = "";
    }

    function renderTasks(taskArray) {
      document.querySelector(".todo-container").style.display = "block";
      document.querySelector(".progress-section").style.display = "block";
      document.getElementById("notesSection").style.display = "none";

      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";

taskArray.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.textContent = task.text;

        const buttonsDiv = document.createElement("div");

        const doneButton = document.createElement("button");
        doneButton.textContent = task.completed ? "Undo" : "Done";
        doneButton.onclick = () => {
            const wasCompleted = tasks[index].completed;
  tasks[index].completed = !tasks[index].completed;
  completedTasks += tasks[index].completed ? 1 : -1;
  saveTasks();
  renderTasks(tasks);
  updateProgress();
  // Show popup only if marking as completed now
  if (!wasCompleted && tasks[index].completed) {
    showPopup();
  }
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
          if (tasks[index].completed) completedTasks--;
          totalTasks--;
          tasks.splice(index, 1);
          saveTasks();
          renderTasks(tasks);
          updateProgress();
        };

        buttonsDiv.appendChild(doneButton);
        buttonsDiv.appendChild(deleteButton);
        li.appendChild(span);
        li.appendChild(buttonsDiv);
        taskList.appendChild(li);
         taskInput.value = "";
      });
    }




    

    function addNote() {
      const noteInput = document.getElementById("noteInput");
      const noteText = noteInput.value.trim();
      if (noteText === "") return;

      notes.push(noteText);
      saveNotes();
      renderNotes();
      noteInput.value = "";
    }

    function renderNotes() {
      document.querySelector(".todo-container").style.display = "none";
      document.querySelector(".progress-section").style.display = "none";
      document.getElementById("notesSection").style.display = "block";

      const notesList = document.getElementById("notesList");
      notesList.innerHTML = "";

      notes.forEach((note, index) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = note;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
          notes.splice(index, 1);
          saveNotes();
          renderNotes();
        };

        li.appendChild(span);
        li.appendChild(deleteButton);
        notesList.appendChild(li);
      });
    }

    function showAllTasks() {
      renderTasks(tasks);
    }

    function showCompletedTasks() {
      const completed = tasks.filter(task => task.completed);
      renderTasks(completed);
    }


    function showTodaysTasks() {
      const today = new Date().toDateString();
      const todaysTasks = tasks.filter(task => task.dateAdded === today);
      renderTasks(todaysTasks);
    }

    function showNotesSection() {
      renderNotes();
    }

    function saveTasks() {
      localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    function loadTasks() {
      const storedTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
      tasks = storedTasks;
      totalTasks = tasks.length;
      completedTasks = tasks.filter(t => t.completed).length;
    }

    function saveNotes() {
      localStorage.setItem("todoNotes", JSON.stringify(notes));
    }

    function loadNotes() {
      notes = JSON.parse(localStorage.getItem("todoNotes")) || [];
    }

    document.getElementById("completedTaskLink").addEventListener("click", (e) => {
      e.preventDefault();
      showCompletedTasks();
    });

    document.getElementById("todaysListLink").addEventListener("click", (e) => {
      e.preventDefault();
      showTodaysTasks();
    });

    document.getElementById("notesLink").addEventListener("click", (e) => {
      e.preventDefault();
      showNotesSection();
    });

    window.onload = function () {
      loadTasks();
      loadNotes();
      showAllTasks();
      updateProgress();
    };
  