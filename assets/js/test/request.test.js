import { loadTodoItems } from "../api/request.js";
import { getTodoItem } from "../api/request";

import { createTodoItem } from "../api/request";

global.fetch = jest.fn();

describe("createTodoItem", () => {
    test("должен выбросить ошибку, если сервер вернул ошибку", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn(),
        });

        await expect(createTodoItem("test")).rejects.toThrow("HTTP error");
    });
});

global.fetch = jest.fn();

describe("loadTodoItems", () => {
    it("должен вернуть данные с API", async () => {
        const mockData = [
            { id: "1", text: "test" },
            { id: "2", text: "hello" },
        ];

        // эмулируем fetch
        fetch.mockResolvedValue({
            json: async () => mockData,
        });

        const result = await loadTodoItems();

        expect(fetch).toHaveBeenCalledWith(
            "https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo"
        );
        expect(result).toEqual(mockData);
    });
});

global.fetch = jest.fn();

describe("getTodoItem", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("должен вернуть данные при успешном запросе", async () => {
        const mockData = { id: 1, text: "Test" };

        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await getTodoItem(1);

        expect(fetch).toHaveBeenCalledWith(
            "https://68a0b61e6e38a02c58197a58.mockapi.io/api/todos/todo/1"
        );
        expect(result).toEqual(mockData);
    });

    test("должен бросить ошибку при ответе не ok", async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(getTodoItem(1)).rejects.toThrow("HTTP error! status: 404");
    });
});
