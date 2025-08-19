import {
    loadTodoItems,
    createTodoItem,
    getTodoItem,
    changeTextTodo,
    deleteTodoItem,
    hundleDoneTodo,
} from "../api/request.js";

import { show, hide } from "./animation.js";

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskBtn = document.getElementById("button");
    const context = document.getElementById("context");
    const contextMenu = document.querySelector(".context_block");
    const contextMenuHeight = contextMenu.clientHeight;
    const deleteBtn = document.getElementById("delete_todo");
    const changeBtn = document.getElementById("change_todo");
    const changeBlock = document.querySelector(".task_change");
    const changeText = document.getElementById("todo-text");
    const closeChangeBlock = document.getElementById("close-redactor");

    // const isDoneBtn = document.getElementById("is_done_todo");
    const isDone = document.createElement("a");
    const isNotComplete = document.createElement("a");

    isDone.classList.add("context_block_btn");
    isNotComplete.classList.add("context_block_btn");
    isDone.textContent = "Выполнено";
    isNotComplete.textContent = "Не выполнено";

    let currentTodoId = null;
    let todo = null;

    taskInput.addEventListener("input", () => {
        taskInput.value.length > 0
            ? taskBtn.classList.add("active-button")
            : taskBtn.classList.remove("active-button");
    });

    document.addEventListener("todosRendered", () => {
        const todos = document.querySelectorAll(".task");
        todos.forEach((todo, index) => {
            setTimeout(() => {
                todo.classList.add("show");
            }, index * 50);
            console.log("frontend.js все отрисовал поочереди");
        });
    });

    // Делегирование событий для контекстного меню
    document.addEventListener("contextmenu", (e) => {
        todo = e.target.closest(".task");
        if (!todo) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        window.currentTodo = todo;
        currentTodoId = todo.dataset.id;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY - contextMenuHeight}px`;

        if (todo.dataset.done === "true") {
            contextMenu.append(isNotComplete);
            isDone.remove();
        } else {
            contextMenu.append(isDone);
            isNotComplete.remove();
        }
        show(context);
        setTimeout(() => show(contextMenu, "flex"), 300);
    });

    // Скрываем меню при клике в любом месте страницы
    document.addEventListener("click", () => {
        hide(contextMenu);
        setTimeout(() => hide(context), 200);
    });

    deleteBtn.addEventListener("click", async (e) => {
        if (currentTodoId) {
            e.preventDefault();
            await deleteTodoItem(currentTodoId);
            context.style.display = "none";
            todo.style.opacity = "0";
            setTimeout(() => {
                todo.style.display = "none";
                todo = null;
            }, 400);

            const parentElem = todo.parentElement;
            if (parentElem.children.length <= 2) {
                parentElem.remove();
            }
        }
    });

    changeBtn.addEventListener("click", () => {
        if (currentTodoId) {
            show(changeBlock, "flex");
            const span = todo.querySelector("span");
            changeText.textContent = span.textContent;
        }
    });

    closeChangeBlock.addEventListener("click", () => {
        hide(changeBlock);
    });

    isDone.addEventListener("click", () => {
        if (todo) {
            todo.classList.add("done");
            todo.dataset.done = "true";
            hundleDoneTodo(todo.dataset.id, true);
            todo = null;
        }
    });

    isNotComplete.addEventListener("click", () => {
        if (todo) {
            todo.classList.remove("done");
            todo.classList.add("not_complete");
            todo.dataset.done = "false";
            hundleDoneTodo(todo.dataset.id, false);
            todo = null;
        }
    });
});
