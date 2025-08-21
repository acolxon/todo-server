// управляет бизнес-логикой (добавить, удалить, обновить, отдать все таски).
// Мозг всего приложения

import {
    loadTodoItems,
    createTodoItem,
    getTodoItem,
    changeTextTodo,
    deleteTodoItem,
    changeDoneTodo,
} from "../api/request.js";

import { show, hide } from "../ui/animation.js";
import queryDateType from "./queryDateType.js";
import {
    renderTodo,
    renderAllTodos,
    openChangeTodoTextRedactor,
    updateTextTodo,
    closeChangeTodoTextRedactor,
    deleteTodoFromDOM,
    isDoneOrNotRenderDOM,
} from "../ui/render.js";
import {
    setAllTodosState,
    updateStateTodosGroup,
    getAllTodoState,
    resetState,
} from "../core/stateTasks.js";

document.addEventListener("createNewTodo", (e) => {
    const { text } = e.detail;

    createTodoItem(text).then((newTodo) => {
        updateStateTodosGroup(newTodo.createdAt, newTodo);
        renderTodo(newTodo);
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const todos = await loadTodoItems(); // загружаем с сервера
        setAllTodosState(todos); // обновляем состояние приложения
        const todosState = getAllTodoState();
        renderAllTodos(todosState);
    } catch (err) {
        console.error("Ошибка при загрузке задач:", err);
    }
});

document.addEventListener("changeTextTodoChecking", (e) => {
    handleTodoCheck(e, "todoReadyForEdit");
});

document.addEventListener("deleteTodoChecking", (e) => {
    handleTodoCheck(e, "todoReadyForDelete");
});

document.addEventListener("todoDoneChecking", (e) => {
    handleTodoCheck(e, "todoReadyForDone");
});

document.addEventListener("notCompletedTodoChecking", (e) => {
    handleTodoCheck(e, "todoReadyForNotCompleted");
});

document.addEventListener("todoTextChanged", async (e) => {
    try {
        await changeTextTodo(e.detail.id, e.detail.text);
        updateTextTodo(e.detail.id, e.detail.text);
        closeChangeTodoTextRedactor();
    } catch (err) {
        console.log(err);
    }
});

document.addEventListener("todoReadyForDelete", async (e) => {
    const todoId = e.detail.id;
    deleteTodoItem(todoId);
    deleteTodoFromDOM(todoId);
});

document.addEventListener("todoReadyForDone", async (e) => {
    const todoId = e.detail.id;
    await changeDoneTodo(todoId, "true");
    isDoneOrNotRenderDOM(todoId, "true");
});

document.addEventListener("todoReadyForNotCompleted", async (e) => {
    const todoId = e.detail.id;
    await changeDoneTodo(todoId, "false");
    isDoneOrNotRenderDOM(todoId, "false");
});

async function handleTodoCheck(e, nextEventName) {
    const todoElem = e.detail;

    try {
        const todo = await getTodoItem(todoElem.dataset.id);
        if (!todo) throw new Error("Задача не найдена");

        const event = new CustomEvent(nextEventName, { detail: todo });
        document.dispatchEvent(event);
    } catch (err) {
        alert("error " + err);
    }
}
