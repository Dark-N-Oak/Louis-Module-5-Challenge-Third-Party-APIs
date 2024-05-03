// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = parseInt(localStorage.getItem("nextId")) || 1;

// Generate Unique Task ID
function generateTaskId() {
    localStorage.setItem("nextId", nextId + 1);
    return nextId++;
}

// Create Task Card
function createTaskCard(task) {
    const cardHtml = `
        <div class="task-card card mb-3" id="task-${task.id}">
            <div class="card-header ${getCardHeaderColor(task)}">
                <h5 class="card-title">${task.title}</h5>
            </div>
            <div class="card-body">
                <p class="card-text">${task.description}</p>
                <p class="card-text">Deadline: ${task.deadline}</p>
                <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
            </div>
        </div>
    `;
    return cardHtml;
}

function getCardHeaderColor(task) {
    const today = new Date();
    const deadlineDate = new Date(task.deadline);

    if (deadlineDate.toDateString() === today.toDateString()) {
        return "bg-yellow";
    } else if (deadlineDate < today) {
        return "bg-red";
    } else {
        return "";
    }
}

function renderTaskList() {
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();

    taskList.forEach(task => {
        const cardHtml = createTaskCard(task);
        $(`#${task.status}-cards`).append(cardHtml);
    });

    $(".task-card").draggable({
        revert: "invalid",
        helper: "clone",
        zIndex: 1000 
    });
}

function handleAddTask(event) {
    event.preventDefault();
    const title = $("#title").val();
    const description = $("#description").val();
    const deadline = $("#deadline").val();
    const status = "todo"; 
    const id = generateTaskId();

    const newTask = { id, title, description, deadline, status };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();

    $("#title").val("");
    $("#description").val("");
    $("#deadline").val("");
}

function handleDeleteTask(event) {
    const taskId = $(this).data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id").split("-")[1];
    const newStatus = $(this).attr("id");

    taskList = taskList.map(task => {
        if (task.id == taskId) {
            task.status = newStatus;
        }
        return task;
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

$(document).ready(function () {
    renderTaskList();

    // Event listeners
    $("#formModal").on("hidden.bs.modal", function () {
        $(this).find("form")[0].reset();
    });

    $("#addTaskForm").submit(handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);

    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });

    $("#deadline").datepicker({
        dateFormat: "yy-mm-dd"
    });
});
