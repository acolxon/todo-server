// import { renderTodo } from "../ui/render";
// import * as queryDateTypeModule from "../core/queryDateType";

// beforeEach(() => {
//     document.body.innerHTML = `<ul id="tasksList"></ul>`;
// });

// // Мокаем queryDateType (чтобы не зависеть от логики дат)
// jest.spyOn(queryDateTypeModule, "default").mockReturnValue("Сегодня");

// test("должен создать новую группу, если её нет", () => {
//     const item = { id: 1, text: "Hello", createdAt: "2025-01-01" };

//     renderTodo(item);

//     const group = document.querySelector('ul[data-group="Сегодня"]');
//     expect(group).not.toBeNull();
//     expect(group.querySelector("li span").textContent).toBe("Hello");
// });

// test("должен добавить задачу в уже существующую группу", () => {
//     document.body.innerHTML = `
//     <ul id="tasksList">
//       <ul data-group="Сегодня"><h4>Сегодня</h4></ul>
//     </ul>
//   `;

//     const item = { id: 2, text: "New", createdAt: "2025-01-01" };

//     renderTodo(item);

//     const group = document.querySelector('ul[data-group="Сегодня"]');
//     expect(group.querySelectorAll("li").length).toBe(1);
// });
