const taskInput = document.getElementById("task-input");
const addBtn = document.querySelector(".fa-plus");
const editBtn = document.querySelector(".fa-check");
const alert_message = document.getElementById("alert-message");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const filterBtns = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Show alert
const showAlert = (message, type) => {
    alert_message.innerHTML = "";
    const alert = document.createElement("p");
    alert.innerText = message;
    alert.classList.add(`alert-${type}`);
    alert_message.appendChild(alert);
    // Delete alert after 2 seconds
    setTimeout(() => {
        alert.remove();
    }, 2000);
}

// Save todos in local storage
const saveTodosToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}


// Show edit and delete buttons
const showActions = (e, id) => {
    e.outerHTML = `<i class="fa-solid fa-angle-right" onclick="hideActions(this)"></i><i class="fa-solid fa-edit" onclick="editTodo('${id}')"></i><i class="fa-solid fa-xmark" onclick="deleteTodo('${id}')"></i>`
}


// Hide the edit and delete buttons and show the three dots button
const hideActions = (e, id) => {
    e.parentElement.innerHTML = `<i class="fa-solid fa-ellipsis" onclick="showActions(this , '${id}')"></i>`;
}


// Display todos
const displayTodos = (data) => {
    const todosList = data || todos;
    todoList.innerHTML = "";

    if (!todos.length) {
        todoList.innerHTML = `<p>No task found!</p>`;
        return;
    }
    todosList.forEach(todo => {
        const task = `
        <li class="${todo.completed ? "done" : ""}"><div class="tick active" onclick="toggleStatus('${todo.id}')"></div><div class="circle" onclick="toggleStatus('${todo.id}')"></div><p class="nameTask">${todo.task}</p><div class="actions"><i class="fa-solid fa-ellipsis" onclick="showActions(this , '${todo.id}')"></i></div></li>`;
        todoList.innerHTML += task;
    })
}


// Change todo status (completed or pending)
const toggleStatus = (id) => {
    const todo = todos.find(todo => todo.id === id)
    todo.completed = !todo.completed;
    saveTodosToLocalStorage();
    displayTodos();
    showAlert("Todo changed successfully", "success")
}



// Add a new task(todo)
const addTask = () => {
    const task = taskInput.value;
    if (task.trim()) {
        todoList.innerHTML = "";
        const todo = {
            id: new Date().getTime().toString(),
            task,
            completed: false
        }
        todos.push(todo);
        taskInput.value = "";
        showAlert("Task added successfully", "success");
        saveTodosToLocalStorage();
        displayTodos();
    }
    else {
        showAlert("Please enter a task!", "error");
    }
}


// Delete all tasks(todos) by clicking the Delete All button
deleteAllBtn.addEventListener("click", () => {
    if (todos.length) {
        todos = [];
        saveTodosToLocalStorage();
        todoList.innerHTML = "";
        showAlert("All tasks deleted successfully", "success");
    }
    else {
        showAlert("There is nothing to delete", "error")
    }

})

// Delete a todo
const deleteTodo = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    todos = newTodos;
    saveTodosToLocalStorage();
    displayTodos();
    showAlert("Task deleted successfully", "success")
}


// Edit todo
const editTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    taskInput.focus();
    taskInput.value = todo.task;
    addBtn.style.display = "none";
    editBtn.style.display = "flex"
    editBtn.dataset.id = id;
}

// Apply edit
const applyEdit = (e) => {
    const id = e.target.dataset.id;
    const todo = todos.find(todo => todo.id === id);
    todo.task = taskInput.value;
    taskInput.value = "";
    editBtn.style.display = "none";
    addBtn.style.display = "flex";
    saveTodosToLocalStorage();
    displayTodos();
    showAlert("Task edited successfully", "success")

}


// Categorize tasks(todos)
const filterTodos = e => {
    //Remove all active classes and add to the clicked button
    filterBtns.forEach(btn => btn.classList.remove("active"))
    e.target.classList.add("active");

    let filteredTodos = null;
    const filter = e.target.dataset.filter;
    switch (filter) {
        case "pending":
            filteredTodos = todos.filter(todo => todo.completed === false)
            break;
        case "completed":
            filteredTodos = todos.filter(todo => todo.completed === true)
            break;
        default:
            filteredTodos = todos;
            break;
    }
    displayTodos(filteredTodos)
}



window.addEventListener("load", displayTodos())
addBtn.addEventListener("click", addTask);
editBtn.addEventListener("click", applyEdit);
filterBtns.forEach(btn => {
    btn.addEventListener("click", filterTodos)
})



