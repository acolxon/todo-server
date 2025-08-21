// animation.js
export function show(item) {
    requestAnimationFrame(() => {
        item.classList.add("show");
        item.dataset.visible = "true";
    });
}

export function hide(item) {
    if (item.dataset.visible !== "true") return;

    item.classList.remove("show");
    item.dataset.visible = "false";
}
