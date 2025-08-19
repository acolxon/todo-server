export default function normalizeDate(createdAt) {
    const date = new Date(createdAt); // сразу ISO строку парсим
    if (isNaN(date.getTime())) return "Неверная дата";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const day = date.getDate();
    const month = date.toLocaleString("ru-RU", { month: "long" });
    const year = date.getFullYear();

    if (dateOnly.getTime() === today.getTime()) {
        return "Сегодня";
    } else if (dateOnly.getTime() === yesterday.getTime()) {
        return "Вчера";
    } else if (year === now.getFullYear()) {
        return `${day} ${month}`;
    } else {
        return `${day} ${month} ${year} г.`;
    }
}
