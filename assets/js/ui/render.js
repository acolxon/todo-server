// // Здесь будет только функций для отрисовки ДОМ
import queryDateType from "../core/queryDateType.js";
import { resetState, setEditMode } from "../core/stateTasks.js";

export function renderAllTodos(state) {
    const tasksList = document.getElementById("tasksList");
    tasksList.innerHTML = "";

    Object.entries(state).forEach(([GroupTitle, items]) => {
        const dateGroup = document.createElement("ul");
        dateGroup.innerHTML = `<h4>${GroupTitle}</h4>`;
        dateGroup.dataset.group = GroupTitle;

        items.forEach((el) => {
            const li = buildTaskElement(el);
            dateGroup.append(li);
        });
        tasksList.append(dateGroup);
    });
    document.dispatchEvent(new Event("todosRendered"));
}

export function renderTodo(item) {
    const tasksList = document.getElementById("tasksList");
    const dateType = queryDateType(item.createdAt);

    let dateGroup = tasksList.querySelector(`ul[data-group="${dateType}"]`);
    if (!dateGroup) {
        dateGroup = document.createElement("ul");
        dateGroup.dataset.group = dateType;
        dateGroup.innerHTML = `<h4>${dateType}</h4>`;
        tasksList.append(dateGroup);
    }

    const listItem = buildTaskElement(item);

    dateGroup.append(listItem);
    document.dispatchEvent(new Event("todosRendered"));
}

function buildTaskElement(item) {
    const listItem = document.createElement("li");
    listItem.dataset.id = item.id;
    listItem.classList.add("task", "show");

    const span = document.createElement("span");
    span.textContent = item.text;
    listItem.append(span);
    listItem.dataset.edited = item.edited;

    if (item.edited) {
        const edited = document.createElement("p");
        edited.textContent = "Ред.";
        edited.classList.add("todo-edited");
        listItem.append(edited);
    }

    if (item.done) {
        listItem.dataset.done = "true";
        listItem.classList.add("done");
    } else {
        listItem.dataset.done = "false";
        listItem.classList.remove("done");
    }
    return listItem;
}

export function updateTextTodo(id, text) {
    const todoElem = document.querySelector(`[data-id="${id}"]`);
    if (todoElem) {
        const span = todoElem.querySelector("span");
        if (span) {
            span.textContent = text;
        }

        // Добавляем/обновляем "Ред."
        let edited = todoElem.dataset.edited;
        if (edited === "false") {
            const editedElem = document.createElement("p");
            editedElem.textContent = "Ред.";
            editedElem.classList.add("todo-edited");
            todoElem.append(editedElem);
            console.log("code working!!!");
        }
    }
}

export function deleteTodoFromDOM(id) {
    const todoElem = document.querySelector(`[data-id="${id}"]`);
    todoElem.classList.add("delete-todo");
    todoElem.addEventListener(
        "transitionend",
        () => {
            todoElem.remove();
            checkingGroupTodo();
        },
        {
            once: true,
        }
    );
}

export function openChangeTodoTextRedactor(todo) {
    const taskChange = document.querySelector(".task_change");
    const plug = document.querySelector(".plug");
    const todoTextForRedac = document.getElementById("todo-text");
    const button = document.getElementById("button");
    const inputTask = document.querySelector("#taskInput");

    taskChange.classList.add("show");
    plug.classList.add("show");

    todoTextForRedac.textContent = todo.text;

    setEditMode(true, todo);
}

export function closeChangeTodoTextRedactor() {
    const taskChange = document.querySelector(".task_change");
    const plug = document.querySelector(".plug");
    const todoTextForRedac = document.getElementById("todo-text");

    taskChange.classList.remove("show");
    plug.classList.remove("show");

    plug.addEventListener(
        "transitionend",
        () => {
            todoTextForRedac.textContent = "";
        },
        { once: true }
    );

    resetState();
}

// Функция для удаления группы, если она пустая
function checkingGroupTodo() {
    const todoGroup = document.querySelectorAll("[data-group]");

    todoGroup.forEach((group) => {
        const todos = group.querySelectorAll(".task");
        if (todos.length === 0) {
            group.remove();
        }
    });
}

// Функция проверки, выполнена задача или нет, для отрисовки в ДОМ
export function isDoneOrNotRenderDOM(id, isDone) {
    const todoElem = document.querySelector(`[data-id="${id}"]`);

    if (todoElem) {
        todoElem.dataset.done = isDone;
    }
    isDone == "true"
        ? todoElem.classList.add("done")
        : todoElem.classList.remove("done");
}
