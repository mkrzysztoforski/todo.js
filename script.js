const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const getTasks = () => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
};

const setTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const addTask = (text, save = true) => {
    if (text.trim() === "") return;

    const li = document.createElement("li");
    li.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Usuń";
    deleteBtn.addEventListener("click", () => {
        li.remove();
        removeTask(text);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    if (save) {
        const tasks = getTasks();
        tasks.push(text);
        setTasks(tasks);
    }
}

const removeTask = (text) => {
    const tasks = getTasks().filter(task => task !== text);
    setTasks(tasks);
}

addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
    taskInput.value = "";
});

taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
        taskInput.value = "";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    getTasks().forEach(task => addTask(task, false));
});
