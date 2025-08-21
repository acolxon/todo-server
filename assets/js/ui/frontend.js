import "./contextMenu.js";
import "./animation.js";
import "./render.js";
import { editMode, editingTodo, resetState } from "../core/stateTasks.js";
import { closeChangeTodoTextRedactor } from "./render.js";

document.addEventListener("DOMContentLoaded", () => {
    const inputTask = document.querySelector("#taskInput");
    const buttonNewTask = document.querySelector("#newTodo");
    const closeRedactorBtn = document.getElementById("close-redactor");

    function resetForm() {
        inputTask.value = "";
        buttonNewTask.classList.remove("active-button");
        resetState();
    }

    // Инпут реагирует на то что Пользователь пишет
    inputTask.addEventListener("input", () => {
        if (inputTask.value.trim().length > 0) {
            buttonNewTask.classList.add("active-button");
        } else {
            buttonNewTask.classList.remove("active-button");
        }
    });

    buttonNewTask.addEventListener("click", (e) => {
        e.preventDefault();

        const text = inputTask.value.trim(); // 👈 вот его нужно брать отсюда
        if (!text) return;

        if (editMode) {
            // Редактирование
            document.dispatchEvent(
                new CustomEvent("todoTextChanged", {
                    detail: { id: editingTodo.id, text },
                })
            );
        } else {
            // Добавление
            document.dispatchEvent(
                new CustomEvent("createNewTodo", { detail: { text } })
            );
        }

        resetForm();

        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    });

    closeRedactorBtn.addEventListener("click", () => {
        closeChangeTodoTextRedactor();
    });

    document.addEventListener("todosRendered", () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });

        updateTaskWidths();
    });

    // Делает так чтобы все задачи(todo) были прижаты к правому краю
    // Пришлось использовать этот метод так как другого способа не было
    // Чтобы задачка была прижата к парвому краю с анимацией, справ на лево, слева на право :)
    function updateTaskWidths() {
        const todos = document.querySelectorAll(".task");
        todos.forEach((el) => {
            const width = el.offsetWidth; // новая ширина
            el.style.setProperty("--task-width", width + "px");
        });
    }
    // при ресайзе окна
    window.addEventListener("resize", updateTaskWidths);
});
