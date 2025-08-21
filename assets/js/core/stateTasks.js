import queryDateType from "./queryDateType.js";

// /core/stateTasks.js
let allTodoGroupByDate = {};

// Получить текущее состояние
export function getAllTodoState() {
    return allTodoGroupByDate;
}

// Добавить новую задачу в состояние
export function updateStateTodosGroup(dateType, item) {
    if (!allTodoGroupByDate[dateType]) allTodoGroupByDate[dateType] = [];
    allTodoGroupByDate[dateType].push(item);
}

// Удалить задачу из состояния
export function removeTodoFromState(dateType, itemId) {
    if (!allTodoGroupByDate[dateType]) return;
    allTodoGroupByDate[dateType] = allTodoGroupByDate[dateType].filter(
        (el) => el.id !== itemId
    );
    if (allTodoGroupByDate[dateType].length === 0)
        delete allTodoGroupByDate[dateType];
}

// Можно добавить функцию для полной замены состояния при загрузке
export function setAllTodosState(todosByDate) {
    let grouped = {};

    todosByDate.forEach((item) => {
        const dateGroup = queryDateType(item.createdAt);

        if (dateGroup === "Неверная дата") {
            return;
        }

        if (!grouped[dateGroup]) {
            grouped[dateGroup] = [];
        }
        grouped[dateGroup].push(item);
    });

    allTodoGroupByDate = grouped;
}

export let editMode = false;
export let editingTodo = null;

export function setEditMode(mode, todo = null) {
    editMode = mode;
    editingTodo = todo;
}

export function resetState() {
    editMode = false;
    editingTodo = null;
}
