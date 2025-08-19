export function show(item, customDisplay = "block") {
    item.style.display = customDisplay;
    requestAnimationFrame(() => {
        item.classList.add("show");
        item.dataset.visible = "true"; // ставим флаг, что элемент показан
    });
}

export function hide(item) {
    if (item.dataset.visible !== "true") return; // выходим, если show не вызывался

    item.classList.remove("show");
    item.addEventListener(
        "transitionend",
        () => {
            item.style.display = "none";
            item.dataset.visible = "false";
        },
        { once: true }
    );
}
