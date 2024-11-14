document.addEventListener("DOMContentLoaded", loadTasks);

let sortOrder = 'newest'; // Controla el orden de las tareas (nuevas o viejas)
let filterStatus = 'all'; // Controla el estado del filtro: all, completed o pending

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText) {
    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);
    taskInput.value = "";
    renderTasks();
  }
}

function handleEnter(event) {
  if (event.key === "Enter") {
    addTask();
  }
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  let tasks = getTasks();

  // Ordenar las tareas según el valor de sortOrder
  if (sortOrder === 'newest') {
    tasks = tasks.reverse();
  }

  // Filtrar tareas según el valor de filterStatus
  if (filterStatus === 'completed') {
    tasks = tasks.filter(task => task.completed);
  } else if (filterStatus === 'pending') {
    tasks = tasks.filter(task => !task.completed);
  }

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    listItem.innerHTML = `
      <input type="checkbox" data-index="${index}" ${task.completed ? "checked" : ""} onclick="toggleTaskCompletion(${index})">
      <span>${task.text}</span>
    `;
    taskList.appendChild(listItem);
  });
}

function toggleTaskCompletion(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function openModal() {
  const modal = document.getElementById("confirmModal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("confirmModal");
  modal.style.display = "none";
}

function deleteSelectedTasks() {
  const tasks = getTasks();
  const updatedTasks = tasks.filter((task, index) => {
    const checkbox = document.querySelector(`input[data-index="${index}"]`);
    return !checkbox.checked;
  });
  saveTasks(updatedTasks);
  closeModal();
  renderTasks();
}

function toggleSortOrder() {
  sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
  renderTasks();
}

// Cambia el filtro de manera cíclica entre 'all', 'completed' y 'pending'
function cycleFilter() {
  if (filterStatus === 'all') {
    filterStatus = 'completed';
    document.getElementById("filterBtn").textContent = "Mostrar Completadas";
  } else if (filterStatus === 'completed') {
    filterStatus = 'pending';
    document.getElementById("filterBtn").textContent = "Mostrar Por Hacer";
  } else {
    filterStatus = 'all';
    document.getElementById("filterBtn").textContent = "Mostrar Todas";
  }
  renderTasks();
}

function deleteCompletedTasks() {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => !task.completed);
  saveTasks(updatedTasks);
  renderTasks();
}
