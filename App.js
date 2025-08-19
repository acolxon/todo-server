import {
    loadTodoItems,
    createTodoItem,
    changeTextTodo,
    deleteTodoItem,
} from "./request.js";

import { show, hide } from "./animation.js";
import queryDateType from "./queryDateType.js";

document.addEventListener("DOMContentLoaded", () => {
    const tasksList = document.getElementById("tasksList");
    const button = document.getElementById("button");
    const input = document.getElementById("taskInput");
    const changeBlock = document.querySelector(".task_change");
    tasksList.innerHTML = "";

    let allTodoGroupByDate = {};

    loadTodoItems()
        .then((data) => {
            // группируем
            allTodoGroupByDate = {};
            data.forEach((item) => {
                const dateType = queryDateType(item.createdAt);
                if (dateType === "Неверная дата") return;

                if (!allTodoGroupByDate[dateType]) {
                    allTodoGroupByDate[dateType] = [];
                }
                allTodoGroupByDate[dateType].push(item);
            });

            // рендерим все группы
            renderAllTodo();
            document.dispatchEvent(new Event("todosRendered"));
        })
        .catch((err) => console.error("Ошибка:", err));

    // 🔹 Добавление новой задачи
    button.addEventListener("click", async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        if (changeBlock.dataset.visible == "true" && window.currentTodo) {
            // редактирование
            const span = window.currentTodo.querySelector("span");
            span.textContent = text;
            changeTextTodo(window.currentTodo.dataset.id, text);

            hide(changeBlock);
            button.classList.remove("active-button");
            input.value = "";

            if (!window.currentTodo.querySelector("p")) {
                const edited = document.createElement("p");
                edited.textContent = "Ред.";
                edited.classList.add("todo-edited");
                window.currentTodo.append(edited);
            }
            return;
        }

        // добавление
        const newTask = await createTodoItem(text);
        addTaskToDOM(newTask, true);

        input.value = "";
        button.classList.remove("active-button");
        window.currentTodo = null;
    });

    // 🔹 Добавление одной задачи в DOM
    function addTaskToDOM(item, isNewTodo) {
        const listItem = buildTaskElement(item, isNewTodo);

        const dateType = queryDateType(item.createdAt);
        if (dateType === "Неверная дата") return;

        // ищем группу
        let dateGroup = tasksList.querySelector(`ul[data-group="${dateType}"]`);
        if (!dateGroup) {
            dateGroup = document.createElement("ul");
            dateGroup.dataset.group = dateType;
            dateGroup.innerHTML = `<h4>${dateType}</h4>`;
            tasksList.append(dateGroup);
        }

        dateGroup.append(listItem);

        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }

    // 🔹 Удаление одной задачи
    function removeTaskFromDOM(taskId) {
        const task = tasksList.querySelector(`li[data-id="${taskId}"]`);
        if (task) {
            task.remove();

            // если в группе задач больше нет → удалить группу
            const group = task.closest("ul");
            if (group && group.querySelectorAll("li").length === 0) {
                group.remove();
            }
        }
    }

    // 🔹 Перерисовка всех задач (только при загрузке!)
    function renderAllTodo() {
        tasksList.innerHTML = "";

        Object.entries(allTodoGroupByDate).forEach(([GroupTitle, items]) => {
            const dateGroup = document.createElement("ul");
            dateGroup.dataset.group = GroupTitle;
            dateGroup.innerHTML = `<h4>${GroupTitle}</h4>`;

            items.forEach((item) => {
                const listItem = buildTaskElement(item);
                dateGroup.append(listItem);
            });
            tasksList.append(dateGroup);
        });

        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }

    // 🔹 Конструктор элемента задачи
    function buildTaskElement(item, isNewTodo) {
        const listItem = document.createElement("li");
        isNewTodo
            ? listItem.classList.add("task", "show")
            : listItem.classList.add("task");

        listItem.dataset.id = item.id;

        const span = document.createElement("span");
        span.textContent = item.text;
        listItem.append(span);

        if (item.edited) {
            const edited = document.createElement("p");
            edited.textContent = "Ред.";
            edited.classList.add("todo-edited");
            listItem.append(edited);
        }

        if (item.done) {
            listItem.classList.add("done");
            listItem.dataset.done = "true";
        } else {
            listItem.dataset.done = "false";
        }

        return listItem;
    }
});

// import {
//     loadTodoItems,
//     createTodoItem,
//     getTodoItem,
//     changeTextTodo,
//     deleteTodoItem,
// } from "./request.js";

// import { show, hide } from "./animation.js";
// import queryDateType from "./queryDateType.js";

// document.addEventListener("DOMContentLoaded", () => {
//     const tasksList = document.getElementById("tasksList");
//     const button = document.getElementById("button");
//     const input = document.getElementById("taskInput");
//     const changeBlock = document.querySelector(".task_change");
//     tasksList.innerHTML = "";

//     let allTodoGroupByDate = {};

//     // Загрузка существующих задач
//     loadTodoItems()
//         .then((data) => {
//             data.forEach((item) => addTaskToDOM(item));
//             window.scrollTo({
//                 top: document.documentElement.scrollHeight,
//                 behavior: "smooth",
//             });
//             document.dispatchEvent(new Event("todosRendered"));
//         })
//         .catch((err) => console.error("Ошибка:", err));

//     // Добавление новой задачи
//     button.addEventListener("click", async (e) => {
//         e.preventDefault();
//         const text = input.value.trim();
//         let edited = null;
//         if (text.length > 0) {
//             if (changeBlock.dataset.visible == "true" && window.currentTodo) {
//                 const span = window.currentTodo.querySelector("span");
//                 span.textContent = text;
//                 changeTextTodo(window.currentTodo.dataset.id, text);

//                 hide(changeBlock);

//                 button.classList.remove("active-button");
//                 input.value = "";

//                 if (!window.currentTodo.querySelector("p")) {
//                     edited = document.createElement("p");
//                     edited.textContent = "Ред.";
//                     edited.classList.add("todo-edited");
//                     window.currentTodo.append(edited);
//                 }
//                 return;
//             }
//             const newTask = await createTodoItem(text);
//             addTaskToDOM(newTask, true);
//             input.value = "";
//             button.classList.remove("active-button");
//             window.currentTodo = null;
//         }
//     });
//     function addTaskToDOM(item, isNewTodo) {
//         const listItem = document.createElement("li");

//         isNewTodo
//             ? listItem.classList.add("task", "show")
//             : listItem.classList.add("task");

//         listItem.dataset.id = item.id;

//         const span = document.createElement("span");
//         span.textContent = item.text;
//         listItem.append(span);

//         if (item.edited) {
//             const edited = document.createElement("p");
//             edited.textContent = "Ред.";
//             edited.classList.add("todo-edited");
//             listItem.append(edited);
//         }
//         if (item.done) {
//             listItem.classList.add("done");
//             listItem.dataset.done = "true";
//         } else {
//             listItem.classList.remove("done");
//             listItem.dataset.done = "false";
//         }

//         const dateType = queryDateType(item.createdAt);
//         if (dateType === "Неверная дата") return;

//         // сохраняем в объект
//         if (!allTodoGroupByDate[dateType]) {
//             allTodoGroupByDate[dateType] = [];
//         }
//         allTodoGroupByDate[dateType].push(listItem);

//         // === добавляем сразу в DOM ===
//         let dateGroup = tasksList.querySelector(`ul[data-group="${dateType}"]`);

//         if (!dateGroup) {
//             dateGroup = document.createElement("ul");
//             dateGroup.dataset.group = dateType;
//             dateGroup.innerHTML = `<h4>${dateType}</h4>`;
//             tasksList.append(dateGroup);
//         }

//         dateGroup.append(listItem);

//         window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: "smooth",
//         });
//     }

//     function renderAllTodo() {
//         tasksList.innerHTML = "";

//         Object.entries(allTodoGroupByDate).forEach(([GroupTitle, items]) => {
//             const dateGroup = document.createElement("ul");
//             dateGroup.innerHTML = `<h4>${GroupTitle}</h4>`;

//             items.forEach((el) => {
//                 dateGroup.append(el);
//             });
//             tasksList.append(dateGroup);
//         });

//         window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: "smooth",
//         });

//         console.log("RENDER ALL!!!");
//     }
// });
