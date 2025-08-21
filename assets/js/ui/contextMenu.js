// Здесь всё что связано с Контекстным меню (изменение и удаление задач)

import { hide, show } from "./animation.js";
import {
    openChangeTodoTextRedactor,
    closeChangeTodoTextRedactor,
} from "./render.js";

document.addEventListener("DOMContentLoaded", () => {
    const context = document.getElementById("context"); // фон
    const contextMenu = document.getElementById("context-block"); // меню
    const changeBtn = document.getElementById("change_todo");
    const deleteBtn = document.getElementById("delete_todo");
    const todoDone = document.getElementById("todo_done");
    const notCompletedBtn = document.getElementById("not_completed_btn");

    let todo;

    // контекстное меню на задачах
    document.addEventListener("contextmenu", (e) => {
        todo = e.target.closest(".task");
        if (!todo) return;
        if (todo.dataset.done === "true") {
            todoDone.style.display = "none";
            notCompletedBtn.style.display = "block";
        }
        if (todo.dataset.done === "false") {
            todoDone.style.display = "block";
            notCompletedBtn.style.display = "none";
        }
        e.preventDefault();
        showContextMenu(e);
    });

    // скрытие при клике вне меню
    document.addEventListener("click", (e) => {
        if (
            !e.target.closest(".tasks") &&
            !e.target.closest("#context-block")
        ) {
            hide(context);
            hide(contextMenu);
        }
    });

    // скрытие при ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hide(context);
            hide(contextMenu);
        }
    });

    // изменение задачи
    changeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const event = new CustomEvent("changeTextTodoChecking", {
            detail: todo,
        });
        document.dispatchEvent(event);

        hide(context);
        hide(contextMenu);
    });

    document.addEventListener("todoReadyForEdit", (todo) => {
        openChangeTodoTextRedactor(todo.detail);
    });

    // удаление задачи
    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.dispatchEvent(
            new CustomEvent("deleteTodoChecking", {
                detail: todo,
            })
        );
        hide(context);
        hide(contextMenu);
    });

    todoDone.addEventListener("click", (e) => {
        e.preventDefault();
        document.dispatchEvent(
            new CustomEvent("todoDoneChecking", {
                detail: todo,
            })
        );
        hide(context);
        hide(contextMenu);
    });

    notCompletedBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.dispatchEvent(
            new CustomEvent("notCompletedTodoChecking", {
                detail: todo,
            })
        );
        hide(context);
        hide(contextMenu);
    });
    function showContextMenu(e) {
        const menuHeight = contextMenu.offsetHeight;
        const menuWidth = contextMenu.offsetWidth;
        const pageWidth = document.documentElement.clientWidth;
        const pageHeight = document.documentElement.clientHeight;

        let posX = e.clientX;
        let posY = e.clientY + window.scrollY;

        if (posX + menuWidth > pageWidth) posX = pageWidth - menuWidth - 10;
        if (posY + menuHeight > pageHeight + window.scrollY)
            posY = pageHeight + window.scrollY - menuHeight - 10;

        contextMenu.style.left = `${posX}px`;
        contextMenu.style.top = `${posY}px`;

        show(context);
        show(contextMenu);
    }
});
