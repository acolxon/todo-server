// Здесь будут только функций для запросов на БД

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
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
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
export async function changeDoneTodo(id, isDone) {
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
