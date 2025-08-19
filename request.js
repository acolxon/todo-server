// Доступные методы:
// GET /api/todos - получить список дел, query параметр owner фильтрует по владельцу
// POST /api/todos - создать дело, в теле запроса нужно передать объект { name: string, owner: string, done?: boolean }
// GET /api/todos/{id} - получить дело по его ID
// PATCH /api/todos/{id} - изменить дело с ID, в теле запроса нужно передать объект { name?: string, owner?: string, done?: boolean }
// DELETE /api/todos/{id} - удалить дело по ID)

export async function loadTodoItems() {
    const response = await fetch(
        "https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo"
    );
    const data = await response.json();

    return data;
}

export async function createTodoItem(text) {
    const response = await fetch(
        "https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                name: "Тимофей",
                createdAt: new Date().toISOString(),
            }),
        }
    );
    const data = await response.json();
    return data;
}
// createTodoItem();
export async function getTodoItem(id) {
    const response = await fetch(
        `https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo/${id}`
    );
    const data = await response.json();
}

export async function changeTextTodo(id, newText) {
    const response = await fetch(
        `https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo/${id}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: newText,
                edited: true,
            }),
        }
    );
    const data = await response.json();
    return data;
}
export async function hundleDoneTodo(id, isDone) {
    const response = await fetch(
        `https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo/${id}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                done: isDone,
            }),
        }
    );
    const data = await response.json();
    return data;
}

export async function deleteTodoItem(id) {
    const response = await fetch(
        `https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo/${id}`,
        {
            method: "DELETE",
        }
    );
    if (response.status === 404)
        console.log("Не удалось удалить дело, так как его не существует");
    const data = await response.json();
}
