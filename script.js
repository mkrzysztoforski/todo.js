const columns = {
    todo: document.getElementById("todo"),
    inProgress: document.getElementById("inProgress"),
    done: document.getElementById("done"),
};

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
const setTasks = (tasks) => localStorage.setItem("tasks", JSON.stringify(tasks));

const createTaskElement = (task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.classList.add("task");
    li.draggable = true;
    li.dataset.id = task.id;
    li.dataset.status = task.status;

    li.style.transition = "transform 0.2s ease-in-out, opacity 0.2s";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
        li.style.opacity = "0";
        li.style.transform = "scale(0.9)";
        setTimeout(() => {
            li.remove();
            removeTask(task.id);
        }, 200);
    });

    li.appendChild(deleteBtn);
    return li;
};

const addTask = (text) => {
    if (text.trim() === "") return;

    const tasks = getTasks();
    const newTask = { id: Date.now(), text, status: "todo" };
    tasks.push(newTask);
    setTasks(tasks);

    const taskElement = createTaskElement(newTask);
    taskElement.style.opacity = "0";
    columns.todo.appendChild(taskElement);
    setTimeout(() => taskElement.style.opacity = "1", 10);
};

const removeTask = (id) => {
    const tasks = getTasks().filter(task => task.id !== id);
    setTasks(tasks);
};

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

const loadTasks = () => {
    getTasks().forEach(task => {
        columns[task.status].appendChild(createTaskElement(task));
    });
};

document.querySelectorAll(".column").forEach(column => {
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text");
        const taskElement = document.querySelector(`[data-id='${id}']`);
        const newStatus = column.id;
        taskElement.dataset.status = newStatus;
        
        taskElement.style.opacity = "0.5";
        setTimeout(() => {
            column.appendChild(taskElement);
            taskElement.style.opacity = "1";
        }, 200);
        
        const tasks = getTasks().map(task => task.id == id ? { ...task, status: newStatus } : task);
        setTasks(tasks);
    });
});

document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task")) {
        e.dataTransfer.setData("text", e.target.dataset.id);
        e.target.style.opacity = "0.5";
    }
});

document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("task")) {
        e.target.style.opacity = "1";
    }
});

loadTasks();
